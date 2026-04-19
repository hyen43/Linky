import React, { useRef } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { ChatBubble } from "../../components/chat/ChatBubble";
import { NoteCard } from "../../components/chat/NoteCard";
import { TypingIndicator } from "../../components/chat/TypingIndicator";
import { InputBar } from "../../components/chat/InputBar";
import { IdeaFormSheet, IdeaFormSheetRef } from "../../components/sheet/IdeaFormSheet";
import { useChatStore } from "../../store/useChatStore";
import type { ChatMessage, Note } from "../../types";

type ListItem =
  | { kind: "message"; data: ChatMessage }
  | { kind: "note"; data: Note };

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-10">
      <View
        className="mb-5 items-center justify-center rounded-3xl bg-primary/10"
        style={{ width: 80, height: 80 }}
      >
        <Text style={{ fontSize: 38 }}>💡</Text>
      </View>
      <Text className="text-center text-xl font-bold text-white" style={{ letterSpacing: -0.5 }}>
        아이디어를 떠올리기만 해
      </Text>
      <Text className="mt-2.5 text-center text-sm leading-6 text-textMuted">
        키워드 하나면 충분해요.{"\n"}링키가 나머지를 모두 처리할게요.
      </Text>
    </View>
  );
}

export default function CaptureScreen() {
  const { messages, notes, isTyping, isRecording, toggleRecording } = useChatStore();
  const listRef  = useRef<FlatList>(null);
  const sheetRef = useRef<IdeaFormSheetRef>(null);

  const scrollToBottom = () =>
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);

  const openSheet = () => sheetRef.current?.expand();

  const items: ListItem[] = [
    ...messages.map((m) => ({ kind: "message" as const, data: m })),
    ...notes.map((n) => ({ kind: "note" as const, data: n })),
  ].sort((a, b) => a.data.createdAt.getTime() - b.data.createdAt.getTime());

  const isEmpty = items.length === 0 && !isTyping;

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.kind === "message") return <ChatBubble message={item.data} />;
    if (item.kind === "note")    return <NoteCard note={item.data} />;
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#060E1F" }} edges={["top"]}>
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderBottomWidth: 0.5,
          borderBottomColor: "#1A3050",
        }}
      >
        <View>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 22,
              fontWeight: "800",
              letterSpacing: -0.8,
            }}
          >
            Linky
          </Text>
          <Text style={{ color: "#5F8BAE", fontSize: 11, marginTop: 1 }}>
            AI 아이디어 인큐베이터
          </Text>
        </View>
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: "#38BDF820",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="sparkles" size={18} color="#38BDF8" />
        </View>
      </View>

      {/* Chat feed */}
      {isEmpty ? (
        <EmptyState />
      ) : (
        <FlatList
          ref={listRef}
          data={items}
          keyExtractor={(item) =>
            item.kind === "message" ? item.data.id : `note-${item.data.id}`
          }
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
          onContentSizeChange={scrollToBottom}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          showsVerticalScrollIndicator={false}
          testID="chat-list"
        />
      )}

      <InputBar
        onOpen={openSheet}
        onMicPress={toggleRecording}
        isRecording={isRecording}
      />

      <IdeaFormSheet ref={sheetRef} onClose={() => {}} />
    </SafeAreaView>
  );
}
