import React from "react";
import { Text, View } from "react-native";
import type { Note } from "../../types";

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

export const NoteCard: React.FC<Props> = ({ note }) => (
  <View className="mb-4 max-w-[88%]">
    <View
      className="overflow-hidden rounded-2xl rounded-tl-sm bg-surface2"
      style={{ borderLeftWidth: 2.5, borderLeftColor: "#38BDF8" }}
    >
      <View className="px-4 pt-4 pb-3" style={{ gap: 6 }}>
        {/* Title */}
        <Text
          className="text-[15px] font-semibold text-white"
          style={{ letterSpacing: -0.3 }}
          numberOfLines={2}
        >
          {note.title}
        </Text>

        {/* Content */}
        {note.rawContent.trim().length > 0 && (
          <Text
            className="text-[14px] leading-[21px] text-textMuted"
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
                style={{ backgroundColor: "#38BDF818", borderWidth: 1, borderColor: "#38BDF840" }}
              >
                <Text style={{ color: "#38BDF8", fontSize: 12, fontWeight: "500" }}>
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>

    <Text className="mt-1 text-[10px] text-textMuted">
      {formatTime(note.createdAt)}
    </Text>
  </View>
);
