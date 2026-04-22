import React, { useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ChatBubble } from "../../components/chat/ChatBubble";
import { NoteCard } from "../../components/chat/NoteCard";
import { AIStructureCard } from "../../components/chat/AIStructureCard";
import { TypingIndicator } from "../../components/chat/TypingIndicator";
import { InputBar } from "../../components/chat/InputBar";
import { IdeaFormSheet, IdeaFormSheetRef } from "../../components/sheet/IdeaFormSheet";
import { useChatStore } from "../../store/useChatStore";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useAppTheme } from "../../lib/theme";
import type { ChatMessage, Note } from "../../types";

type ListItem =
  | { kind: "message"; data: ChatMessage }
  | { kind: "note"; data: Note }
  | { kind: "pending"; data: Note };

interface EditingNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export default function NoteScreen() {
  const { colors } = useAppTheme();
  const { messages, notes, isTyping, sendMessage, confirmNote, discardNote } = useChatStore();
  const { categories } = useCategoryStore();
  const listRef = useRef<FlatList>(null);
  const sheetRef = useRef<IdeaFormSheetRef>(null);
  const [editingNote, setEditingNote] = useState<EditingNote | null>(null);

  const defaultFolder = categories.find((c) => c.isDefault) ?? categories[0];

  const scrollToBottom = () =>
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);

  const openSheet = () => {
    setEditingNote(null);
    sheetRef.current?.expand();
  };

  const handleEdit = (note: Note) => {
    discardNote(note.id);
    setEditingNote({
      id: note.id,
      title: note.title,
      content: note.rawContent,
      tags: note.tags,
    });
    sheetRef.current?.expand();
  };

  const items: ListItem[] = [
    ...messages.map((m) => ({ kind: "message" as const, data: m })),
    ...notes.map((n) => ({
      kind: (n.confirmed === false ? "pending" : "note") as "pending" | "note",
      data: n,
    })),
  ].sort((a, b) => a.data.createdAt.getTime() - b.data.createdAt.getTime());

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.kind === "message") return <ChatBubble message={item.data} />;
    if (item.kind === "pending") {
      return (
        <AIStructureCard
          note={item.data}
          onConfirm={() => confirmNote(item.data.id)}
          onEdit={() => handleEdit(item.data)}
        />
      );
    }
    if (item.kind === "note") {
      const folder = categories.find((c) => c.id === item.data.categoryId);
      return (
        <NoteCard
          note={item.data}
          folderName={folder?.name ?? "초안"}
          onPress={() => router.push(`/note/${item.data.id}`)}
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <StatusBar style="dark" />

      {/* 헤더 */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 12,
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: 28,
            fontWeight: "700",
            letterSpacing: -0.5,
          }}
        >
          Linky
        </Text>
        <TouchableOpacity
          onPress={openSheet}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
          accessibilityRole="button"
          accessibilityLabel="새 노트"
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* 채팅 피드 */}
      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(item) =>
          item.kind === "message" ? item.data.id : `note-${item.data.id}`
        }
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 12 }}
        onContentSizeChange={scrollToBottom}
        ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        showsVerticalScrollIndicator={false}
        testID="chat-list"
      />

      <InputBar
        onOpen={openSheet}
        onSend={(text) => sendMessage(text, defaultFolder?.id ?? null)}
        folderName={defaultFolder?.name ?? "초안"}
      />

      <IdeaFormSheet
        ref={sheetRef}
        onClose={() => setEditingNote(null)}
        editingNote={editingNote}
      />
    </SafeAreaView>
  );
}
