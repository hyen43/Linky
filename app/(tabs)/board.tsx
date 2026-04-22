import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useChatStore } from "../../store/useChatStore";
import { useAppTheme } from "../../lib/theme";
import type { Note } from "../../types";

const FOLDER_BG: Record<string, string> = {
  초안: "#F0F0F5",
  제작중: "#FFF3E0",
  완료: "#E8F5E9",
};

function FolderRow({
  icon,
  name,
  count,
  iconBg,
  onPress,
}: {
  icon: string;
  name: string;
  count: number;
  iconBg: string;
  onPress?: () => void;
}) {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12 }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: iconBg,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <Text style={{ flex: 1, fontSize: 16, fontWeight: "600", color: colors.text }}>
        {name}
      </Text>
      <Text style={{ fontSize: 14, color: colors.textTertiary, fontWeight: "500" }}>{count}</Text>
    </TouchableOpacity>
  );
}

function NoteCardSmall({ note }: { note: Note }) {
  const { colors } = useAppTheme();

  const formattedDate = note.createdAt.toLocaleDateString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 14,
        borderWidth: 0.5,
        borderColor: colors.border,
        padding: 16,
        marginBottom: 10,
      }}
    >
      <Text
        style={{ fontSize: 15, fontWeight: "600", color: colors.text, marginBottom: 6 }}
        numberOfLines={1}
      >
        {note.title}
      </Text>
      {note.rawContent.trim().length > 0 && (
        <Text
          style={{ fontSize: 13, color: colors.textTertiary, lineHeight: 20, marginBottom: 8 }}
          numberOfLines={2}
        >
          {note.rawContent}
        </Text>
      )}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, flex: 1 }}>
          {note.tags.slice(0, 2).map((tag) => (
            <View
              key={tag}
              style={{
                backgroundColor: colors.primarySoft,
                borderRadius: 10,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              <Text style={{ color: colors.primary, fontSize: 10, fontWeight: "500" }}>#{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={{ fontSize: 11, color: colors.textTertiary }}>{formattedDate}</Text>
      </View>
    </View>
  );
}

export default function BoardScreen() {
  const { colors } = useAppTheme();
  const { categories } = useCategoryStore();
  const { notes } = useChatStore();
  const [query, setQuery] = useState("");

  const defaultFolders = categories.filter((c) => c.isDefault);
  const customFolders = categories.filter((c) => !c.isDefault);

  const filteredNotes = query.trim()
    ? notes.filter((n) => {
        const q = query.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.rawContent.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
    : notes;

  const recentNotes = [...filteredNotes]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10);

  const countFor = (categoryId: string) =>
    notes.filter((n) => n.categoryId === categoryId).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
          <Text style={{ fontSize: 28, fontWeight: "700", color: colors.text, letterSpacing: -0.5 }}>
            탐색
          </Text>
        </View>

        {/* 검색바 */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.surfaceElevated,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 10,
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 15, color: colors.textTertiary }}>🔍</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="메모 검색..."
              placeholderTextColor={colors.textTertiary}
              style={{ flex: 1, color: colors.text, fontSize: 15, padding: 0 }}
              testID="search-input"
            />
          </View>
        </View>

        {/* 기본 폴더 */}
        <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: colors.textTertiary,
              marginBottom: 4,
            }}
          >
            기본 폴더
          </Text>
          {defaultFolders.map((folder, idx) => (
            <View key={folder.id}>
              <FolderRow
                icon={folder.icon}
                name={folder.name}
                count={countFor(folder.id)}
                iconBg={FOLDER_BG[folder.name] ?? colors.surfaceElevated}
              />
              {idx < defaultFolders.length - 1 && (
                <View style={{ height: 0.5, backgroundColor: colors.border, marginLeft: 52 }} />
              )}
            </View>
          ))}
        </View>

        {/* 커스텀 폴더 */}
        <View style={{ paddingHorizontal: 20, marginBottom: 8, marginTop: 12 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: colors.textTertiary,
              marginBottom: 4,
            }}
          >
            커스텀 폴더
          </Text>
          {customFolders.map((folder, idx) => (
            <View key={folder.id}>
              <FolderRow
                icon={folder.icon}
                name={folder.name}
                count={countFor(folder.id)}
                iconBg={colors.primarySoft}
              />
              {idx < customFolders.length - 1 && (
                <View style={{ height: 0.5, backgroundColor: colors.border, marginLeft: 52 }} />
              )}
            </View>
          ))}
        </View>

        {/* 새 폴더 추가 */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <TouchableOpacity
            style={{
              borderWidth: 1.5,
              borderStyle: "dashed",
              borderColor: colors.border,
              borderRadius: 14,
              paddingVertical: 12,
              alignItems: "center",
            }}
            activeOpacity={0.7}
            testID="add-folder-btn"
          >
            <Text style={{ fontSize: 14, color: colors.textTertiary, fontWeight: "500" }}>
              + 새 폴더 추가
            </Text>
          </TouchableOpacity>
        </View>

        {/* 최근 메모 */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: colors.textTertiary,
              marginBottom: 12,
            }}
          >
            {query.trim() ? "검색 결과" : "최근 메모"}
          </Text>

          {recentNotes.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 32 }}>
              <Text style={{ fontSize: 36 }}>📭</Text>
              <Text style={{ color: colors.textTertiary, fontSize: 14, marginTop: 12 }}>
                {query.trim() ? "검색 결과가 없어요" : "저장된 메모가 없어요"}
              </Text>
            </View>
          ) : (
            recentNotes.map((note) => (
              <NoteCardSmall key={note.id} note={note} />
            ))
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
