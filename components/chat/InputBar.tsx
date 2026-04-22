import React, { FC, useState } from "react";
import { Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "../../lib/theme";

interface Props {
  onOpen: () => void;
  onSend?: (text: string) => void;
  folderName?: string;
}

export const InputBar: FC<Props> = ({ onOpen, onSend, folderName = "초안" }) => {
  const { colors } = useAppTheme();
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend?.(text.trim());
    setText("");
  };

  return (
    <View
      style={{
        backgroundColor: colors.background,
        borderTopWidth: 0.5,
        borderTopColor: colors.border,
        paddingTop: 10,
        paddingBottom: Platform.OS === "ios" ? 20 : 12,
        paddingHorizontal: 16,
        gap: 8,
      }}
    >
      {/* 폴더 + 노트 모드 토글 */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={{ fontSize: 12, color: colors.textTertiary }}>📁 폴더:</Text>
          <View
            style={{
              backgroundColor: colors.surfaceElevated,
              borderRadius: 10,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: "500" }}>
              {folderName}
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: colors.primary, fontWeight: "600" }}>변경</Text>
        </View>

        <TouchableOpacity
          onPress={onOpen}
          accessibilityRole="button"
          accessibilityLabel="노트 모드 열기"
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surfaceElevated,
            borderRadius: 10,
            paddingHorizontal: 8,
            paddingVertical: 3,
            gap: 3,
          }}
        >
          <Text style={{ fontSize: 11 }}>📝</Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: "500" }}>노트 모드</Text>
        </TouchableOpacity>
      </View>

      {/* 입력창 + 전송 버튼 */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.surfaceElevated,
            borderRadius: 20,
            borderWidth: 0.5,
            borderColor: colors.border,
            paddingHorizontal: 16,
            paddingVertical: Platform.OS === "ios" ? 10 : 8,
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="아이디어를 적어보세요..."
            placeholderTextColor={colors.textTertiary}
            style={{ color: colors.text, fontSize: 14, padding: 0 }}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            accessibilityLabel="아이디어 입력"
            testID="quick-input"
          />
        </View>

        <TouchableOpacity
          onPress={handleSend}
          accessibilityRole="button"
          accessibilityLabel="전송"
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
