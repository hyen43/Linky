import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";
import { useSettingsStore } from "../store/useSettingsStore";
import { useAppTheme } from "../lib/theme";

const PLATFORM_OPTIONS = [
  { label: "유튜브", emoji: "🎬" },
  { label: "인스타그램", emoji: "📸" },
  { label: "블로그", emoji: "✍️" },
  { label: "팟캐스터", emoji: "🎙" },
  { label: "틱톡", emoji: "🎵" },
];

export default function ProfileScreen() {
  const { colors } = useAppTheme();
  const { user } = useAuthStore();
  const { userName, platforms, setUserName, setPlatforms } = useSettingsStore();

  const [name, setName] = useState(userName === "크리에이터" ? "" : userName);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    platforms.filter((p) => p !== "기타"),
  );

  const togglePlatform = (p: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    if (trimmedName) setUserName(trimmedName, user?.id);
    const finalPlatforms = selectedPlatforms.length > 0 ? selectedPlatforms : ["기타"];
    setPlatforms(finalPlatforms, user?.id);
    router.replace("/(tabs)");
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* 헤더 */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 8,
      }}>
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: "800", letterSpacing: -0.5 }}>
          시작하기
        </Text>
        <TouchableOpacity onPress={handleSkip} accessibilityRole="button">
          <Text style={{ color: colors.textTertiary, fontSize: 14, fontWeight: "600" }}>건너뛰기</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 이름 섹션 */}
        <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textTertiary, marginBottom: 8, letterSpacing: 0.5 }}>
          이름
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text, marginBottom: 4 }}>
          어떻게 불러드릴까요?
        </Text>
        <Text style={{ fontSize: 14, color: colors.textTertiary, marginBottom: 16 }}>
          채찍질 메시지와 AI 추천에 사용돼요
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="닉네임을 입력해주세요"
          placeholderTextColor={colors.textTertiary}
          style={{
            backgroundColor: colors.surfaceElevated,
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 15,
            fontSize: 16,
            color: colors.text,
            marginBottom: 40,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          maxLength={20}
          returnKeyType="done"
        />

        {/* 플랫폼 섹션 */}
        <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textTertiary, marginBottom: 8, letterSpacing: 0.5 }}>
          활동 플랫폼
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text, marginBottom: 4 }}>
          어디서 활동하나요?
        </Text>
        <Text style={{ fontSize: 14, color: colors.textTertiary, marginBottom: 20 }}>
          플랫폼에 맞는 AI 추천을 받을 수 있어요
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 48 }}>
          {PLATFORM_OPTIONS.map(({ label, emoji }) => {
            const selected = selectedPlatforms.includes(label);
            return (
              <TouchableOpacity
                key={label}
                onPress={() => togglePlatform(label)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                  borderRadius: 20,
                  backgroundColor: selected ? colors.primary : colors.surfaceElevated,
                  borderWidth: 1.5,
                  borderColor: selected ? colors.primary : colors.border,
                }}
                accessibilityRole="button"
              >
                <Text style={{ fontSize: 16 }}>{emoji}</Text>
                <Text style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: selected ? "#FFFFFF" : colors.textSecondary,
                }}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 저장 버튼 */}
        <TouchableOpacity
          onPress={handleSave}
          style={{
            height: 56,
            borderRadius: 16,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
          accessibilityRole="button"
          accessibilityLabel="Linky 시작하기"
        >
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>
            Linky 시작하기
          </Text>
        </TouchableOpacity>

        {selectedPlatforms.length === 0 && (
          <Text style={{ textAlign: "center", color: colors.textTertiary, fontSize: 13, marginTop: 12 }}>
            플랫폼을 선택하지 않으면 기본 추천을 드려요
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
