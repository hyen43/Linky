import { Category } from "../../types";
import { useCategoryStore } from "../../store/useCategoryStore";

export type CreateFolderParams = { name: string; color: string; icon: string };
export type UpdateFolderParams = Partial<Pick<Category, "name" | "color" | "icon">>;

// TODO: Replace with Supabase calls when backend is ready
export const foldersApi = {
  getAll: (): Promise<Category[]> =>
    Promise.resolve(useCategoryStore.getState().categories),

  create: (params: CreateFolderParams): Promise<Category> => {
    const cat = useCategoryStore.getState().addCategory(params);
    return Promise.resolve(cat);
  },

  update: (id: string, patch: UpdateFolderParams): Promise<void> => {
    useCategoryStore.getState().updateCategory(id, patch);
    return Promise.resolve();
  },

  delete: (id: string): Promise<void> => {
    useCategoryStore.getState().deleteCategory(id);
    return Promise.resolve();
  },
};
