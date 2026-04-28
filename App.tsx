import { StatusBar } from "expo-status-bar";
import React, { useRef } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { InputBar } from "./components/chat/InputBar";
import { ChatBubble } from "./components/chat/ChatBubble";
import { NoteCard } from "./components/chat/NoteCard";
import { TypingIndicator } from "./components/chat/TypingIndicator";
import { IdeaFormSheet, IdeaFormSheetRef } from "./components/sheet/IdeaFormSheet";
import { useChatStore } from "./store/useChatStore";
import type { ChatMessage, Note } from "./types";

type ListItem =
  | { kind: "message"; data: ChatMessage }
  | { kind: "note"; data: Note };

export default function App() {
  const { messages, notes, isTyping } = useChatStore();
  const listRef = useRef<FlatList>(null);
  const sheetRef = useRef<IdeaFormSheetRef>(null);

  const scrollToBottom = () =>
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);

  const openSheet = () => sheetRef.current?.expand();

  const items: ListItem[] = [
    ...messages.map((m) => ({ kind: "message" as const, data: m })),
    ...notes.map((n) => ({ kind: "note" as const, data: n })),
  ].sort((a, b) => a.data.createdAt.getTime() - b.data.createdAt.getTime());

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.kind === "message") return <ChatBubble message={item.data} />;
    if (item.kind === "note")    return <NoteCard note={item.data} />;
    return null;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="light" />

        {/* Header */}
        <View className="border-b border-border px-5 py-3">
          <Text
            className="text-[18px] font-bold text-white"
            style={{ letterSpacing: -0.5 }}
          >
            링키
          </Text>
          <Text className="text-xs text-textMuted" style={{ marginTop: 1 }}>
            아이디어 인큐베이터
          </Text>
        </View>

        {/* Chat feed */}
        <FlatList
          ref={listRef}
          data={items}
          keyExtractor={(item) => `${item.kind}-${item.data.id}`}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          onContentSizeChange={scrollToBottom}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />

        {/* Input bar */}
        <InputBar onOpen={openSheet} />

        {/* Bottom sheet */}
        <IdeaFormSheet
          ref={sheetRef}
          onClose={() => {}}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
