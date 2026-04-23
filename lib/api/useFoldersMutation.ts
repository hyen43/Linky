import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { foldersApi, CreateFolderParams, UpdateFolderParams } from "./foldersApi";

export const FOLDERS_QUERY_KEY = ["folders"] as const;

export function useCreateFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: CreateFolderParams) => foldersApi.create(params),
    onSuccess: () => qc.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY }),
    onError: () => Alert.alert("오류", "폴더 생성에 실패했어요. 다시 시도해주세요."),
  });
}

export function useUpdateFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: UpdateFolderParams }) =>
      foldersApi.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY }),
    onError: () => Alert.alert("오류", "폴더 수정에 실패했어요. 다시 시도해주세요."),
  });
}

export function useDeleteFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => foldersApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY }),
    onError: () => Alert.alert("오류", "폴더 삭제에 실패했어요. 다시 시도해주세요."),
  });
}
