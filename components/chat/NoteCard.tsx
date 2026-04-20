import React from "react";
import { Text, View } from "react-native";
import type { Note } from "../../types";
import { useAppTheme } from "../../lib/theme";

interface Props {
  note: Note;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const NoteCard: React.FC<Props> = ({ note }) => {
  const { colors } = useAppTheme();

  return (
    <View className="mb-4 max-w-[88%]">
      <View
        className="overflow-hidden rounded-2xl rounded-tl-sm"
        style={{ backgroundColor: colors.surfaceElevated, borderLeftWidth: 2.5, borderLeftColor: colors.primary }}
      >
        <View className="px-4 pt-4 pb-3" style={{ gap: 6 }}>
        {/* Title */}
        <Text
          className="text-[15px] font-semibold"
          style={{ color: colors.text, letterSpacing: -0.3 }}
          numberOfLines={2}
        >
          {note.title}
        </Text>

        {/* Content */}
        {note.rawContent.trim().length > 0 && (
          <Text
            className="text-[14px] leading-[21px]"
            style={{ color: colors.textTertiary }}
            numberOfLines={4}
          >
            {note.rawContent}
          </Text>
        )}

        {/* Tags */}
        {note.tags.length > 0 && (
          <View className="mt-1 flex-row flex-wrap" style={{ gap: 6 }}>
            {note.tags.map((tag) => (
              <View
                key={tag}
                className="rounded-full px-2.5 py-1"
                style={{ backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.border }}
              >
                <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "500" }}>
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
      </View>

      <Text className="mt-1 text-[10px]" style={{ color: colors.textTertiary }}>
        {formatTime(note.createdAt)}
      </Text>
    </View>
  );
};
