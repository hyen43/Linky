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
    hour12: true,
  });
}

export const ChatBubble: React.FC<Props> = ({ message }) => {
  const { colors } = useAppTheme();
  const isUser = message.role === "user";

  return (
    <View
      style={{
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <View style={{ maxWidth: "78%", alignItems: isUser ? "flex-end" : "flex-start" }}>
        <View
          style={{
            borderRadius: 18,
            paddingHorizontal: 14,
            paddingVertical: 10,
            backgroundColor: isUser ? colors.primary : colors.surfaceElevated,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              color: isUser ? "#FFFFFF" : colors.textSecondary,
            }}
          >
            {message.content}
          </Text>
        </View>
        <Text style={{ marginTop: 4, fontSize: 11, color: colors.textTertiary }}>
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
};
