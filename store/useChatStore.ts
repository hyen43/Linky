import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { ChatMessage, DerivedIdea, DrillDownResult, Note } from "../types";
import { drillDownIdea, processIdea } from "../lib/claude";
import { useCategoryStore } from "./useCategoryStore";
import { useAuthStore } from "./useAuthStore";
import { useSettingsStore } from "./useSettingsStore";
import { generateId } from "../lib/uuid";

let _msgId = 0;
const msgId = () => `msg-${++_msgId}-${Date.now()}`;

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "ai",
  content: "안녕하세요! 링키예요 👋\n아이디어가 떠올랐나요? 편하게 말해주세요.",
  createdAt: new Date(0),
};

// ─── DB ↔ 스토어 매핑 ────────────────────────────────────────────────────────

function noteFromDb(row: Record<string, unknown>): Note {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    rawContent: row.raw_content as string,
    summary: row.summary as string,
    contentType: row.content_type as Note["contentType"],
    tags: (row.tags as string[]) ?? [],
    title: row.title as string,
    categoryId: row.category_id as string | null,
    derivedIdeas: (row.derived_ideas as DerivedIdea[]) ?? [],
    titleOptions: (row.title_options as Note["titleOptions"]) ?? [],
    scheduledAt: row.scheduled_at ? new Date(row.scheduled_at as string) : null,
    confirmed: (row.confirmed as boolean | undefined) ?? true,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function noteToDb(note: Note) {
  return {
    id: note.id,
    user_id: note.userId,
    raw_content: note.rawContent,
    summary: note.summary,
    content_type: note.contentType,
    tags: note.tags,
    title: note.title,
    category_id: note.categoryId,
    derived_ideas: note.derivedIdeas,
    title_options: note.titleOptions,
    scheduled_at: note.scheduledAt?.toISOString() ?? null,
    created_at: note.createdAt.toISOString(),
    updated_at: note.updatedAt.toISOString(),
  };
}

// ─── 스토어 ──────────────────────────────────────────────────────────────────

interface ChatState {
  messages: ChatMessage[];
  notes: Note[];
  isRecording: boolean;
  initialized: boolean;
  drillDownResults: Record<string, DrillDownResult>;
  drillingDownKeys: string[];
  generatingIds: string[];

  initialize: () => Promise<void>;
  sendMessage: (text: string, categoryId?: string | null) => void;
  deleteNote: (noteId: string) => void;
  updateNote: (noteId: string, patch: { title?: string; content?: string; tags?: string[]; categoryId?: string | null }) => void;
  updateNoteTitle: (noteId: string, title: string) => void;
  saveNote: (data: { title: string; content: string; tags: string[]; categoryId?: string | null }) => void;
  toggleRecording: () => void;
  updateNoteCategory: (noteId: string, categoryId: string | null) => void;
  drillDown: (noteId: string, ideaIdx: number, idea: DerivedIdea, rawContent: string) => Promise<void>;
  generateAISuggestions: (noteId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [WELCOME],
  notes: [],
  isRecording: false,
  initialized: false,
  drillDownResults: {},
  drillingDownKeys: [],
  generatingIds: [],

  initialize: async () => {
    if (get().initialized) return;

    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId ?? "")
      .order("created_at", { ascending: true });

    if (error) { console.warn("notes fetch error:", error.message); return; }

    const notes = (data ?? []).map(noteFromDb);

    const drillDownResults: Record<string, DrillDownResult> = {};
    for (const row of data ?? []) {
      const results = row.drill_down_results as Record<string, DrillDownResult> | null;
      if (results) {
        for (const [k, v] of Object.entries(results)) {
          drillDownResults[k] = v;
        }
      }
    }

    set({ notes, drillDownResults, initialized: true });
  },

  sendMessage: (text, categoryId = null) => {
    const { categories } = useCategoryStore.getState();
    const resolvedCategoryId =
      categoryId ??
      categories.find((c) => c.name === "초안")?.id ??
      categories[0]?.id ??
      null;

    const userId = useAuthStore.getState().user?.id ?? "local";
    const now = new Date();
    const note: Note = {
      id: generateId(),
      userId,
      rawContent: text,
      summary: text.slice(0, 20),
      contentType: "idea",
      tags: [],
      title: text.length > 40 ? text.slice(0, 40) + "…" : text,
      categoryId: resolvedCategoryId,
      derivedIdeas: [],
      titleOptions: [],
      scheduledAt: null,
      confirmed: true,
      createdAt: now,
      updatedAt: now,
    };

    const userMsg: ChatMessage = {
      id: msgId(),
      role: "user",
      content: text,
      createdAt: now,
    };
    const aiMsg: ChatMessage = {
      id: msgId(),
      role: "ai",
      content: "저장됐어요! 탭해서 AI 추천을 확인해보세요 ✨",
      createdAt: new Date(now.getTime() + 1),
    };

    set((s) => ({
      messages: [...s.messages, userMsg, aiMsg],
      notes: [...s.notes, note],
    }));

    supabase.from("notes").insert(noteToDb(note)).then(({ error }) => {
      if (error) console.warn("note insert error:", error.message);
    });
  },

  deleteNote: (noteId) => {
    set((s) => ({
      notes: s.notes.filter((n) => n.id !== noteId),
    }));
    supabase.from("notes").delete().eq("id", noteId).then(({ error }) => {
      if (error) console.warn("note delete error:", error.message);
    });
  },

  updateNote: (noteId, patch) => {
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === noteId
          ? {
              ...n,
              ...(patch.title !== undefined && { title: patch.title }),
              ...(patch.content !== undefined && { rawContent: patch.content }),
              ...(patch.tags !== undefined && { tags: patch.tags }),
              ...(patch.categoryId !== undefined && { categoryId: patch.categoryId }),
              updatedAt: new Date(),
            }
          : n,
      ),
    }));
    const dbPatch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (patch.title !== undefined) dbPatch.title = patch.title;
    if (patch.content !== undefined) dbPatch.raw_content = patch.content;
    if (patch.tags !== undefined) dbPatch.tags = patch.tags;
    if (patch.categoryId !== undefined) dbPatch.category_id = patch.categoryId;
    supabase.from("notes").update(dbPatch).eq("id", noteId).then(({ error }) => {
      if (error) console.warn("note update error:", error.message);
    });
  },

  updateNoteTitle: (noteId, title) => {
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === noteId ? { ...n, title, updatedAt: new Date() } : n,
      ),
    }));
    supabase.from("notes").update({ title, updated_at: new Date().toISOString() })
      .eq("id", noteId).then(({ error }) => {
        if (error) console.warn("note update error:", error.message);
      });
  },

  saveNote: ({ title, content, tags, categoryId = null }) => {
    const note: Note = {
      id: generateId(),
      userId: useAuthStore.getState().user?.id ?? "local",
      rawContent: content,
      summary: content.slice(0, 60),
      contentType: "idea",
      tags,
      title,
      categoryId,
      derivedIdeas: [],
      titleOptions: [],
      scheduledAt: null,
      confirmed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((s) => ({ notes: [...s.notes, note] }));
    supabase.from("notes").insert(noteToDb(note)).then(({ error }) => {
      if (error) console.warn("note insert error:", error.message);
    });
  },

  toggleRecording: () => set((s) => ({ isRecording: !s.isRecording })),

  updateNoteCategory: (noteId, categoryId) => {
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === noteId ? { ...n, categoryId, updatedAt: new Date() } : n,
      ),
    }));
    supabase.from("notes").update({ category_id: categoryId, updated_at: new Date().toISOString() })
      .eq("id", noteId).then(({ error }) => {
        if (error) console.warn("note update error:", error.message);
      });
  },

  generateAISuggestions: async (noteId) => {
    const note = get().notes.find((n) => n.id === noteId);
    if (!note) return;
    if (note.derivedIdeas.length > 0 || note.titleOptions.length > 0) return;
    if (get().generatingIds.includes(noteId)) return;

    set((s) => ({ generatingIds: [...s.generatingIds, noteId] }));
    try {
      const input = note.rawContent.trim() || note.title;
      const platforms = useSettingsStore.getState().platforms;
      const result = await processIdea(input, platforms);

      const patch = {
        derivedIdeas: result.derivedIdeas,
        titleOptions: result.titleOptions,
        summary: note.summary || result.summary,
        contentType: note.contentType === "idea" ? result.contentType : note.contentType,
        updatedAt: new Date(),
      };
      set((s) => ({
        notes: s.notes.map((n) => n.id === noteId ? { ...n, ...patch } : n),
        generatingIds: s.generatingIds.filter((id) => id !== noteId),
      }));

      const dbPatch = {
        derived_ideas: result.derivedIdeas,
        title_options: result.titleOptions,
        updated_at: patch.updatedAt.toISOString(),
      };
      supabase.from("notes").update(dbPatch).eq("id", noteId).then(({ error }) => {
        if (error) console.warn("AI suggestions update error:", error.message);
      });
    } catch {
      set((s) => ({ generatingIds: s.generatingIds.filter((id) => id !== noteId) }));
    }
  },

  drillDown: async (noteId, ideaIdx, idea, rawContent) => {
    const key = `${noteId}-${ideaIdx}`;
    if (get().drillDownResults[key] || get().drillingDownKeys.includes(key)) return;

    set((s) => ({ drillingDownKeys: [...s.drillingDownKeys, key] }));
    try {
      const result = await drillDownIdea(idea, rawContent);

      const newResults = { ...get().drillDownResults, [key]: result };
      set((s) => ({
        drillDownResults: newResults,
        drillingDownKeys: s.drillingDownKeys.filter((k) => k !== key),
      }));

      const noteResults: Record<string, DrillDownResult> = {};
      for (const [k, v] of Object.entries(newResults)) {
        if (k.startsWith(noteId)) noteResults[k] = v;
      }
      supabase.from("notes").update({ drill_down_results: noteResults })
        .eq("id", noteId).then(({ error }) => {
          if (error) console.warn("drill_down update error:", error.message);
        });
    } catch {
      set((s) => ({ drillingDownKeys: s.drillingDownKeys.filter((k) => k !== key) }));
    }
  },
}));
