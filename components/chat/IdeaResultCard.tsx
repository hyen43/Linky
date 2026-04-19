import React from "react";
import { Text, View } from "react-native";
import { CategoryBadge } from "../ui/CategoryBadge";
import { useCategoryStore } from "../../store/useCategoryStore";
import type { Note } from "../../types";

interface Props {
  note: Note;
}

const CONTENT_TYPE_LABEL: Record<string, string> = {
  idea: "아이디어",
  script: "스크립트",
  reference: "레퍼런스",
  hook: "훅",
};

export const IdeaResultCard: React.FC<Props> = ({ note }) => {
  const { getCategoryById } = useCategoryStore();
  const category = getCategoryById(note.categoryId);

  return (
    <View className="mb-3 max-w-[88%] overflow-hidden rounded-2xl bg-surface2">
      {/* Top accent strip */}
      <View className="h-[3px] w-full bg-accent" />

      <View className="p-4">
        {/* Header row */}
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center" style={{ gap: 6 }}>
            <View className="rounded-full bg-accent/15 px-2.5 py-0.5">
              <Text className="text-xs font-semibold text-accent">저장 완료</Text>
            </View>
            <View className="rounded-full bg-surface3 px-2.5 py-0.5">
              <Text className="text-xs text-textMuted">
                {CONTENT_TYPE_LABEL[note.contentType] ?? note.contentType}
              </Text>
            </View>
          </View>
          {category && <CategoryBadge category={category} size="sm" />}
        </View>

        {/* Summary */}
        <Text
          className="mb-3 text-[15px] font-semibold leading-[22px] text-white"
          style={{ letterSpacing: -0.2 }}
        >
          {note.summary}
        </Text>

        {/* Tags */}
        {note.tags.length > 0 && (
          <View className="mb-3 flex-row flex-wrap" style={{ gap: 6 }}>
            {note.tags.map((tag) => (
              <View key={tag} className="rounded-full bg-primary/10 px-2.5 py-1">
                <Text className="text-xs font-medium text-primary">#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        {note.derivedIdeas.length > 0 && (
          <View className="flex-row items-center border-t border-border pt-3">
            <Text className="text-xs text-textMuted">
              파생 아이디어 {note.derivedIdeas.length}개 · 제목 공식 {note.titleOptions.length}개 생성됨
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
