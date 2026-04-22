import React, { forwardRef, useCallback } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import type { Note } from "../../types";
import { useAppTheme } from "../../lib/theme";
import { useChatStore } from "../../store/useChatStore";

interface Props {
  note: Note | null;
  onClose: () => void;
}

export type NoteDetailSheetRef = BottomSheet;

const CONTENT_TYPE_LABEL: Record<string, string> = {
  idea: "아이디어",
  script: "스크립트",
  reference: "레퍼런스",
  hook: "훅",
};

export const NoteDetailSheet = forwardRef<NoteDetailSheetRef, Props>(
  ({ note, onClose }, ref) => {
    const { colors } = useAppTheme();
    const { drillDown, drillDownResults, drillingDownKeys } = useChatStore();

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
      ),
      [],
    );

    if (!note) return null;

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={["85%"]}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.border, width: 36, height: 4 }}
        onChange={(index) => { if (index === -1) onClose(); }}
      >
        <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 48 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              paddingHorizontal: 24,
              paddingTop: 8,
              paddingBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              gap: 12,
            }}
          >
            <View style={{ flex: 1, gap: 6 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 6,
                    backgroundColor: colors.primarySoft,
                  }}
                >
                  <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "600" }}>
                    {CONTENT_TYPE_LABEL[note.contentType] ?? note.contentType}
                  </Text>
                </View>
                <Text style={{ color: colors.textTertiary, fontSize: 11 }}>
                  {note.createdAt.toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}
                </Text>
              </View>
              <Text
                style={{ color: colors.text, fontSize: 18, fontWeight: "800", letterSpacing: -0.5 }}
              >
                {note.title}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => (ref as React.RefObject<BottomSheet>)?.current?.close()}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: colors.surfaceElevated,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 4,
              }}
            >
              <Ionicons name="close" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: 24, paddingTop: 24, gap: 28 }}>
            {/* 원본 메모 */}
            {note.rawContent.trim().length > 0 && (
              <View style={{ gap: 8 }}>
                <SectionLabel label="원본 메모" colors={colors} />
                <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 22 }}>
                  {note.rawContent}
                </Text>
              </View>
            )}

            {/* 태그 */}
            {note.tags.length > 0 && (
              <View style={{ gap: 8 }}>
                <SectionLabel label="태그" colors={colors} />
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                  {note.tags.map((tag) => (
                    <View
                      key={tag}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 999,
                        backgroundColor: colors.primarySoft,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    >
                      <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "500" }}>
                        #{tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 제목 옵션 */}
            {note.titleOptions.length > 0 && (
              <View style={{ gap: 8 }}>
                <SectionLabel label="제목 옵션" colors={colors} />
                <View style={{ gap: 8 }}>
                  {note.titleOptions.map((opt, i) => (
                    <View
                      key={i}
                      style={{
                        padding: 14,
                        borderRadius: 14,
                        backgroundColor: colors.surfaceElevated,
                        gap: 4,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    >
                      <Text style={{ color: colors.textTertiary, fontSize: 10, fontWeight: "600" }}>
                        {opt.formula}
                      </Text>
                      <Text style={{ color: colors.text, fontSize: 14, fontWeight: "600", letterSpacing: -0.2 }}>
                        {opt.title}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 파생 아이디어 */}
            {note.derivedIdeas.length > 0 && (
              <View style={{ gap: 8 }}>
                <SectionLabel label="파생 아이디어" colors={colors} />
                <View style={{ gap: 12 }}>
                  {note.derivedIdeas.map((idea, idx) => {
                    const key = `${note.id}-${idx}`;
                    const isLoading = drillingDownKeys.includes(key);
                    const result = drillDownResults[key];

                    return (
                      <View
                        key={idx}
                        style={{
                          borderRadius: 16,
                          backgroundColor: colors.surfaceElevated,
                          padding: 16,
                          borderWidth: 1,
                          borderColor: colors.border,
                          gap: 10,
                        }}
                      >
                        {/* 아이디어 번호 */}
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                          <View
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 12,
                              backgroundColor: `${colors.primary}30`,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "700" }}>
                              {idx + 1}
                            </Text>
                          </View>
                          <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "600" }}>
                            아이디어 {idx + 1}
                          </Text>
                        </View>

                        {/* 필드 */}
                        {[
                          { label: "맥락", value: idea.context },
                          { label: "타겟", value: idea.target },
                          { label: "제목", value: idea.expectedTitle },
                        ].map(({ label, value }) => (
                          <View key={label} style={{ flexDirection: "row", gap: 8 }}>
                            <Text style={{ width: 36, fontSize: 12, color: colors.textTertiary }}>
                              {label}
                            </Text>
                            <Text
                              style={{
                                flex: 1,
                                fontSize: 13,
                                lineHeight: 19,
                                color: label === "제목" ? colors.text : colors.textSecondary,
                                fontWeight: label === "제목" ? "600" : "400",
                              }}
                            >
                              {value}
                            </Text>
                          </View>
                        ))}

                        {/* 드릴다운 결과 */}
                        {result && (
                          <View
                            style={{
                              marginTop: 4,
                              padding: 14,
                              borderRadius: 12,
                              backgroundColor: `${colors.primary}12`,
                              borderWidth: 1,
                              borderColor: `${colors.primary}30`,
                              gap: 10,
                            }}
                          >
                            <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "700" }}>
                              🔍 제작 가이드
                            </Text>
                            {[
                              { label: "오프닝 훅", value: result.openingHook },
                              { label: "썸네일", value: result.thumbnailConcept },
                              { label: "CTA", value: result.cta },
                            ].map(({ label, value }) => (
                              <View key={label} style={{ gap: 3 }}>
                                <Text style={{ color: colors.textTertiary, fontSize: 10, fontWeight: "600" }}>
                                  {label}
                                </Text>
                                <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 19 }}>
                                  {value}
                                </Text>
                              </View>
                            ))}
                            <View style={{ gap: 3 }}>
                              <Text style={{ color: colors.textTertiary, fontSize: 10, fontWeight: "600" }}>
                                콘텐츠 구조
                              </Text>
                              {result.outline.map((step, i) => (
                                <Text key={i} style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 19 }}>
                                  {step}
                                </Text>
                              ))}
                            </View>
                          </View>
                        )}

                        {/* 더 파고들기 버튼 */}
                        {!result && (
                          <TouchableOpacity
                            onPress={() => drillDown(note.id, idx, idea, note.rawContent)}
                            disabled={isLoading}
                            style={{
                              marginTop: 4,
                              paddingVertical: 10,
                              borderRadius: 12,
                              backgroundColor: `${colors.primary}20`,
                              alignItems: "center",
                            }}
                          >
                            {isLoading ? (
                              <ActivityIndicator size="small" color={colors.primary} />
                            ) : (
                              <Text style={{ color: colors.primary, fontSize: 13, fontWeight: "600" }}>
                                더 파고들기
                              </Text>
                            )}
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);

NoteDetailSheet.displayName = "NoteDetailSheet";

function SectionLabel({
  label,
  colors,
}: {
  label: string;
  colors: ReturnType<typeof useAppTheme>["colors"];
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <View style={{ width: 3, height: 12, borderRadius: 2, backgroundColor: colors.primary }} />
      <Text style={{ color: colors.textTertiary, fontSize: 11, fontWeight: "700", letterSpacing: 0.6 }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}
