import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { DerivedIdea } from "../../types";

interface Props {
  ideas: DerivedIdea[];
  onSave: (idea: DerivedIdea) => void;
}

const ROW_LABELS = ["맥락", "타겟", "제목"];

export const DerivedIdeaCard: React.FC<Props> = ({ ideas, onSave }) => {
  return (
    <View className="mb-3 max-w-[88%]">
      {/* Section header */}
      <View className="mb-2 flex-row items-center pl-1" style={{ gap: 6 }}>
        <View className="h-1.5 w-1.5 rounded-full bg-primary" />
        <Text className="text-xs font-semibold text-textMuted">파생 아이디어</Text>
      </View>

      {ideas.map((idea, idx) => (
        <View
          key={idx}
          className="mb-2 rounded-2xl bg-surface2 p-4"
          testID={`derived-idea-${idx}`}
        >
          {/* Card header */}
          <View className="mb-3 flex-row items-center" style={{ gap: 8 }}>
            <View className="h-6 w-6 items-center justify-center rounded-full bg-primary/20">
              <Text className="text-xs font-bold text-primary">{idx + 1}</Text>
            </View>
            <Text className="text-xs font-semibold text-primary">
              아이디어 {idx + 1}
            </Text>
          </View>

          {/* Fields */}
          <View style={{ gap: 8 }}>
            <View className="flex-row">
              <Text className="w-12 text-xs text-textMuted">{ROW_LABELS[0]}</Text>
              <Text className="flex-1 text-xs leading-[18px] text-white">
                {idea.context}
              </Text>
            </View>
            <View className="flex-row">
              <Text className="w-12 text-xs text-textMuted">{ROW_LABELS[1]}</Text>
              <Text className="flex-1 text-xs leading-[18px] text-white">
                {idea.target}
              </Text>
            </View>
            <View className="flex-row">
              <Text className="w-12 text-xs text-textMuted">{ROW_LABELS[2]}</Text>
              <Text className="flex-1 text-xs font-semibold leading-[18px] text-white">
                {idea.expectedTitle}
              </Text>
            </View>
          </View>

          {/* Save button */}
          <TouchableOpacity
            onPress={() => onSave(idea)}
            accessibilityRole="button"
            accessibilityLabel={`파생 아이디어 ${idx + 1} 저장`}
            className="mt-3 items-center rounded-xl border border-primary/30 py-2"
          >
            <Text className="text-xs font-semibold text-primary">
              이 아이디어 저장하기
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};
