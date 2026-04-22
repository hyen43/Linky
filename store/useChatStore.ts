import { create } from "zustand";
import { ChatMessage, Note } from "../types";
import { processIdea } from "../lib/claude";
import { useCategoryStore } from "./useCategoryStore";

let _msgId = 0;
const msgId = () => `msg-${++_msgId}-${Date.now()}`;

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "ai",
  content: "안녕하세요! 새로운 아이디어가 있나요? 제목과 내용을 적어주세요 ✍️",
  createdAt: new Date(0),
};

interface ChatState {
  messages: ChatMessage[];
  notes: Note[];
  pendingNoteId: string | null;
  isTyping: boolean;
  isRecording: boolean;

  sendMessage: (text: string, categoryId?: string | null) => Promise<void>;
  confirmNote: (noteId: string) => void;
  discardNote: (noteId: string) => void;
  updateNoteTitle: (noteId: string, title: string) => void;
  saveNote: (data: { title: string; content: string; tags: string[]; categoryId?: string | null }) => void;
  toggleRecording: () => void;
  updateNoteCategory: (noteId: string, categoryId: string | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [WELCOME],
  notes: [],
  pendingNoteId: null,
  isTyping: false,
  isRecording: false,

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

    const now = Date.now();
    const aiMsg: ChatMessage = {
      id: msgId(),
      role: "ai",
      content: "⭐ AI가 정리했어요! 이렇게 저장할까요?",
      createdAt: new Date(now + 1),
    };

    const note: Note = {
      id: `note-${now}`,
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
      confirmed: false,
      createdAt: new Date(now + 2),
      updatedAt: new Date(now + 2),
    };

    set((s) => ({
      notes: [...s.notes, note],
      messages: [...s.messages, aiMsg],
      isTyping: false,
      pendingNoteId: note.id,
    }));
  },

  confirmNote: (noteId) =>
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === noteId ? { ...n, confirmed: true, updatedAt: new Date() } : n
      ),
      pendingNoteId: s.pendingNoteId === noteId ? null : s.pendingNoteId,
    })),

  discardNote: (noteId) =>
    set((s) => ({
      notes: s.notes.filter((n) => n.id !== noteId),
      pendingNoteId: s.pendingNoteId === noteId ? null : s.pendingNoteId,
    })),

  updateNoteTitle: (noteId, title) =>
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === noteId ? { ...n, title, updatedAt: new Date() } : n
      ),
    })),

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
      confirmed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((s) => ({ notes: [...s.notes, note] }));
  },

  toggleRecording: () => set((s) => ({ isRecording: !s.isRecording })),

  updateNoteCategory: (noteId, categoryId) =>
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === noteId ? { ...n, categoryId, updatedAt: new Date() } : n
      ),
    })),
}));
