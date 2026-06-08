import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useChatStore } from "../../store/useChatStore";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useAppTheme } from "../../lib/theme";
import { useDeleteNote, useUpdateNoteCategory } from "../../lib/api/useNotesMutation";
import { generateTextContent } from "../../lib/claude";
import { IdeaFormSheet, IdeaFormSheetRef } from "../../components/sheet/IdeaFormSheet";
import type { TitleOption } from "../../types";

function AISkeleton({ colors }: { colors: ReturnType<typeof import("../../lib/theme").useAppTheme>["colors"] }) {
  return (
    <View style={{ gap: 12, marginBottom: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={{ fontSize: 13, color: colors.primary, fontWeight: "600" }}>
          AI가 분석 중이에요...
        </Text>
      </View>
      {([[72, 50, 64], [80, 60, 70]] as number[][]).map((widths, i) => (
        <View
          key={i}
          style={{ backgroundColor: colors.noteBg, borderRadius: 16, padding: 16, gap: 10 }}
        >
          {widths.map((w, j) => (
            <View
              key={j}
              style={{ height: 14, width: `${w}%`, backgroundColor: colors.border, borderRadius: 7, opacity: 0.6 }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function SectionCard({ title, children, colors }: {
  title: string;
  children: React.ReactNode;
  colors: ReturnType<typeof import("../../lib/theme").useAppTheme>["colors"];
}) {
  return (
    <View style={{ backgroundColor: colors.noteBg, borderRadius: 16, padding: 16, marginBottom: 12 }}>
      <Text style={{ fontSize: 13, fontWeight: "700", color: colors.primary, marginBottom: 12 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useAppTheme();
  const {
    notes,
    updateNoteTitle,
    updateNoteCategory,
    generateAISuggestions,
    generatingIds,
    drillDown,
    drillDownResults,
    drillingDownKeys,
    textContentCache,
    cacheTextContent,
  } = useChatStore();
  const { categories } = useCategoryStore();
  const { platforms } = useSettingsStore();
  const deleteNote = useDeleteNote();
  const updateCategory = useUpdateNoteCategory();
  const sheetRef = useRef<IdeaFormSheetRef>(null);

  const [selectedTitleIdx, setSelectedTitleIdx] = useState<number | null>(null);
  const [generatingText, setGeneratingText] = useState(false);
  const [movedToProgress, setMovedToProgress] = useState(false);

  const textContent = id ? (textContentCache[id] ?? null) : null;
  const drillDownTriggered = useRef(false);

  const note = notes.find((n) => n.id === id);
  const isGeneratingAI = !!id && generatingIds.includes(id);

  const isYouTube = platforms.includes("유튜브");
  const isTextBased = platforms.some((p) => ["인스타그램", "블로그", "팟캐스터", "틱톡"].includes(p));

  const progressCategory = categories.find((c) => c.name === "제작중");
  const youtubeKey = `${id}-0`;
  const youtubeGuide = drillDownResults[youtubeKey];
  const isGeneratingYoutube = drillingDownKeys.includes(youtubeKey);

  // AI 기본 분석 (derivedIdeas + titleOptions)
  useEffect(() => {
    if (!note) return;
    if (note.derivedIdeas.length === 0 && note.titleOptions.length === 0) {
      generateAISuggestions(note.id);
    }
  }, [note?.id]);

  // 유튜브: derivedIdeas 준비되면 자동 드릴다운
  useEffect(() => {
    if (!note || !isYouTube || drillDownTriggered.current) return;
    if (note.derivedIdeas.length === 0) return;
    if (youtubeGuide || isGeneratingYoutube) return;
    drillDownTriggered.current = true;
    drillDown(note.id, 0, note.derivedIdeas[0], note.rawContent);
  }, [note?.derivedIdeas.length]);

  // 인스타/블로그: 텍스트 콘텐츠 생성 (캐시에 없을 때만)
  useEffect(() => {
    if (!note || !isTextBased || textContent !== null) return;
    setGeneratingText(true);
    generateTextContent(note.rawContent, platforms)
      .then((result) => cacheTextContent(note.id, result))
      .catch(console.warn)
      .finally(() => setGeneratingText(false));
  }, [note?.id]);

  // 이미 제작중 상태면 배너 숨김
  useEffect(() => {
    if (!note || !progressCategory) return;
    if (note.categoryId === progressCategory.id) setMovedToProgress(true);
  }, [note?.id]);

  const handleAction = useCallback(() => {
    if (movedToProgress || !note || !progressCategory) return;
    if (note.categoryId === progressCategory.id) {
      setMovedToProgress(true);
      return;
    }
    updateNoteCategory(note.id, progressCategory.id);
    setMovedToProgress(true);
  }, [movedToProgress, note, progressCategory, updateNoteCategory]);

  const handleSelectTitle = (option: TitleOption, idx: number) => {
    setSelectedTitleIdx(idx);
    updateNoteTitle(note!.id, option.title);
    handleAction();
  };

  const handleStatusChange = () => {
    Alert.alert("폴더 이동", "이동할 폴더를 선택해주세요", [
      ...categories.map((c) => ({
        text: `${c.icon} ${c.name}`,
        onPress: () => updateCategory.mutate({ noteId: note!.id, categoryId: c.id }),
      })),
      { text: "취소", style: "cancel" as const },
    ]);
  };

  const handleDelete = () => {
    Alert.alert("메모 삭제", "정말 삭제할까요? 이 작업은 되돌릴 수 없어요.", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          deleteNote.mutate(note!.id, { onSuccess: () => router.back() });
        },
      },
    ]);
  };

  if (!note) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.textTertiary, fontSize: 15 }}>메모를 찾을 수 없어요</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary, fontSize: 15 }}>← 뒤로</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const folder = categories.find((c) => c.id === note.categoryId);
  const folderName = folder?.name ?? "초안";
  const formattedDate = note.createdAt
    .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    .replace(/\. /g, ".")
    .replace(/\.$/, "");

  const hasAnyRecommendation = isYouTube
    ? !!youtubeGuide
    : isTextBased
    ? (note.titleOptions.length > 0 || !!textContent)
    : false;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* 헤더 */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ flexDirection: "row", alignItems: "center" }}
          accessibilityRole="button"
          accessibilityLabel="뒤로"
        >
          <Ionicons name="chevron-back" size={18} color={colors.primary} />
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: "500" }}>노트</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <TouchableOpacity
            onPress={() => sheetRef.current?.expand()}
            accessibilityRole="button"
            accessibilityLabel="편집"
          >
            <Ionicons name="pencil-outline" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            accessibilityRole="button"
            accessibilityLabel="삭제"
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 }}>

          {/* 제목 */}
          {note.title.trim().length > 0 && (
            <TextInput
              editable={false}
              multiline
              scrollEnabled={false}
              value={note.title}
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: colors.text,
                letterSpacing: -0.5,
                marginBottom: 12,
                lineHeight: 32,
                padding: 0,
                borderWidth: 0,
                backgroundColor: "transparent",
              }}
            />
          )}

          {/* 상태 배지 + 날짜 + 폴더 이동 */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 }}>
            <View style={{
              backgroundColor: colors.surfaceElevated,
              borderRadius: 10,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}>
              <Text style={{ fontSize: 11, color: colors.textSecondary, fontWeight: "600" }}>
                {folderName}
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: colors.textTertiary }}>{formattedDate}</Text>
            <TouchableOpacity onPress={handleStatusChange}>
              <Text style={{ fontSize: 12, color: colors.primary, fontWeight: "600" }}>폴더 이동</Text>
            </TouchableOpacity>
          </View>

          {/* 태그 */}
          {note.tags.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {note.tags.map((tag) => (
                <View
                  key={tag}
                  style={{
                    backgroundColor: colors.primarySoft,
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                  }}
                >
                  <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "500" }}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* 본문 */}
          {note.rawContent.trim().length > 0 && (
            <TextInput
              editable={false}
              multiline
              scrollEnabled={false}
              value={note.rawContent}
              style={{
                fontSize: 15,
                color: colors.textSecondary,
                lineHeight: 24,
                marginBottom: 28,
                padding: 0,
                borderWidth: 0,
                backgroundColor: "transparent",
              }}
            />
          )}

          {/* 구분선 */}
          <View style={{ height: 1, backgroundColor: colors.border, marginBottom: 24 }} />

          {/* AI 추천 섹션 헤더 */}
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 16 }}>
            ✨ AI 추천
          </Text>

          {/* 제작중 이동 배너 */}
          {movedToProgress && (
            <View style={{
              backgroundColor: "#FFF7ED",
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 10,
              marginBottom: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}>
              <Text style={{ fontSize: 14 }}>✏️</Text>
              <Text style={{ fontSize: 13, color: "#92400E", fontWeight: "600" }}>
                제작중으로 이동됐어요!
              </Text>
            </View>
          )}

          {/* AI 분석 중 스켈레톤 */}
          {isGeneratingAI && !hasAnyRecommendation && <AISkeleton colors={colors} />}

          {/* ── 유튜브 추천 섹션 ── */}
          {isYouTube && (
            <View style={{ marginBottom: 8 }}>
              {isGeneratingYoutube && !youtubeGuide ? (
                <View style={{ backgroundColor: colors.noteBg, borderRadius: 16, padding: 16, marginBottom: 12 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={{ fontSize: 13, color: colors.primary, fontWeight: "600" }}>
                      영상 제작 가이드 생성 중...
                    </Text>
                  </View>
                </View>
              ) : youtubeGuide ? (
                <>
                  {/* 오프닝 훅 */}
                  <SectionCard title="🎣 오프닝 훅 (첫 3초)" colors={colors}>
                    <TextInput
                      editable={false}
                      multiline
                      scrollEnabled={false}
                      value={`"${youtubeGuide.openingHook}"`}
                      style={{ fontSize: 14, color: colors.text, lineHeight: 22, padding: 0, borderWidth: 0, backgroundColor: "transparent" }}
                    />
                  </SectionCard>

                  {/* 영상 구성 */}
                  <SectionCard title="📋 영상 구성" colors={colors}>
                    <View style={{ gap: 8 }}>
                      {youtubeGuide.outline.map((step, i) => (
                        <View key={i} style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
                          <View style={{
                            width: 22,
                            height: 22,
                            borderRadius: 11,
                            backgroundColor: colors.primary,
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 1,
                          }}>
                            <Text style={{ color: "#FFF", fontSize: 11, fontWeight: "700" }}>{i + 1}</Text>
                          </View>
                          <TextInput
                            editable={false}
                            multiline
                            scrollEnabled={false}
                            value={step}
                            style={{ flex: 1, fontSize: 14, color: colors.textSecondary, lineHeight: 22, padding: 0, borderWidth: 0, backgroundColor: "transparent" }}
                          />
                        </View>
                      ))}
                    </View>
                  </SectionCard>

                  {/* 썸네일 + CTA */}
                  <SectionCard title="🖼 썸네일 컨셉" colors={colors}>
                    <TextInput
                      editable={false}
                      multiline
                      scrollEnabled={false}
                      value={youtubeGuide.thumbnailConcept}
                      style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22, padding: 0, borderWidth: 0, backgroundColor: "transparent" }}
                    />
                  </SectionCard>

                  <SectionCard title="📢 마무리 CTA" colors={colors}>
                    <TextInput
                      editable={false}
                      multiline
                      scrollEnabled={false}
                      value={youtubeGuide.cta}
                      style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22, padding: 0, borderWidth: 0, backgroundColor: "transparent" }}
                    />
                  </SectionCard>

                  {/* 제작 시작 액션 버튼 */}
                  {!movedToProgress && (
                    <TouchableOpacity
                      onPress={handleAction}
                      style={{
                        height: 50,
                        borderRadius: 14,
                        backgroundColor: colors.primary,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 12,
                      }}
                      accessibilityRole="button"
                    >
                      <Text style={{ color: "#FFF", fontSize: 15, fontWeight: "700" }}>
                        이 아이디어로 제작 시작하기 →
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : !isGeneratingAI ? (
                <TouchableOpacity
                  onPress={() => {
                    drillDownTriggered.current = false;
                    if (note.derivedIdeas.length > 0) {
                      drillDown(note.id, 0, note.derivedIdeas[0], note.rawContent);
                    } else {
                      generateAISuggestions(note.id);
                    }
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    paddingVertical: 14,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: colors.border,
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="videocam-outline" size={16} color={colors.primary} />
                  <Text style={{ fontSize: 14, color: colors.primary, fontWeight: "600" }}>
                    유튜브 영상 제작 가이드 받기
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}

          {/* ── 인스타/블로그 추천 섹션 ── */}
          {isTextBased && (
            <View style={{ marginBottom: 8 }}>
              {/* 추천 제목 */}
              {note.titleOptions.length > 0 ? (
                <SectionCard title="📌 추천 제목" colors={colors}>
                  <View style={{ gap: 8 }}>
                    {note.titleOptions.map((option, idx) => {
                      const isSelected =
                        selectedTitleIdx === idx ||
                        (selectedTitleIdx === null && note.title === option.title);
                      return (
                        <View
                          key={idx}
                          style={{
                            backgroundColor: colors.surface,
                            borderRadius: 12,
                            borderWidth: isSelected ? 1.5 : 0.5,
                            borderColor: isSelected ? colors.primary : colors.border,
                            paddingHorizontal: 14,
                            paddingVertical: 12,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <TextInput
                            editable={false}
                            multiline
                            scrollEnabled={false}
                            value={option.title}
                            style={{ flex: 1, fontSize: 14, color: colors.text, lineHeight: 20, padding: 0, borderWidth: 0, backgroundColor: "transparent" }}
                          />
                          <TouchableOpacity
                            onPress={() => handleSelectTitle(option, idx)}
                            accessibilityRole="button"
                          >
                            <Text style={{
                              fontSize: 12,
                              fontWeight: "700",
                              color: isSelected ? colors.textTertiary : colors.primary,
                            }}>
                              {isSelected ? "선택됨" : "선택"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </SectionCard>
              ) : isGeneratingAI ? null : (
                <TouchableOpacity
                  onPress={() => generateAISuggestions(note.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    paddingVertical: 14,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: colors.border,
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="sparkles-outline" size={16} color={colors.primary} />
                  <Text style={{ fontSize: 14, color: colors.primary, fontWeight: "600" }}>
                    AI 추천 제목 받기
                  </Text>
                </TouchableOpacity>
              )}

              {/* 콘텐츠 구성안 */}
              {generatingText ? (
                <View style={{ backgroundColor: colors.noteBg, borderRadius: 16, padding: 16, marginBottom: 12 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={{ fontSize: 13, color: colors.primary, fontWeight: "600" }}>
                      콘텐츠 구성안 생성 중...
                    </Text>
                  </View>
                </View>
              ) : textContent ? (
                <>
                  <SectionCard title="📝 콘텐츠 구성안" colors={colors}>
                    <View style={{ gap: 8 }}>
                      {textContent.contentOutline.map((item, i) => (
                        <View key={i} style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
                          <Text style={{ color: colors.primary, fontSize: 14, fontWeight: "700", marginTop: 1 }}>•</Text>
                          <TextInput
                            editable={false}
                            multiline
                            scrollEnabled={false}
                            value={item}
                            style={{ flex: 1, fontSize: 14, color: colors.textSecondary, lineHeight: 22, padding: 0, borderWidth: 0, backgroundColor: "transparent" }}
                          />
                        </View>
                      ))}
                    </View>
                  </SectionCard>

                  {textContent.hashtags.length > 0 && (
                    <SectionCard title="#️⃣ 추천 해시태그" colors={colors}>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                        {textContent.hashtags.map((tag) => (
                          <View
                            key={tag}
                            style={{
                              backgroundColor: colors.primarySoft,
                              borderRadius: 12,
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                            }}
                          >
                            <TextInput
                              editable={false}
                              value={`#${tag}`}
                              style={{ color: colors.primary, fontSize: 13, fontWeight: "500", padding: 0, borderWidth: 0, backgroundColor: "transparent" }}
                            />
                          </View>
                        ))}
                      </View>
                    </SectionCard>
                  )}

                  {/* 제작 시작 액션 버튼 */}
                  {!movedToProgress && (
                    <TouchableOpacity
                      onPress={handleAction}
                      style={{
                        height: 50,
                        borderRadius: 14,
                        backgroundColor: colors.primary,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 12,
                      }}
                      accessibilityRole="button"
                    >
                      <Text style={{ color: "#FFF", fontSize: 15, fontWeight: "700" }}>
                        이 아이디어로 제작 시작하기 →
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : null}
            </View>
          )}

          {/* 플랫폼 미설정 or 기타: 기존 derived ideas + title options */}
          {!isYouTube && !isTextBased && (
            <>
              {isGeneratingAI && <AISkeleton colors={colors} />}

              {note.derivedIdeas.length > 0 && (
                <SectionCard title="⭐ AI 예상 타겟" colors={colors}>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {note.derivedIdeas.map((idea, idx) => (
                      <View
                        key={idx}
                        style={{
                          backgroundColor: colors.surface,
                          borderRadius: 14,
                          borderWidth: 0.5,
                          borderColor: colors.border,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                        }}
                      >
                        <Text style={{ fontSize: 13, color: colors.textSecondary }}>{idea.target}</Text>
                      </View>
                    ))}
                  </View>
                </SectionCard>
              )}

              {note.titleOptions.length > 0 && (
                <SectionCard title="⭐ AI 추천 제목" colors={colors}>
                  <View style={{ gap: 8 }}>
                    {note.titleOptions.map((option, idx) => {
                      const isSelected =
                        selectedTitleIdx === idx ||
                        (selectedTitleIdx === null && note.title === option.title);
                      return (
                        <View
                          key={idx}
                          style={{
                            backgroundColor: colors.surface,
                            borderRadius: 12,
                            borderWidth: isSelected ? 1 : 0.5,
                            borderColor: isSelected ? colors.primary : colors.border,
                            paddingHorizontal: 14,
                            paddingVertical: 12,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={{ flex: 1, fontSize: 14, color: colors.text, lineHeight: 20, marginRight: 12 }}>
                            {option.title}
                          </Text>
                          <TouchableOpacity onPress={() => handleSelectTitle(option, idx)}>
                            <Text style={{ fontSize: 12, fontWeight: "600", color: isSelected ? colors.textTertiary : colors.primary }}>
                              {isSelected ? "선택됨" : "선택"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </SectionCard>
              )}

              {!note.derivedIdeas.length && !note.titleOptions.length && !isGeneratingAI && (
                <TouchableOpacity
                  onPress={() => generateAISuggestions(note.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    paddingVertical: 14,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: colors.border,
                    marginBottom: 16,
                  }}
                >
                  <Ionicons name="sparkles-outline" size={16} color={colors.primary} />
                  <Text style={{ fontSize: 14, color: colors.primary, fontWeight: "600" }}>
                    AI 추천 다시 분석하기
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <IdeaFormSheet
        ref={sheetRef}
        editingNote={{
          id: note.id,
          title: note.title,
          content: note.rawContent,
          tags: note.tags,
          categoryId: note.categoryId,
        }}
        aiTitleOptions={note.titleOptions}
        aiDerivedIdeas={note.derivedIdeas}
        aiTextContent={textContent ?? undefined}
      />
    </SafeAreaView>
  );
}
