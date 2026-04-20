import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppTheme } from "../lib/theme";

const STEPS = [
  {
    title: "아이디어를 입력하세요",
    description: "키워드 하나만 남겨도 좋아요. 링키가 흐름을 읽고 기획 초안을 만들어줘요.",
    icon: "bulb-outline" as const,
  },
  {
    title: "AI가 구조화합니다",
    description: "파생 아이디어 3개와 SEO 제목 3안을 자동 생성해 콘텐츠 방향을 빠르게 잡아요.",
    icon: "sparkles-outline" as const,
  },
  {
    title: "바로 제작으로 연결",
    description: "카테고리 자동 분류와 검색 중심 보드로, 떠오른 생각을 제작 가능한 작업으로 바꿔요.",
    icon: "grid-outline" as const,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();
  const [index, setIndex] = useState(0);

  const progress = useMemo(() => ((index + 1) / STEPS.length) * 100, [index]);
  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 8 }}>
        <TouchableOpacity onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="닫기">
          <Text style={{ color: colors.textTertiary, fontSize: 14, fontWeight: "600" }}>닫기</Text>
        </TouchableOpacity>
        <Text style={{ color: colors.textTertiary, fontSize: 12, fontWeight: "600" }}>{index + 1} / {STEPS.length}</Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: 14 }}>
        <View style={{ height: 6, backgroundColor: colors.surface, borderRadius: 999 }}>
          <View style={{ width: `${progress}%`, height: 6, backgroundColor: colors.primary, borderRadius: 999 }} />
        </View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: "center" }}>
        <View style={{ width: 72, height: 72, borderRadius: 22, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <Ionicons name={step.icon} size={32} color={colors.primary} />
        </View>
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: "800", letterSpacing: -0.8, lineHeight: 37 }}>
          {step.title}
        </Text>
        <Text style={{ color: colors.textTertiary, fontSize: 16, lineHeight: 24, marginTop: 12 }}>
          {step.description}
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20, paddingBottom: 18, gap: 8 }}>
        {!isLast && (
          <TouchableOpacity
            onPress={() => setIndex((prev) => Math.min(prev + 1, STEPS.length - 1))}
            style={{ height: 50, borderRadius: 14, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}
            accessibilityRole="button"
            accessibilityLabel="다음 단계"
          >
            <Text style={{ color: colors.surface, fontSize: 15, fontWeight: "700" }}>다음</Text>
          </TouchableOpacity>
        )}

        {isLast ? (
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            style={{ height: 50, borderRadius: 14, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}
            accessibilityRole="button"
            accessibilityLabel="링키 시작하기"
          >
            <Text style={{ color: colors.surface, fontSize: 15, fontWeight: "700" }}>링키 시작하기</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            style={{ height: 50, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}
            accessibilityRole="button"
            accessibilityLabel="건너뛰기"
          >
            <Text style={{ color: colors.textSecondary, fontSize: 15, fontWeight: "700" }}>건너뛰기</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
