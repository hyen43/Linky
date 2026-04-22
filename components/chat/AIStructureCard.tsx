import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { Note } from "../../types";
import { useAppTheme } from "../../lib/theme";

interface Props {
  note: Note;
  onConfirm: () => void;
  onEdit: () => void;
}

export const AIStructureCard: React.FC<Props> = ({ note, onConfirm, onEdit }) => {
  const { colors } = useAppTheme();

  return (
    <View style={{ marginBottom: 16, marginRight: 8 }}>
      <View
        style={{
          backgroundColor: colors.noteBg,
          borderRadius: 16,
          borderWidth: 0.5,
          borderColor: colors.noteBorder,
          padding: 16,
          gap: 10,
        }}
      >
        <Text
          style={{ fontSize: 16, fontWeight: "600", color: colors.text, letterSpacing: -0.3 }}
          numberOfLines={2}
        >
          {note.title}
        </Text>

        {note.rawContent.trim().length > 0 && (
          <Text
            style={{ fontSize: 13, color: colors.textTertiary, lineHeight: 20 }}
            numberOfLines={3}
          >
            {note.rawContent}
          </Text>
        )}

        {note.tags.length > 0 && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
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
                <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "500" }}>
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* 저장 / 수정 버튼 */}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 2 }}>
          <TouchableOpacity
            onPress={onConfirm}
            activeOpacity={0.8}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 10,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
            accessibilityRole="button"
            accessibilityLabel="저장"
          >
            <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "600" }}>저장</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onEdit}
            activeOpacity={0.8}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 10,
              backgroundColor: colors.surface,
              borderWidth: 0.5,
              borderColor: colors.border,
              alignItems: "center",
              justifyContent: "center",
            }}
            accessibilityRole="button"
            accessibilityLabel="수정"
          >
            <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "500" }}>수정</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
