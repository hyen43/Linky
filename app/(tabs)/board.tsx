import React, { useRef, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useChatStore } from "../../store/useChatStore";
import type { Note } from "../../types";
import { useAppTheme } from "../../lib/theme";

function NoteCard({
  note,
  colors,
}: {
  note: Note;
  colors: ReturnType<typeof useAppTheme>["colors"];
}) {
  const { getCategoryById } = useCategoryStore();
  const category = getCategoryById(note.categoryId);

  return (
    <View
      className="mb-3 flex-row overflow-hidden rounded-2xl"
      style={{ backgroundColor: colors.surface }}
      testID={`note-card-${note.id}`}
    >
      <View
        className="w-[3px]"
        style={{ backgroundColor: category?.color ?? "#38BDF8" }}
      />
      <View className="flex-1 p-4">
        <View className="mb-2 flex-row items-start justify-between">
          <Text
            className="flex-1 pr-3 text-[15px] font-semibold leading-[22px]"
            style={{ color: colors.text, letterSpacing: -0.2 }}
            numberOfLines={2}
          >
            {note.title}
          </Text>
          <Text
            className="mt-0.5 text-xs"
            style={{ color: colors.textTertiary }}
          >
            {note.createdAt.toLocaleDateString("ko-KR", {
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
        {note.tags.length > 0 && (
          <View className="flex-row flex-wrap" style={{ gap: 5 }}>
            {note.tags.map((tag) => (
              <View
                key={tag}
                className="rounded-full px-2.5 py-0.5"
                style={{ backgroundColor: colors.primarySoft }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: colors.primary }}
                >
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

function SearchResultCard({
  note,
  colors,
}: {
  note: Note;
  colors: ReturnType<typeof useAppTheme>["colors"];
}) {
  const { getCategoryById } = useCategoryStore();
  const cat = getCategoryById(note.categoryId);

  return (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 14,
        backgroundColor: colors.surface,
        padding: 14,
        borderWidth: 0.5,
        borderColor: colors.border,
      }}
      testID={`search-result-${note.id}`}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <Text
          style={{
            flex: 1,
            paddingRight: 10,
            fontSize: 14,
            fontWeight: "600",
            color: colors.text,
            letterSpacing: -0.2,
            lineHeight: 20,
          }}
          numberOfLines={2}
        >
          {note.title}
        </Text>
        {cat && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: colors.surfaceElevated,
              borderRadius: 10,
              paddingHorizontal: 7,
              paddingVertical: 3,
            }}
          >
            <Text style={{ fontSize: 10 }}>{cat.icon}</Text>
            <Text
              style={{
                fontSize: 10,
                fontWeight: "600",
                color: colors.textTertiary,
              }}
            >
              {cat.name}
            </Text>
          </View>
        )}
      </View>
      {note.tags.length > 0 && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
          {note.tags.map((tag) => (
            <Text
              key={tag}
              style={{ fontSize: 11, fontWeight: "500", color: colors.primary }}
            >
              #{tag}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

export default function BoardScreen() {
  const theme = useAppTheme();
  const { colors, isDark } = theme;
  const { categories } = useCategoryStore();
  const { notes } = useChatStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    categories[0]?.id ?? null,
  );
  const [searchActive, setSearchActive] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<TextInput>(null);

  const uncategorized = notes.filter((n) => n.categoryId === null);

  const categoryFiltered =
    selectedCategoryId === "__uncategorized__"
      ? uncategorized
      : notes.filter((n) => n.categoryId === selectedCategoryId);

  const searchFiltered = query.trim()
    ? notes.filter((n) => {
        const q = query.toLowerCase();
        return (
          n.rawContent.toLowerCase().includes(q) ||
          n.title.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
    : notes;

  const displayNotes = searchActive ? searchFiltered : categoryFiltered;

  const selectedCategory =
    selectedCategoryId === "__uncategorized__"
      ? null
      : categories.find((c) => c.id === selectedCategoryId);

  function openSearch() {
    setSearchActive(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  }

  function closeSearch() {
    setSearchActive(false);
    setQuery("");
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: 10,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border,
        }}
      >
        {searchActive ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.surface,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 9,
                gap: 8,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Ionicons
                name="search-outline"
                size={15}
                color={colors.textTertiary}
              />
              <TextInput
                ref={searchInputRef}
                value={query}
                onChangeText={setQuery}
                placeholder="키워드, 태그, 제목으로 검색"
                placeholderTextColor={colors.textTertiary}
                style={{ flex: 1, color: colors.text, fontSize: 14 }}
                testID="search-input"
                returnKeyType="search"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery("")}>
                  <Ionicons
                    name="close-circle"
                    size={15}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={closeSearch} activeOpacity={0.7}>
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                취소
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
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
                보드
              </Text>
              <Text
                style={{
                  color: colors.textTertiary,
                  fontSize: 11,
                  marginTop: 1,
                }}
              >
                카테고리별 아이디어
              </Text>
            </View>
            <TouchableOpacity
              onPress={openSearch}
              activeOpacity={0.75}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: colors.surface,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.border,
              }}
              testID="search-toggle"
            >
              <Ionicons
                name="search-outline"
                size={17}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Category chips — hidden during search */}
      {!searchActive && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: colors.border,
            height: 46,
            flexGrow: 0,
          }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 0,
            paddingBottom: 0,
            gap: 8,
            alignItems: "center",
          }}
          testID="category-tabs"
        >
          {categories.map((cat) => {
            const count = notes.filter((n) => n.categoryId === cat.id).length;
            const isActive = selectedCategoryId === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategoryId(cat.id)}
                activeOpacity={0.75}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 17,
                  paddingHorizontal: 14,
                  height: 34,
                  backgroundColor: isActive ? colors.primary : colors.surfaceElevated,
                  borderWidth: 1,
                  borderColor: isActive ? colors.primary : colors.border,
                  gap: 4,
                }}
                testID={`category-tab-${cat.id}`}
              >
                <Text style={{ fontSize: 11, lineHeight: 16 }}>{cat.icon}</Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: isActive ? colors.surface : colors.textSecondary,
                    lineHeight: 17,
                  }}
                >
                  {cat.name}
                </Text>
                {count > 0 && (
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "700",
                      color: isActive ? colors.surface : colors.textTertiary,
                      lineHeight: 17,
                    }}
                  >
                    {count}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}

          {uncategorized.length > 0 && (
            <TouchableOpacity
              onPress={() => setSelectedCategoryId("__uncategorized__")}
              activeOpacity={0.75}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 17,
                paddingHorizontal: 14,
                height: 34,
                backgroundColor:
                  selectedCategoryId === "__uncategorized__"
                    ? colors.primary
                    : colors.surfaceElevated,
                borderWidth: 1,
                borderColor:
                  selectedCategoryId === "__uncategorized__"
                    ? colors.primary
                    : colors.border,
                gap: 4,
              }}
              testID="category-tab-uncategorized"
            >
              <Text style={{ fontSize: 11, lineHeight: 16 }}>📥</Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color:
                    selectedCategoryId === "__uncategorized__"
                      ? colors.surface
                      : colors.textSecondary,
                  lineHeight: 16,
                }}
              >
                미분류
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      {/* Search hint when active and no query */}
      {searchActive && !query.trim() && (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons
            name="search-outline"
            size={36}
            color={colors.textTertiary}
          />
          <Text
            style={{ color: colors.textTertiary, fontSize: 14, marginTop: 12 }}
          >
            제목, 내용, 태그로 검색하세요
          </Text>
        </View>
      )}

      {/* Notes list */}
      {(!searchActive || query.trim()) &&
        (displayNotes.length === 0 ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ fontSize: 40 }}>
              {searchActive ? "🔍" : (selectedCategory?.icon ?? "📥")}
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 15,
                fontWeight: "600",
                marginTop: 14,
              }}
            >
              {searchActive
                ? "검색 결과가 없어요"
                : selectedCategory
                  ? `${selectedCategory.name}에 아이디어가 없어요`
                  : "미분류 아이디어가 없어요"}
            </Text>
            <Text
              style={{ color: colors.textTertiary, fontSize: 13, marginTop: 6 }}
            >
              {searchActive
                ? "다른 키워드로 검색해보세요"
                : "캡처 탭에서 아이디어를 입력해보세요"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={displayNotes}
            keyExtractor={(n) => n.id}
            renderItem={({ item }) =>
              searchActive ? (
                <SearchResultCard note={item} colors={colors} />
              ) : (
                <NoteCard note={item} colors={colors} />
              )
            }
            contentContainerStyle={
              searchActive
                ? { paddingTop: 12, paddingBottom: 16 }
                : { paddingHorizontal: 16, paddingTop: 0, paddingBottom: 16 }
            }
            showsVerticalScrollIndicator={false}
            testID="note-list"
          />
        ))}
    </SafeAreaView>
  );
}
