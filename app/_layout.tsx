import "../global.css";
import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 0, gcTime: 5 * 60 * 1000 },
  },
});

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const launched = await AsyncStorage.getItem("hasLaunched");
      if (!launched) {
        await AsyncStorage.setItem("hasLaunched", "true");
        router.replace("/onboarding");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
