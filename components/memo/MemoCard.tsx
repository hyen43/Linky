import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { Note } from "../../types";

interface Props {
  idea: Note;
  onPress?: () => void;
}

export const MemoCard: React.FC<Props> = ({ idea, onPress }) => {
  const dateStr = idea.createdAt.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`메모: ${idea.title}`}
      className="mb-3 rounded-2xl bg-surface2 p-4"
      testID={`memo-card-${idea.id}`}
    >
      <View className="mb-2 flex-row items-start justify-between">
        <Text className="flex-1 pr-2 text-sm font-semibold text-white" numberOfLines={2}>
          {idea.title}
        </Text>
        <Text className="text-xs text-textMuted">{dateStr}</Text>
      </View>

      <View className="mb-2 flex-row flex-wrap gap-1">
        {idea.tags.map((tag) => (
          <View key={tag} className="rounded-full bg-surface px-2 py-0.5">
            <Text className="text-xs text-primary">#{tag}</Text>
          </View>
        ))}
      </View>

      <Text className="text-xs text-textMuted">📝 {idea.summary}</Text>
    </TouchableOpacity>
  );
};
