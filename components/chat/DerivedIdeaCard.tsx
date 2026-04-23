import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import type { DerivedIdea, DrillDownResult } from "../../types";
import { useAppTheme } from "../../lib/theme";

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
  const { colors } = useAppTheme();

  return (
    <View style={{ marginBottom: 12, maxWidth: "88%" }}>
      {/* 섹션 헤더 */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8, paddingLeft: 4 }}>
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary }} />
        <Text style={{ color: colors.textTertiary, fontSize: 11, fontWeight: "600", letterSpacing: 0.4 }}>
          파생 아이디어
        </Text>
      </View>

      {ideas.map((idea, idx) => {
        const key = `${noteId}-${idx}`;
        const isLoading = drillingDownKeys.includes(key);
        const result = drillDownResults[key];

        return (
          <View
            key={idx}
            testID={`derived-idea-${idx}`}
            style={{
              marginBottom: 8,
              borderRadius: 16,
              backgroundColor: colors.surfaceElevated,
              padding: 14,
              borderWidth: 1,
              borderColor: colors.border,
              gap: 10,
            }}
          >
            {/* 카드 헤더 */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: colors.primarySoft,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "700" }}>{idx + 1}</Text>
              </View>
              <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "600" }}>
                아이디어 {idx + 1}
              </Text>
            </View>

            {/* 필드 */}
            <View style={{ gap: 6 }}>
              {[idea.context, idea.target, idea.expectedTitle].map((val, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 8 }}>
                  <Text style={{ width: 36, fontSize: 12, color: colors.textTertiary }}>
                    {ROW_LABELS[i]}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 13,
                      lineHeight: 19,
                      color: i === 2 ? colors.text : colors.textSecondary,
                      fontWeight: i === 2 ? "600" : "400",
                    }}
                  >
                    {val}
                  </Text>
                </View>
              ))}
            </View>

            {/* 드릴다운 결과 */}
            {result && (
              <View
                style={{
                  marginTop: 2,
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: colors.primarySoft,
                  borderWidth: 1,
                  borderColor: colors.border,
                  gap: 8,
                }}
              >
                <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "700" }}>
                  🔍 제작 가이드
                </Text>
                {[
                  { label: "오프닝 훅", value: result.openingHook },
                  { label: "썸네일", value: result.thumbnailConcept },
                  { label: "마무리 CTA", value: result.cta },
                ].map(({ label, value }) => (
                  <View key={label} style={{ gap: 2 }}>
                    <Text style={{ color: colors.textTertiary, fontSize: 10, fontWeight: "600", letterSpacing: 0.4 }}>
                      {label.toUpperCase()}
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 12, lineHeight: 18 }}>
                      {value}
                    </Text>
                  </View>
                ))}
                <View style={{ gap: 2 }}>
                  <Text style={{ color: colors.textTertiary, fontSize: 10, fontWeight: "600", letterSpacing: 0.4 }}>
                    콘텐츠 구조
                  </Text>
                  {result.outline.map((step, i) => (
                    <Text key={i} style={{ color: colors.textSecondary, fontSize: 12, lineHeight: 18 }}>
                      {step}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* 액션 버튼 */}
            <View style={{ flexDirection: "row", gap: 8, marginTop: 2 }}>
              <TouchableOpacity
                onPress={() => onSave(idea)}
                accessibilityRole="button"
                accessibilityLabel={`파생 아이디어 ${idx + 1} 저장`}
                style={{
                  flex: 1,
                  alignItems: "center",
                  paddingVertical: 9,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                }}
              >
                <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "600" }}>
                  저장하기
                </Text>
              </TouchableOpacity>

              {!result && (
                <TouchableOpacity
                  onPress={() => onDrillDown(idx)}
                  disabled={isLoading}
                  accessibilityRole="button"
                  accessibilityLabel={`아이디어 ${idx + 1} 더 파고들기`}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    paddingVertical: 9,
                    borderRadius: 12,
                    backgroundColor: colors.primarySoft,
                  }}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "600" }}>
                      더 파고들기
                    </Text>
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
