import { create } from "zustand";
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

interface ChatState {
  messages: ChatMessage[];
  notes: Note[];
  pendingNoteId: string | null;
  isTyping: boolean;
  isRecording: boolean;
  // drill-down: key는 `${noteId}-${ideaIdx}`
  drillDownResults: Record<string, DrillDownResult>;
  drillingDownKeys: string[];

  sendMessage: (text: string, categoryId?: string | null) => Promise<void>;
  saveNote: (data: {
    title: string;
    content: string;
    tags: string[];
    categoryId?: string | null;
  }) => void;
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
  drillDownResults: {},
  drillingDownKeys: [],

  sendMessage: async (text, categoryId = null) => {
    // 1. 사용자 메시지 즉시 표시
    const userMsg: ChatMessage = {
      id: msgId(),
      role: "user",
      content: text,
      createdAt: new Date(),
    };
    set((s) => ({ messages: [...s.messages, userMsg], isTyping: true }));

    // 2. AI 처리
    const result = await processIdea(text);

    // 3. 카테고리 결정: 사용자가 직접 선택 > AI 추천 > 첫 번째 default
    const { categories } = useCategoryStore.getState();
    const resolvedCategoryId =
      categoryId ??
      categories.find((c) => c.name === result.suggestedCategoryName)?.id ??
      categories[0]?.id ??
      null;

    // 4. Note 저장
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

    // 5. AI 응답 메시지
    const { categories: cats } = useCategoryStore.getState();
    const catName =
      cats.find((c) => c.id === resolvedCategoryId)?.name ?? "미분류";
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
  },

  toggleRecording: () => set((s) => ({ isRecording: !s.isRecording })),

  updateNoteCategory: (noteId, categoryId) =>
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === noteId ? { ...n, categoryId, updatedAt: new Date() } : n,
      ),
    })),

  drillDown: async (noteId, ideaIdx, idea, rawContent) => {
    const key = `${noteId}-${ideaIdx}`;
    if (get().drillDownResults[key] || get().drillingDownKeys.includes(key)) return;

    set((s) => ({ drillingDownKeys: [...s.drillingDownKeys, key] }));
    try {
      const result = await drillDownIdea(idea, rawContent);
      set((s) => ({
        drillDownResults: { ...s.drillDownResults, [key]: result },
        drillingDownKeys: s.drillingDownKeys.filter((k) => k !== key),
      }));
    } catch {
      set((s) => ({ drillingDownKeys: s.drillingDownKeys.filter((k) => k !== key) }));
    }
  },
}));
