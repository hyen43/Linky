import React from "react";
import { Text, View } from "react-native";
import type { ChatMessage } from "../../types";

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
  const isUser = message.role === "user";

  return (
    <View
      className={`mb-3 flex-row items-end ${isUser ? "justify-end" : "justify-start"}`}
    >
      <View className={`max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        <View
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "rounded-tr-sm bg-primary"
              : "rounded-tl-sm bg-surface2"
          }`}
        >
          <Text
            className="text-[15px] leading-[22px] text-white"
            style={{ letterSpacing: -0.1 }}
          >
            {message.content}
          </Text>
        </View>
        <Text className="mt-1 text-[10px] text-textMuted">
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
};
