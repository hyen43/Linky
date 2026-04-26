import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { notesApi, SaveNoteParams, UpdateNoteParams } from "./notesApi";

export const NOTES_QUERY_KEY = ["notes"] as const;

export function useSaveNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: SaveNoteParams) => notesApi.save(params),
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTES_QUERY_KEY }),
    onError: () => Alert.alert("오류", "노트 저장에 실패했어요. 다시 시도해주세요."),
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ noteId, patch }: { noteId: string; patch: UpdateNoteParams }) =>
      notesApi.update(noteId, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTES_QUERY_KEY }),
    onError: () => Alert.alert("오류", "노트 수정에 실패했어요. 다시 시도해주세요."),
  });
}

export function useUpdateNoteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ noteId, categoryId }: { noteId: string; categoryId: string | null }) =>
      notesApi.updateCategory(noteId, categoryId),
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTES_QUERY_KEY }),
    onError: () => Alert.alert("오류", "폴더 이동에 실패했어요. 다시 시도해주세요."),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (noteId: string) => notesApi.delete(noteId),
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTES_QUERY_KEY }),
    onError: () => Alert.alert("오류", "노트 삭제에 실패했어요. 다시 시도해주세요."),
  });
}
