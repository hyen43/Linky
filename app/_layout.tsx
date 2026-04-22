import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useCategoryStore } from "../store/useCategoryStore";
import { useChatStore } from "../store/useChatStore";

export default function RootLayout() {
  useEffect(() => {
    useCategoryStore.getState().initialize();
    useChatStore.getState().initialize();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
