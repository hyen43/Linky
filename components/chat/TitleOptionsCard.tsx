import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { TitleOption } from "../../types";

interface Props {
  options: TitleOption[];
  onCopy: (title: string) => void;
}

export const TitleOptionsCard: React.FC<Props> = ({ options, onCopy }) => {
  return (
    <View className="mb-3 max-w-[88%] overflow-hidden rounded-2xl bg-surface2">
      {/* Top accent strip */}
      <View className="h-[3px] w-full bg-primary" />

      <View className="p-4">
        {/* Section header */}
        <View className="mb-3 flex-row items-center" style={{ gap: 6 }}>
          <View className="h-1.5 w-1.5 rounded-full bg-primary" />
          <Text className="text-xs font-semibold text-textMuted">제목 공식 3가지</Text>
        </View>

        {options.map((opt, idx) => (
          <View
            key={idx}
            className={idx < options.length - 1 ? "mb-4 border-b border-border pb-4" : ""}
            testID={`title-option-${idx}`}
          >
            {/* Formula chip */}
            <View className="mb-2 self-start rounded-md bg-surface3 px-2 py-0.5">
              <Text className="text-[10px] font-medium text-textMuted">{opt.formula}</Text>
            </View>

            {/* Title + Copy */}
            <View className="flex-row items-start justify-between" style={{ gap: 10 }}>
              <Text
                className="flex-1 text-sm font-medium leading-[20px] text-white"
                style={{ letterSpacing: -0.1 }}
              >
                {opt.title}
              </Text>
              <TouchableOpacity
                onPress={() => onCopy(opt.title)}
                accessibilityRole="button"
                accessibilityLabel={`제목 복사: ${opt.title}`}
                className="mt-0.5 rounded-lg bg-primary/15 px-2.5 py-1"
              >
                <Text className="text-xs font-semibold text-primary">복사</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
