import { create } from "zustand";
import { Category, DEFAULT_CATEGORIES } from "../types";

let _idCounter = 100;
const genId = () => `cat-${++_idCounter}`;

const buildDefaults = (): Category[] =>
  DEFAULT_CATEGORIES.map((c) => ({
    ...c,
    id: genId(),
    userId: "local",
    createdAt: new Date(),
  }));

interface CategoryState {
  categories: Category[];

  // CRUD
  addCategory: (params: { name: string; color: string; icon: string }) => Category;
  updateCategory: (id: string, patch: Partial<Pick<Category, "name" | "color" | "icon">>) => void;
  deleteCategory: (id: string) => void;
  reorder: (orderedIds: string[]) => void;

  // helpers
  getCategoryById: (id: string | null) => Category | null;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: buildDefaults(),

  addCategory: ({ name, color, icon }) => {
    const newCat: Category = {
      id: genId(),
      userId: "local",
      name,
      color,
      icon,
      isDefault: false,
      sortOrder: get().categories.length,
      createdAt: new Date(),
    };
    set((s) => ({ categories: [...s.categories, newCat] }));
    return newCat;
  },

  updateCategory: (id, patch) =>
    set((s) => ({
      categories: s.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),

  deleteCategory: (id) =>
    set((s) => ({
      categories: s.categories.filter((c) => c.id !== id),
    })),

  reorder: (orderedIds) =>
    set((s) => ({
      categories: orderedIds
        .map((id, idx) => {
          const cat = s.categories.find((c) => c.id === id);
          return cat ? { ...cat, sortOrder: idx } : null;
        })
        .filter(Boolean) as Category[],
    })),

  getCategoryById: (id) => {
    if (!id) return null;
    return get().categories.find((c) => c.id === id) ?? null;
  },
}));
