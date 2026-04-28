import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/useAuthStore";
import { useAppTheme } from "../lib/theme";
import { isSupabaseConfigured } from "../lib/supabase";

export default function LoginScreen() {
  const { signInWithGoogle } = useAuthStore();
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 48 }}>

        <View style={{ alignItems: "center", gap: 12 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              backgroundColor: colors.primarySoft,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 40 }}>💡</Text>
          </View>
          <Text style={{ color: colors.text, fontSize: 28, fontWeight: "800", letterSpacing: -1 }}>
            Linky
          </Text>
          <Text style={{ color: colors.textTertiary, fontSize: 14, textAlign: "center", lineHeight: 20 }}>
            아이디어를 떠올리기만 해.{"\n"}나머지는 링키가 다 한다.
          </Text>
        </View>

        <View style={{ width: "100%", gap: 12 }}>
          {isSupabaseConfigured ? (
            <TouchableOpacity
              onPress={signInWithGoogle}
              activeOpacity={0.8}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                paddingVertical: 16,
                borderRadius: 16,
                backgroundColor: colors.text,
              }}
            >
              <Ionicons name="logo-google" size={20} color={colors.background} />
              <Text style={{ color: colors.background, fontSize: 15, fontWeight: "700", letterSpacing: -0.3 }}>
                Google로 계속하기
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                onPress={signInWithGoogle}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  paddingVertical: 16,
                  borderRadius: 16,
                  backgroundColor: colors.primary,
                }}
              >
                <Ionicons name="flask-outline" size={20} color="#FFFFFF" />
                <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "700", letterSpacing: -0.3 }}>
                  로컬 모드로 테스트하기
                </Text>
              </TouchableOpacity>
              <Text style={{ color: colors.textTertiary, fontSize: 12, textAlign: "center", lineHeight: 18 }}>
                Supabase 키 미설정 상태입니다.{"\n"}데이터는 앱 세션 동안만 유지됩니다.
              </Text>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
