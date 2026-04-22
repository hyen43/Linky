import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { ChatMessage, DerivedIdea, DrillDownResult, Note } from "../types";
import { drillDownIdea, processIdea } from "../lib/claude";
import { useCategoryStore } from "./useCategoryStore";

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
  pendingNoteId: string | null;
  isTyping: boolean;
  isRecording: boolean;
  initialized: boolean;
  drillDownResults: Record<string, DrillDownResult>;
  drillingDownKeys: string[];

  initialize: () => Promise<void>;
  sendMessage: (text: string, categoryId?: string | null) => Promise<void>;
  saveNote: (data: { title: string; content: string; tags: string[]; categoryId?: string | null }) => void;
  toggleRecording: () => void;
  updateNoteCategory: (noteId: string, categoryId: string | null) => void;
  drillDown: (noteId: string, ideaIdx: number, idea: DerivedIdea, rawContent: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [WELCOME],
  notes: [],
  pendingNoteId: null,
  isTyping: false,
  isRecording: false,
  initialized: false,
  drillDownResults: {},
  drillingDownKeys: [],

  initialize: async () => {
    if (get().initialized) return;

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) { console.warn("notes fetch error:", error.message); return; }

    const notes = (data ?? []).map(noteFromDb);

    // 기존 드릴다운 결과 복원 (drill_down_results 컬럼)
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

  sendMessage: async (text, categoryId = null) => {
    const userMsg: ChatMessage = {
      id: msgId(),
      role: "user",
      content: text,
      createdAt: new Date(),
    };
    set((s) => ({ messages: [...s.messages, userMsg], isTyping: true }));

    const result = await processIdea(text);

    const { categories } = useCategoryStore.getState();
    const resolvedCategoryId =
      categoryId ??
      categories.find((c) => c.name === result.suggestedCategoryName)?.id ??
      categories[0]?.id ??
      null;

    const note: Note = {
      id: `note-${Date.now()}`,
      userId: "local",
      rawContent: text,
      summary: result.summary,
      contentType: result.contentType,
      tags: result.tags,
      title: result.titleOptions[0]?.title ?? text.slice(0, 30),
      categoryId: resolvedCategoryId,
      derivedIdeas: result.derivedIdeas,
      titleOptions: result.titleOptions,
      scheduledAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Supabase 저장
    supabase.from("notes").insert(noteToDb(note)).then(({ error }) => {
      if (error) console.warn("note insert error:", error.message);
    });

    const { categories: cats } = useCategoryStore.getState();
    const catName = cats.find((c) => c.id === resolvedCategoryId)?.name ?? "미분류";
    const aiMsg: ChatMessage = {
      id: msgId(),
      role: "ai",
      content: `저장했어요! [${catName}] 카테고리에 넣었고, 파생 아이디어 3개 만들어봤어요 👇`,
      createdAt: new Date(Date.now() + 1),
    };

    set((s) => ({
      notes: [...s.notes, note],
      messages: [...s.messages, aiMsg],
      isTyping: false,
      pendingNoteId: note.id,
    }));
  },

  saveNote: ({ title, content, tags, categoryId = null }) => {
    const note: Note = {
      id: `note-${Date.now()}`,
      userId: "local",
      rawContent: content,
      summary: content.slice(0, 60),
      contentType: "idea",
      tags,
      title,
      categoryId,
      derivedIdeas: [],
      titleOptions: [],
      scheduledAt: null,
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

      // 해당 노트의 drill_down_results 컬럼 업데이트
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
