import React from "react";
import { Text, View } from "react-native";
import type { ChatMessage } from "../../types";
import { useAppTheme } from "../../lib/theme";

interface Props {
  message: ChatMessage;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const ChatBubble: React.FC<Props> = ({ message }) => {
  const { colors } = useAppTheme();
  const isUser = message.role === "user";

  return (
    <View
      className={`mb-3 flex-row items-end ${isUser ? "justify-end" : "justify-start"}`}
    >
      <View className={`max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        <View
          className="rounded-2xl px-4 py-3"
          style={{
            borderTopRightRadius: isUser ? 6 : 16,
            borderTopLeftRadius: isUser ? 16 : 6,
            backgroundColor: isUser ? colors.primary : colors.surfaceElevated,
          }}
        >
          <Text
            className="text-[15px] leading-[22px]"
            style={{ letterSpacing: -0.1, color: isUser ? colors.surface : colors.text }}
          >
            {message.content}
          </Text>
        </View>
        <Text className="mt-1 text-[10px]" style={{ color: colors.textTertiary }}>
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
};
