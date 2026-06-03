import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppTheme } from "../lib/theme";

const STEPS = [
  {
    emoji: "💬",
    title: "아이디어를\n그냥 던지세요",
    description: "생각날 때 바로 입력하면 돼요.\n짧은 키워드 하나도 충분해요.",
  },
  {
    emoji: "✨",
    title: "AI가 콘텐츠로\n만들어줘요",
    description: "노트를 탭하면 플랫폼에 맞는\n영상 구성과 제목을 추천드려요.",
  },
  {
    emoji: "📋",
    title: "제작 단계를\n관리하세요",
    description: "초안 → 제작중 → 완료.\n탐색 탭에서 진행 상황을 확인해요.",
  },
];

async function markSeen() {
  await AsyncStorage.setItem("hasSeenTutorial", "true");
}

export default function OnboardingScreen() {
  const { colors } = useAppTheme();
  const [index, setIndex] = useState(0);

  const progress = useMemo(() => ((index + 1) / STEPS.length) * 100, [index]);
  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;

  const handleSkip = async () => {
    await markSeen();
    router.replace("/(tabs)");
  };

  const handleNext = () => {
    setIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleFinish = async () => {
    await markSeen();
    router.replace("/profile");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* 상단 바 */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 8,
      }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "800", letterSpacing: -0.5 }}>
          Linky
        </Text>
        <TouchableOpacity onPress={handleSkip} accessibilityRole="button" accessibilityLabel="건너뛰기">
          <Text style={{ color: colors.textTertiary, fontSize: 14, fontWeight: "600" }}>건너뛰기</Text>
        </TouchableOpacity>
      </View>

      {/* 프로그레스 바 */}
      <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
        <View style={{ height: 4, backgroundColor: colors.surfaceElevated, borderRadius: 999 }}>
          <View style={{
            width: `${progress}%`,
            height: 4,
            backgroundColor: colors.primary,
            borderRadius: 999,
          }} />
        </View>
        <Text style={{ color: colors.textTertiary, fontSize: 12, fontWeight: "600", marginTop: 6, textAlign: "right" }}>
          {index + 1} / {STEPS.length}
        </Text>
      </View>

      {/* 콘텐츠 */}
      <View style={{ flex: 1, paddingHorizontal: 28, justifyContent: "center", alignItems: "flex-start" }}>
        {/* 이모지 아이콘 */}
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          backgroundColor: colors.primarySoft,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 28,
        }}>
          <Text style={{ fontSize: 38 }}>{step.emoji}</Text>
        </View>

        <Text style={{
          color: colors.text,
          fontSize: 30,
          fontWeight: "800",
          letterSpacing: -0.8,
          lineHeight: 40,
          marginBottom: 16,
        }}>
          {step.title}
        </Text>

        <Text style={{
          color: colors.textTertiary,
          fontSize: 16,
          lineHeight: 26,
        }}>
          {step.description}
        </Text>
      </View>

      {/* 버튼 영역 */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 20, gap: 10 }}>
        {isLast ? (
          <TouchableOpacity
            onPress={handleFinish}
            style={{
              height: 54,
              borderRadius: 16,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
            accessibilityRole="button"
            accessibilityLabel="프로필 설정하기"
          >
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>
              프로필 설정하기 →
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleNext}
            style={{
              height: 54,
              borderRadius: 16,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
            accessibilityRole="button"
            accessibilityLabel="다음"
          >
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>다음</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
