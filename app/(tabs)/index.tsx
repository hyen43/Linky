import React, { useRef } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ChatBubble } from "../../components/chat/ChatBubble";
import { NoteCard } from "../../components/chat/NoteCard";
import { TypingIndicator } from "../../components/chat/TypingIndicator";
import { InputBar } from "../../components/chat/InputBar";
import { IdeaFormSheet, IdeaFormSheetRef } from "../../components/sheet/IdeaFormSheet";
import { useChatStore } from "../../store/useChatStore";
import type { ChatMessage, Note } from "../../types";
import { useAppTheme } from "../../lib/theme";

type ListItem =
  | { kind: "message"; data: ChatMessage }
  | { kind: "note"; data: Note };

function EmptyState({
  textColor,
  mutedColor,
  iconBg,
  onPrimaryAction,
}: {
  textColor: string;
  mutedColor: string;
  iconBg: string;
  onPrimaryAction: () => void;
}) {
  return (
    <View className="flex-1 px-6 pt-8">
      <View
        style={{
          borderRadius: 18,
          padding: 16,
          backgroundColor: iconBg,
          marginBottom: 18,
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: "700", color: textColor }}>LINKY PROTOTYPE</Text>
        <Text style={{ fontSize: 18, fontWeight: "800", color: textColor, letterSpacing: -0.4 }}>
          아이디어를 떠올리기만 해. 나머지는 링키가 다 한다.
        </Text>
        <TouchableOpacity
          onPress={onPrimaryAction}
          style={{
            marginTop: 4,
            alignSelf: "flex-start",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 999,
            backgroundColor: textColor,
          }}
        >
          <Text style={{ color: iconBg, fontWeight: "700", fontSize: 12 }}>첫 아이디어 입력</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", gap: 8, marginBottom: 24 }}>
        {["파생 아이디어 3개", "SEO 제목 3안", "자동 카테고리"].map((item) => (
          <View key={item} style={{ flex: 1, borderRadius: 12, backgroundColor: iconBg, padding: 10 }}>
            <Text style={{ color: textColor, fontSize: 12, fontWeight: "600", lineHeight: 16 }}>{item}</Text>
          </View>
        ))}
      </View>

      <View className="items-center justify-center px-4">
        <View
          className="mb-5 items-center justify-center rounded-3xl"
          style={{ width: 80, height: 80, backgroundColor: iconBg }}
        >
          <Text style={{ fontSize: 38 }}>💡</Text>
        </View>
        <Text className="text-center text-xl font-bold" style={{ letterSpacing: -0.5, color: textColor }}>
          아이디어를 떠올리기만 해
        </Text>
        <Text className="mt-2.5 text-center text-sm leading-6" style={{ color: mutedColor }}>
          키워드 하나면 충분해요.{"\n"}링키가 나머지를 모두 처리할게요.
        </Text>
      </View>
    </View>
  );
}

export default function CaptureScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { colors, isDark } = theme;
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border,
        }}
      >
        <View>
          <Text
            style={{
              color: colors.text,
              fontSize: 22,
              fontWeight: "800",
              letterSpacing: -0.8,
            }}
          >
            Linky
          </Text>
          <Text style={{ color: colors.textTertiary, fontSize: 11, marginTop: 1 }}>
            AI 아이디어 인큐베이터
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/onboarding")}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: colors.primarySoft,
            alignItems: "center",
            justifyContent: "center",
          }}
          accessibilityRole="button"
          accessibilityLabel="온보딩 열기"
        >
          <Ionicons name="sparkles" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Chat feed */}
      {isEmpty ? (
        <EmptyState
          textColor={colors.text}
          mutedColor={colors.textTertiary}
          iconBg={colors.primarySoft}
          onPrimaryAction={openSheet}
        />
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
