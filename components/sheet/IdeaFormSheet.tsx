import React, { forwardRef, useCallback, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useChatStore } from "../../store/useChatStore";

// ── Design tokens (raw values — NativeWind can't reach inside BottomSheet) ──
const COLORS = {
  bg:        "#060E1F",
  surface:   "#0C1D34",
  surface2:  "#122A45",
  surface3:  "#1C3A5E",
  primary:   "#38BDF8",
  secondary: "#7DD3FC",
  accent:    "#34D399",
  textMuted: "#5F8BAE",
  border:    "#1A3050",
  white:     "#FFFFFF",
};

interface Props {
  onClose?: () => void;
}

export type IdeaFormSheetRef = BottomSheet;

export const IdeaFormSheet = forwardRef<IdeaFormSheetRef, Props>(
  ({ onClose }, ref) => {
    const [title, setTitle]     = useState("");
    const [content, setContent] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags]       = useState<string[]>([]);
    const { saveNote }          = useChatStore();

    const snapPoints = ["92%"];

    const handleTagInputChange = (text: string) => {
      // comma or space triggers chip creation
      if (text.endsWith(",") || text.endsWith(" ")) {
        const trimmed = text.slice(0, -1).trim();
        if (trimmed && !tags.includes(trimmed)) {
          setTags((prev) => [...prev, trimmed]);
        }
        setTagInput("");
        return;
      }
      setTagInput(text);
    };

    const handleTagInputSubmit = () => {
      const trimmed = tagInput.trim();
      if (trimmed && !tags.includes(trimmed)) {
        setTags((prev) => [...prev, trimmed]);
        setTagInput("");
      }
    };

    const removeTag = (tag: string) =>
      setTags((prev) => prev.filter((t) => t !== tag));

    const handleSave = useCallback(() => {
      if (!title.trim() && !content.trim()) return;
      const finalTags = [...tags];
      if (tagInput.trim()) finalTags.push(tagInput.trim());

      saveNote({
        title: title.trim() || content.trim().slice(0, 40),
        content: content.trim(),
        tags: finalTags,
      });

      // reset
      setTitle("");
      setContent("");
      setTagInput("");
      setTags([]);
      Keyboard.dismiss();
      (ref as React.RefObject<BottomSheet>)?.current?.close();
      onClose?.();
    }, [title, content, tags, tagInput]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.6}
        />
      ),
      []
    );

    const canSave = title.trim().length > 0 || content.trim().length > 0;

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: COLORS.surface }}
        handleIndicatorStyle={{
          backgroundColor: COLORS.border,
          width: 36,
          height: 4,
        }}
        keyboardBehavior={Platform.OS === "ios" ? "extend" : "interactive"}
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        onChange={(index) => {
          if (index === -1) onClose?.();
        }}
      >
        <BottomSheetScrollView
          contentContainerStyle={{ paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Header ── */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 24,
              paddingTop: 8,
              paddingBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border,
            }}
          >
            <Text
              style={{
                color: COLORS.white,
                fontSize: 17,
                fontWeight: "700",
                letterSpacing: -0.4,
              }}
            >
              새 아이디어
            </Text>
            <TouchableOpacity
              onPress={handleSave}
              disabled={!canSave}
              style={{
                backgroundColor: canSave ? COLORS.primary : COLORS.surface3,
                paddingHorizontal: 18,
                paddingVertical: 8,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  color: canSave ? COLORS.bg : COLORS.textMuted,
                  fontSize: 14,
                  fontWeight: "700",
                  letterSpacing: -0.2,
                }}
              >
                저장
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: 24, paddingTop: 24, gap: 24 }}>
            {/* ── Title ── */}
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  color: COLORS.textMuted,
                  fontSize: 11,
                  fontWeight: "600",
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                }}
              >
                타이틀
              </Text>
              <BottomSheetTextInput
                value={title}
                onChangeText={setTitle}
                placeholder="아이디어 제목"
                placeholderTextColor={COLORS.surface3}
                returnKeyType="next"
                style={{
                  backgroundColor: COLORS.surface2,
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  color: COLORS.white,
                  fontSize: 16,
                  fontWeight: "500",
                  letterSpacing: -0.3,
                  borderWidth: 1.5,
                  borderColor: title ? COLORS.primary + "60" : COLORS.border,
                }}
              />
            </View>

            {/* ── Content ── */}
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  color: COLORS.textMuted,
                  fontSize: 11,
                  fontWeight: "600",
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                }}
              >
                내용
              </Text>
              <BottomSheetTextInput
                value={content}
                onChangeText={setContent}
                placeholder="아이디어를 자유롭게 적어보세요"
                placeholderTextColor={COLORS.surface3}
                multiline
                textAlignVertical="top"
                style={{
                  backgroundColor: COLORS.surface2,
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  color: COLORS.white,
                  fontSize: 15,
                  lineHeight: 24,
                  minHeight: 120,
                  borderWidth: 1.5,
                  borderColor: content ? COLORS.primary + "60" : COLORS.border,
                }}
              />
            </View>

            {/* ── Tags ── */}
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  color: COLORS.textMuted,
                  fontSize: 11,
                  fontWeight: "600",
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                }}
              >
                태그
              </Text>

              {/* Chips */}
              {tags.length > 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  {tags.map((tag) => (
                    <TouchableOpacity
                      key={tag}
                      onPress={() => removeTag(tag)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: COLORS.primary + "18",
                        borderRadius: 20,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        gap: 4,
                        borderWidth: 1,
                        borderColor: COLORS.primary + "40",
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.primary,
                          fontSize: 13,
                          fontWeight: "500",
                        }}
                      >
                        #{tag}
                      </Text>
                      <Ionicons
                        name="close"
                        size={12}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: COLORS.surface2,
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                  borderWidth: 1.5,
                  borderColor: tagInput ? COLORS.primary + "60" : COLORS.border,
                  gap: 8,
                }}
              >
                <BottomSheetTextInput
                  value={tagInput}
                  onChangeText={handleTagInputChange}
                  onSubmitEditing={handleTagInputSubmit}
                  placeholder="태그 입력 후 쉼표 또는 Enter"
                  placeholderTextColor={COLORS.surface3}
                  returnKeyType="done"
                  blurOnSubmit={false}
                  style={{
                    flex: 1,
                    color: COLORS.white,
                    fontSize: 15,
                    paddingVertical: 12,
                  }}
                />
                <Ionicons
                  name="pricetag-outline"
                  size={16}
                  color={COLORS.textMuted}
                />
              </View>
              <Text
                style={{
                  color: COLORS.textMuted,
                  fontSize: 11,
                  marginTop: 2,
                }}
              >
                쉼표(,) 또는 Enter로 태그 추가 · 태그 탭하면 삭제
              </Text>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

IdeaFormSheet.displayName = "IdeaFormSheet";
