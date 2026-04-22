import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { Note } from "../../types";
import { useAppTheme } from "../../lib/theme";

interface Props {
  note: Note;
  folderName?: string;
  onPress?: () => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export const NoteCard: React.FC<Props> = ({ note, folderName = "초안", onPress }) => {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={{ marginBottom: 16, marginLeft: 16, marginRight: 8 }}
    >
      <View
        style={{
          backgroundColor: colors.noteBg,
          borderRadius: 16,
          borderWidth: 0.5,
          borderColor: colors.noteBorder,
          overflow: "hidden",
          padding: 16,
          gap: 8,
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
            numberOfLines={4}
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

        <Text style={{ fontSize: 11, color: colors.textTertiary }}>
          📁 {folderName} 폴더에 저장됨
        </Text>
      </View>

      <Text style={{ marginTop: 4, fontSize: 11, color: colors.textTertiary, alignSelf: "flex-end" }}>
        {formatTime(note.createdAt)}
      </Text>
    </TouchableOpacity>
  );
};
