import React from "react";
import { Text, View } from "react-native";
import type { Note } from "../../types";
import { useAppTheme } from "../../lib/theme";
import { DerivedIdeaCard } from "./DerivedIdeaCard";
import { useChatStore } from "../../store/useChatStore";

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
  const { drillDown, drillDownResults, drillingDownKeys } = useChatStore();

  return (
    <View className="mb-4">
      {/* 노트 요약 카드 */}
      <View
        className="max-w-[88%] overflow-hidden rounded-2xl rounded-tl-sm"
        style={{
          backgroundColor: colors.surfaceElevated,
          borderLeftWidth: 2.5,
          borderLeftColor: colors.primary,
        }}
      >
        <View className="px-4 pt-4 pb-3" style={{ gap: 6 }}>
          <Text
            className="text-[15px] font-semibold"
            style={{ color: colors.text, letterSpacing: -0.3 }}
            numberOfLines={2}
          >
            {note.title}
          </Text>

          {note.rawContent.trim().length > 0 && (
            <Text
              className="text-[14px] leading-[21px]"
              style={{ color: colors.textTertiary }}
              numberOfLines={4}
            >
              {note.rawContent}
            </Text>
          )}

          {note.tags.length > 0 && (
            <View className="mt-1 flex-row flex-wrap" style={{ gap: 6 }}>
              {note.tags.map((tag) => (
                <View
                  key={tag}
                  className="rounded-full px-2.5 py-1"
                  style={{
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
          )}
        </View>
      </View>

      <Text className="mt-1 mb-3 text-[10px]" style={{ color: colors.textTertiary }}>
        {formatTime(note.createdAt)}
      </Text>

      {/* 파생 아이디어 */}
      {note.derivedIdeas.length > 0 && (
        <DerivedIdeaCard
          ideas={note.derivedIdeas}
          noteId={note.id}
          onSave={() => {}}
          onDrillDown={(ideaIdx) =>
            drillDown(note.id, ideaIdx, note.derivedIdeas[ideaIdx], note.rawContent)
          }
          drillDownResults={drillDownResults}
          drillingDownKeys={drillingDownKeys}
        />
      )}
    </View>
  );
};
