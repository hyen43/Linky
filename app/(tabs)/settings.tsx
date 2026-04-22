import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useChatStore } from "../../store/useChatStore";
import { useAppTheme } from "../../lib/theme";

function SettingRow({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  const { colors } = useAppTheme();

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 16,
        }}
      >
        <Text style={{ fontSize: 15, color: colors.textSecondary }}>{label}</Text>
        <Text style={{ fontSize: 14, color: colors.textTertiary }}>{value}</Text>
      </TouchableOpacity>
      {!isLast && <View style={{ height: 0.5, backgroundColor: colors.border }} />}
    </>
  );
}

export default function MyPage() {
  const { colors } = useAppTheme();
  const { categories } = useCategoryStore();
  const { notes } = useChatStore();

  const countByName = (name: string) => {
    const cat = categories.find((c) => c.name === name);
    if (!cat) return 0;
    return notes.filter((n) => n.categoryId === cat.id).length;
  };

  const draftCount = countByName("초안");
  const inProgressCount = countByName("제작중");
  const doneCount = countByName("완료");

  const total = draftCount + inProgressCount + doneCount;
  const draftToInProgress = total > 0 ? Math.round((inProgressCount / Math.max(draftCount + inProgressCount, 1)) * 100) : 0;
  const inProgressToDone = total > 0 ? Math.round((doneCount / Math.max(inProgressCount + doneCount, 1)) * 100) : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
          <Text style={{ fontSize: 28, fontWeight: "700", color: colors.text, letterSpacing: -0.5 }}>
            마이페이지
          </Text>
        </View>

        {/* 프로필 카드 */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: colors.surfaceElevated,
              borderRadius: 16,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#FFFFFF" }}>크</Text>
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text, marginBottom: 4 }}>
                크리에이터 김
              </Text>
              <Text style={{ fontSize: 13, color: colors.textTertiary }}>
                유튜브 · 블로그 · 인스타그램
              </Text>
            </View>
          </View>
        </View>

        {/* 통계 3개 */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
            gap: 10,
            marginBottom: 20,
          }}
        >
          {[
            { label: "초안", count: draftCount },
            { label: "제작중", count: inProgressCount },
            { label: "완료", count: doneCount },
          ].map(({ label, count }) => (
            <View
              key={label}
              style={{
                flex: 1,
                backgroundColor: colors.surfaceElevated,
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "700", color: colors.primary, marginBottom: 4 }}
              >
                {count}
              </Text>
              <Text style={{ fontSize: 11, color: colors.textTertiary }}>{label}</Text>
            </View>
          ))}
        </View>

        {/* 채찍질 리포트 카드 */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <LinearGradient
            colors={["#1A6DFF", "#4A8FFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 16, padding: 18 }}
          >
            <Text
              style={{ fontSize: 15, fontWeight: "600", color: "#FFFFFF", marginBottom: 16 }}
            >
              ⭐ 7일간 진행률 리포트
            </Text>

            {/* 초안 → 제작중 */}
            <View style={{ marginBottom: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
                  초안 → 제작중
                </Text>
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF" }}>
                  {draftToInProgress}%
                </Text>
              </View>
              <View
                style={{
                  height: 6,
                  backgroundColor: "rgba(255,255,255,0.25)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: 6,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 3,
                    width: `${draftToInProgress}%`,
                  }}
                />
              </View>
            </View>

            {/* 제작중 → 완료 */}
            <View style={{ marginBottom: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
                  제작중 → 완료
                </Text>
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF" }}>
                  {inProgressToDone}%
                </Text>
              </View>
              <View
                style={{
                  height: 6,
                  backgroundColor: "rgba(255,255,255,0.25)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: 6,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 3,
                    width: `${inProgressToDone}%`,
                  }}
                />
              </View>
            </View>

            <View style={{ height: 0.5, backgroundColor: "rgba(255,255,255,0.2)", marginBottom: 14 }} />

            <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 20 }}>
              🔥 초안에 아이디어가 쌓이고 있어요!{"\n"}
              이번 주 안에 2개만 제작중으로 옮겨볼까요?{"\n"}
              작은 시작이 큰 결과를 만듭니다.
            </Text>
          </LinearGradient>
        </View>

        {/* 설정 리스트 */}
        <View style={{ paddingHorizontal: 20, marginBottom: 40 }}>
          <SettingRow label="알림 설정" value="매일 오전 9시 ›" />
          <SettingRow label="채찍질 강도" value="보통 ›" />
          <SettingRow label="다크모드" value="시스템 설정 ›" />
          <SettingRow label="데이터 내보내기" value="›" />
          <SettingRow label="버전 정보" value="v1.0.0 ›" isLast />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
