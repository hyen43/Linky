import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppTheme } from "../lib/theme";

const { width: SCREEN_W } = Dimensions.get("window");

// ── 슬라이드 1: 채팅 화면 미리보기 ──────────────────────────────────────────

function ChatPreview({ colors }: { colors: ReturnType<typeof import("../lib/theme").useAppTheme>["colors"] }) {
  return (
    <View style={{
      backgroundColor: colors.background,
      borderRadius: 20,
      overflow: "hidden",
      width: SCREEN_W - 64,
      height: 300,
      borderWidth: 1,
      borderColor: colors.border,
    }}>
      {/* 가짜 헤더 */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        paddingTop: 12,
        paddingBottom: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border,
      }}>
        <Text style={{ fontSize: 16, fontWeight: "800", color: colors.text }}>PokingNote</Text>
        <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="add" size={14} color="#fff" />
        </View>
      </View>

      {/* 채팅 메시지들 */}
      <View style={{ flex: 1, paddingHorizontal: 12, paddingTop: 10, gap: 8 }}>
        {/* AI 웰컴 버블 */}
        <View style={{ alignSelf: "flex-start", backgroundColor: colors.surfaceElevated, borderRadius: 14, paddingHorizontal: 11, paddingVertical: 7, maxWidth: "75%" }}>
          <Text style={{ fontSize: 11, color: colors.textSecondary }}>안녕하세요! PokingNote예요 👋{"\n"}아이디어가 떠올랐나요?</Text>
        </View>

        {/* 유저 메시지 */}
        <View style={{ alignSelf: "flex-end", backgroundColor: colors.primary, borderRadius: 14, paddingHorizontal: 11, paddingVertical: 7, maxWidth: "70%" }}>
          <Text style={{ fontSize: 11, color: "#fff" }}>요즘 사람들이 퇴사하는 이유</Text>
        </View>

        {/* AI 응답 */}
        <View style={{ alignSelf: "flex-start", backgroundColor: colors.surfaceElevated, borderRadius: 14, paddingHorizontal: 11, paddingVertical: 7, maxWidth: "75%" }}>
          <Text style={{ fontSize: 11, color: colors.textSecondary }}>저장됐어요! 탭해서 AI 추천을 확인해보세요 ✨</Text>
        </View>

        {/* 노트 카드 */}
        <View style={{
          backgroundColor: colors.noteBg,
          borderRadius: 12,
          borderWidth: 0.5,
          borderColor: colors.noteBorder,
          padding: 10,
        }}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: colors.text, marginBottom: 3 }}>요즘 사람들이 퇴사하는 이유</Text>
          <View style={{ flexDirection: "row", gap: 4 }}>
            {["퇴사", "직장생활", "커리어"].map(t => (
              <View key={t} style={{ backgroundColor: colors.primarySoft, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 }}>
                <Text style={{ fontSize: 9, color: colors.primary }}>#{t}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 하이라이트된 입력창 */}
      <View style={{
        margin: 10,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: colors.primary,
        backgroundColor: colors.primarySoft,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 9,
        gap: 8,
      }}>
        <Text style={{ flex: 1, fontSize: 11, color: colors.primary, opacity: 0.7 }}>아이디어를 입력하세요...</Text>
        <Ionicons name="send" size={14} color={colors.primary} />
      </View>
    </View>
  );
}

// ── 슬라이드 2: 상세 화면 AI 추천 미리보기 ─────────────────────────────────

function DetailPreview({ colors }: { colors: ReturnType<typeof import("../lib/theme").useAppTheme>["colors"] }) {
  return (
    <View style={{
      backgroundColor: colors.background,
      borderRadius: 20,
      overflow: "hidden",
      width: SCREEN_W - 64,
      height: 300,
      borderWidth: 1,
      borderColor: colors.border,
    }}>
      {/* 헤더 */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingTop: 12,
        paddingBottom: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border,
        gap: 6,
      }}>
        <Ionicons name="chevron-back" size={14} color={colors.primary} />
        <Text style={{ fontSize: 12, color: colors.primary, fontWeight: "500" }}>노트</Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 12, paddingTop: 10 }}>
        {/* 제목 */}
        <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text, marginBottom: 6 }}>
          요즘 사람들이 퇴사하는 이유
        </Text>

        {/* AI 추천 라벨 */}
        <Text style={{ fontSize: 10, fontWeight: "700", color: colors.primary, marginBottom: 6 }}>✨ AI 추천</Text>

        {/* 유튜브 훅 카드 */}
        <View style={{ backgroundColor: colors.noteBg, borderRadius: 10, padding: 9, marginBottom: 6 }}>
          <Text style={{ fontSize: 9, fontWeight: "700", color: colors.primary, marginBottom: 4 }}>🎣 오프닝 훅</Text>
          <Text style={{ fontSize: 10, color: colors.textSecondary, lineHeight: 14 }}>
            "3년 다닌 회사를 그만두기 전날 밤, 저는..."
          </Text>
        </View>

        {/* 영상 구성 카드 */}
        <View style={{ backgroundColor: colors.noteBg, borderRadius: 10, padding: 9, marginBottom: 8 }}>
          <Text style={{ fontSize: 9, fontWeight: "700", color: colors.primary, marginBottom: 4 }}>📋 영상 구성</Text>
          {["1. 요즘 퇴사율이 높아진 이유", "2. 실제 퇴사자 인터뷰 3가지", "3. 남아야 할지 판단하는 법"].map((s, i) => (
            <Text key={i} style={{ fontSize: 9, color: colors.textSecondary, lineHeight: 14 }}>{s}</Text>
          ))}
        </View>

        {/* 제작 시작 버튼 - 하이라이트 */}
        <View style={{
          backgroundColor: colors.primary,
          borderRadius: 10,
          paddingVertical: 9,
          alignItems: "center",
        }}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: "#fff" }}>이 아이디어로 제작 시작하기 →</Text>
        </View>
      </View>
    </View>
  );
}

