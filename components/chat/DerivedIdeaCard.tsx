import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import type { DerivedIdea, DrillDownResult } from "../../types";

interface Props {
  ideas: DerivedIdea[];
  noteId: string;
  onSave: (idea: DerivedIdea) => void;
  onDrillDown: (ideaIdx: number) => void;
  drillDownResults: Record<string, DrillDownResult>;
  drillingDownKeys: string[];
}

const ROW_LABELS = ["맥락", "타겟", "제목"];

export const DerivedIdeaCard: React.FC<Props> = ({
  ideas,
  noteId,
  onSave,
  onDrillDown,
  drillDownResults,
  drillingDownKeys,
}) => {
  return (
    <View className="mb-3 max-w-[88%]">
      <View className="mb-2 flex-row items-center pl-1" style={{ gap: 6 }}>
        <View className="h-1.5 w-1.5 rounded-full bg-primary" />
        <Text className="text-xs font-semibold text-textMuted">파생 아이디어</Text>
      </View>

      {ideas.map((idea, idx) => {
        const key = `${noteId}-${idx}`;
        const isLoading = drillingDownKeys.includes(key);
        const result = drillDownResults[key];

        return (
          <View key={idx} className="mb-2 rounded-2xl bg-surface2 p-4" testID={`derived-idea-${idx}`}>
            {/* Card header */}
            <View className="mb-3 flex-row items-center" style={{ gap: 8 }}>
              <View className="h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                <Text className="text-xs font-bold text-primary">{idx + 1}</Text>
              </View>
              <Text className="text-xs font-semibold text-primary">아이디어 {idx + 1}</Text>
            </View>

            {/* Fields */}
            <View style={{ gap: 8 }}>
              {[idea.context, idea.target, idea.expectedTitle].map((val, i) => (
                <View key={i} className="flex-row">
                  <Text className="w-12 text-xs text-textMuted">{ROW_LABELS[i]}</Text>
                  <Text
                    className={`flex-1 text-xs leading-[18px] ${i === 2 ? "font-semibold" : ""} text-white`}
                  >
                    {val}
                  </Text>
                </View>
              ))}
            </View>

            {/* Drill-down result */}
            {result && (
              <View className="mt-4 rounded-xl border border-primary/20 p-3" style={{ gap: 10 }}>
                <View className="flex-row items-center" style={{ gap: 6 }}>
                  <Text className="text-xs font-bold text-primary">🔍 제작 가이드</Text>
                </View>

                <View style={{ gap: 4 }}>
                  <Text className="text-xs font-semibold text-textMuted">오프닝 훅</Text>
                  <Text className="text-xs leading-[18px] text-white">{result.openingHook}</Text>
                </View>

                <View style={{ gap: 4 }}>
                  <Text className="text-xs font-semibold text-textMuted">콘텐츠 구조</Text>
                  {result.outline.map((step, i) => (
                    <Text key={i} className="text-xs leading-[18px] text-white">
                      {step}
                    </Text>
                  ))}
                </View>

                <View style={{ gap: 4 }}>
                  <Text className="text-xs font-semibold text-textMuted">썸네일</Text>
                  <Text className="text-xs leading-[18px] text-white">{result.thumbnailConcept}</Text>
                </View>

                <View style={{ gap: 4 }}>
                  <Text className="text-xs font-semibold text-textMuted">마무리 CTA</Text>
                  <Text className="text-xs leading-[18px] text-white">{result.cta}</Text>
                </View>
              </View>
            )}

            {/* Action buttons */}
            <View className="mt-3 flex-row" style={{ gap: 8 }}>
              <TouchableOpacity
                onPress={() => onSave(idea)}
                accessibilityRole="button"
                accessibilityLabel={`파생 아이디어 ${idx + 1} 저장`}
                className="flex-1 items-center rounded-xl border border-primary/30 py-2"
              >
                <Text className="text-xs font-semibold text-primary">저장하기</Text>
              </TouchableOpacity>

              {!result && (
                <TouchableOpacity
                  onPress={() => onDrillDown(idx)}
                  disabled={isLoading}
                  accessibilityRole="button"
                  accessibilityLabel={`아이디어 ${idx + 1} 더 파고들기`}
                  className="flex-1 items-center rounded-xl bg-primary/20 py-2"
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#6C63FF" />
                  ) : (
                    <Text className="text-xs font-semibold text-primary">더 파고들기</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};
