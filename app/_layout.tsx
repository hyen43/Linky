import "../global.css";
import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import { useCategoryStore } from "../store/useCategoryStore";
import { useChatStore } from "../store/useChatStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 0, gcTime: 5 * 60 * 1000 },
  },
});

function AuthGate() {
  const { user, isLoading, initialize } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const inLoginScreen = segments[0] === "login";
    if (!user && !inLoginScreen) {
      router.replace("/login" as never);
    } else if (user && inLoginScreen) {
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
    }
  }, [user]);

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
