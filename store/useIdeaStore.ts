import { create } from "zustand";
import type { Note } from "../types";

interface IdeaState {
  ideas: Note[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredIdeas: () => Note[];
}

export const useIdeaStore = create<IdeaState>((set, get) => ({
  ideas: [],
  searchQuery: "",

  setSearchQuery: (q: string) => set({ searchQuery: q }),

  filteredIdeas: () => {
    const { ideas, searchQuery } = get();
    if (!searchQuery.trim()) return ideas;
    const q = searchQuery.toLowerCase();
    return ideas.filter(
      (idea) =>
        idea.title.toLowerCase().includes(q) ||
        idea.tags.some((t) => t.toLowerCase().includes(q)) ||
        idea.rawContent.toLowerCase().includes(q)
    );
  },
}));