// ── 슬라이드 3: 칸반 보드 미리보기 ────────────────────────────────────────

function BoardPreview({ colors }: { colors: ReturnType<typeof import("../lib/theme").useAppTheme>["colors"] }) {
  const columns = [
    { name: "초안", color: "#9CA3AF", icon: "📄", cards: ["퇴사하는 이유", "아침 루틴 공개"] },
    { name: "제작중", color: "#F59E0B", icon: "✏️", cards: ["AI 활용법 A-Z"] },
    { name: "완료", color: "#22C55E", icon: "✅", cards: ["소자본 창업 후기"] },
  ];

  return (
    <View style={{
      backgroundColor: colors.background,
      borderRadius: 20,
      overflow: "hidden",
      width: SCREEN_W - 64,
      height: 300,
      borderWidth: 1,
      borderColor: colors.border,
    }}>
      {/* 헤더 */}
      <View style={{
        paddingHorizontal: 14,
        paddingTop: 12,
        paddingBottom: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border,
      }}>
        <Text style={{ fontSize: 14, fontWeight: "800", color: colors.text }}>탐색</Text>
      </View>

      {/* 칸반 컬럼들 */}
      <View style={{ flex: 1, flexDirection: "row", paddingHorizontal: 10, paddingTop: 10, gap: 8 }}>
        {columns.map((col) => (
          <View key={col.name} style={{ flex: 1, gap: 6 }}>
            {/* 컬럼 헤더 */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 10 }}>{col.icon}</Text>
              <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary }}>{col.name}</Text>
              <View style={{ backgroundColor: colors.surfaceElevated, borderRadius: 8, paddingHorizontal: 5, paddingVertical: 1 }}>
                <Text style={{ fontSize: 9, color: colors.textTertiary }}>{col.cards.length}</Text>
              </View>
            </View>

            {/* 카드들 */}
            {col.cards.map((card) => (
              <View key={card} style={{
                backgroundColor: colors.surface,
                borderRadius: 8,
                borderWidth: 0.5,
                borderColor: colors.border,
                borderLeftWidth: 2.5,
                borderLeftColor: col.color,
                padding: 7,
              }}>
                <Text style={{ fontSize: 9, color: colors.text, fontWeight: "600", lineHeight: 13 }}>{card}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* 하단 안내 */}
      <View style={{ alignItems: "center", paddingBottom: 10, paddingTop: 4 }}>
        <Text style={{ fontSize: 9, color: colors.textTertiary }}>길게 눌러서 드래그로 이동 가능</Text>
      </View>
    </View>
  );
}

// ── 슬라이드 데이터 ────────────────────────────────────────────────────────

const SLIDES = [
  {
    key: "chat",
    badge: "STEP 1",
    title: "아이디어를\n그냥 던지세요",
    desc: "생각난 키워드를 바로 입력하면 돼요.\n길게 쓰지 않아도 괜찮아요.",
    Preview: ChatPreview,
  },
  {
    key: "detail",
    badge: "STEP 2",
    title: "AI가 콘텐츠로\n만들어줘요",
    desc: "노트를 탭하면 유튜브·인스타·블로그\n플랫폼에 맞는 제작 가이드를 드려요.",
    Preview: DetailPreview,
  },
  {
    key: "board",
    badge: "STEP 3",
    title: "제작을 단계별로\n관리하세요",
    desc: "초안 → 제작중 → 완료.\n길게 눌러 드래그로 이동할 수 있어요.",
    Preview: BoardPreview,
  },
];

// ── 점 인디케이터 ──────────────────────────────────────────────────────────

function Dots({ total, current, colors }: { total: number; current: number; colors: any }) {
  return (
    <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === current ? 20 : 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: i === current ? colors.primary : colors.border,
          }}
        />
      ))}
    </View>
  );
}

