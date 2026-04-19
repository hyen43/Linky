import React, { FC } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  onOpen: () => void;
  onMicPress: () => void;
  isRecording: boolean;
}

export const InputBar: FC<Props> = ({ onOpen, onMicPress, isRecording }) => (
  <View
    style={{
      backgroundColor: "#0C1D34",
      borderTopWidth: 0.5,
      borderTopColor: "#1A3050",
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
          backgroundColor: isRecording ? "#38BDF8" : "#122A45",
        }}
      >
        <Ionicons
          name={isRecording ? "stop" : "mic-outline"}
          size={18}
          color={isRecording ? "#060E1F" : "#5F8BAE"}
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
          backgroundColor: "#122A45",
          borderRadius: 22,
          paddingHorizontal: 16,
          height: 44,
          borderWidth: 1,
          borderColor: "#1A3050",
        }}
      >
        <Text style={{ flex: 1, fontSize: 15, color: "#5F8BAE" }}>
          오늘 떠오른 아이디어...
        </Text>
        <View
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: "#38BDF8",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="add" size={16} color="#060E1F" />
        </View>
      </TouchableOpacity>
    </View>
  </View>
);
