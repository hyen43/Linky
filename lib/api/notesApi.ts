import { Note } from "../../types";
import { useChatStore } from "../../store/useChatStore";

export type SaveNoteParams = {
  title: string;
  content: string;
  tags: string[];
  categoryId?: string | null;
};

export type UpdateNoteParams = {
  title?: string;
  content?: string;
  tags?: string[];
  categoryId?: string | null;
};

// TODO: Replace with Supabase calls when backend is ready
export const notesApi = {
  getAll: (): Promise<Note[]> =>
    Promise.resolve(
      useChatStore.getState().notes.filter((n) => n.confirmed !== false)
    ),

  save: (params: SaveNoteParams): Promise<void> => {
    useChatStore.getState().saveNote(params);
    return Promise.resolve();
  },

  update: (noteId: string, patch: UpdateNoteParams): Promise<void> => {
    useChatStore.getState().updateNote(noteId, patch);
    return Promise.resolve();
  },

  updateCategory: (noteId: string, categoryId: string | null): Promise<void> => {
    useChatStore.getState().updateNoteCategory(noteId, categoryId);
    return Promise.resolve();
  },

  delete: (noteId: string): Promise<void> => {
    useChatStore.getState().deleteNote(noteId);
    return Promise.resolve();
  },
};
