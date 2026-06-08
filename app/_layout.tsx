import "../global.css";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { useAuthStore } from "../store/useAuthStore";
import { useCategoryStore } from "../store/useCategoryStore";
import { useChatStore } from "../store/useChatStore";
import { useSettingsStore } from "../store/useSettingsStore";
import { registerPushToken } from "../lib/notifications";
import { profilesApi } from "../lib/api/profilesApi";
import { supabase } from "../lib/supabase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 0, gcTime: 5 * 60 * 1000 },
  },
});

function AuthGate() {
  const { user, isLoading, initialize } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();
  // undefined = 아직 초기화 전 / null = 로그아웃 상태 / string = 로그인 상태
  const prevUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inLoginScreen = segments[0] === "login";
    const inTutorial  = segments[0] === "onboarding";
    const inProfile   = segments[0] === "profile";

    if (!user) {
      // 로그아웃 상태로 전환 → 다음 로그인 시 fresh 감지를 위해 null로 세팅
      prevUserId.current = null;
      if (!inLoginScreen && !inTutorial && !inProfile) {
        router.replace("/login" as never);
      }
      return;
    }

    // ── user가 non-null인 경우 ────────────────────────────────────────────
    // prevUserId가 null이면 "방금 로그인" (null → user 전환)
    const justLoggedIn = prevUserId.current === null;
    prevUserId.current = user.id;

    if (justLoggedIn) {
      // 신규 가입 여부를 profiles row 존재로 판단
      profilesApi.get(user.id).then((profile) => {
        router.replace((profile ? "/(tabs)" : "/onboarding") as never);
      });
    } else if (inLoginScreen) {
      // 앱 재시작 시 세션이 남아 있는 경우 로그인 화면을 건너뜀
      router.replace("/(tabs)" as never);
    }
  }, [user, isLoading]);

  return null;
}

export default function RootLayout() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      useCategoryStore.getState().initialize();
      useChatStore.getState().initialize();
      const fallbackName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? undefined;
      useSettingsStore.getState().initializeFromDB(user.id, fallbackName);
      registerPushToken(user.id);
    }
  }, [user]);

  // 네이티브: OAuth 딥링크 콜백 처리 (linky://... 로 돌아올 때)
  useEffect(() => {
    if (Platform.OS === "web") return;
    const sub = Linking.addEventListener("url", async ({ url }) => {
      if (url.includes("code=") || url.includes("access_token=")) {
        await supabase.auth.exchangeCodeForSession(url);
      }
    });
    return () => sub.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AuthGate />
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