// ── 메인 화면 ──────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const { colors } = useAppTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const isLast = currentIndex === SLIDES.length - 1;

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const goNext = () => {
    if (!isLast) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  const handleFinish = async () => {
    router.replace("/profile");
  };

  const handleSkip = () => {
    router.replace("/profile");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* 상단 헤더 */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 4,
      }}>
        <Text style={{ fontSize: 18, fontWeight: "800", color: colors.text, letterSpacing: -0.5 }}>
          PokingNote
        </Text>
        <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={{ fontSize: 14, color: colors.textTertiary, fontWeight: "600" }}>건너뛰기</Text>
        </TouchableOpacity>
      </View>

      {/* 슬라이드 리스트 */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(s) => s.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_W, alignItems: "center", paddingTop: 16 }}>
            {/* STEP 배지 */}
            <View style={{
              backgroundColor: colors.primarySoft,
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 4,
              marginBottom: 16,
            }}>
              <Text style={{ fontSize: 11, fontWeight: "800", color: colors.primary, letterSpacing: 1 }}>
                {item.badge}
              </Text>
            </View>

            {/* 화면 미리보기 */}
            <item.Preview colors={colors} />

            {/* 텍스트 설명 */}
            <View style={{ paddingHorizontal: 28, marginTop: 24, alignItems: "flex-start", width: "100%" }}>
              <Text style={{
                fontSize: 26,
                fontWeight: "800",
                color: colors.text,
                letterSpacing: -0.7,
                lineHeight: 34,
                marginBottom: 10,
              }}>
                {item.title}
              </Text>
              <Text style={{ fontSize: 15, color: colors.textTertiary, lineHeight: 24 }}>
                {item.desc}
              </Text>
            </View>
          </View>
        )}
      />

      {/* 하단 영역 */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 20, gap: 16 }}>
        {/* 점 + 버튼 */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Dots total={SLIDES.length} current={currentIndex} colors={colors} />

          {isLast ? (
            <TouchableOpacity
              onPress={handleFinish}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 14,
                paddingHorizontal: 28,
                paddingVertical: 14,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>시작하기 →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={goNext}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 14,
                paddingHorizontal: 28,
                paddingVertical: 14,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>다음</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
