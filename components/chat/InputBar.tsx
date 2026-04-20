import React, { FC } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../lib/theme";

interface Props {
  onOpen: () => void;
  onMicPress: () => void;
  isRecording: boolean;
}

export const InputBar: FC<Props> = ({ onOpen, onMicPress, isRecording }) => {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderTopWidth: 0.5,
        borderTopColor: colors.border,
        paddingBottom: Platform.OS === "ios" ? 20 : 12,
        paddingTop: 10,
        paddingHorizontal: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      {/* Mic button */}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="마이크 버튼"
        onPress={onMicPress}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isRecording ? colors.primary : colors.surfaceElevated,
        }}
      >
        <Ionicons
          name={isRecording ? "stop" : "mic-outline"}
          size={18}
          color={isRecording ? colors.surface : colors.textTertiary}
        />
      </TouchableOpacity>

      {/* Input trigger */}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="아이디어 입력"
        onPress={onOpen}
        activeOpacity={0.7}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surfaceElevated,
          borderRadius: 22,
          paddingHorizontal: 16,
          height: 44,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text style={{ flex: 1, fontSize: 15, color: colors.textTertiary }}>
          오늘 떠오른 아이디어...
        </Text>
        <View
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="add" size={16} color={colors.surface} />
        </View>
      </TouchableOpacity>
    </View>
    </View>
  );
};
