import React, { useState } from "react";
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { CategoryBadge } from "../../components/ui/CategoryBadge";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useChatStore } from "../../store/useChatStore";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const { notes } = useChatStore();
  const { categories, getCategoryById } = useCategoryStore();
  const [filterCategoryId, setFilterCategoryId] = useState<string | "all">("all");

  const filtered = notes.filter((note) => {
    const matchesQuery =
      !query.trim() ||
      note.rawContent.toLowerCase().includes(query.toLowerCase()) ||
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory =
      filterCategoryId === "all" || note.categoryId === filterCategoryId;

    return matchesQuery && matchesCategory;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#060E1F" }} edges={["top"]}>
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderBottomWidth: 0.5,
          borderBottomColor: "#1A3050",
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "800", letterSpacing: -0.8 }}>
          검색
        </Text>
        <Text style={{ color: "#5F8BAE", fontSize: 11, marginTop: 1 }}>
          저장된 아이디어 꺼내기
        </Text>
      </View>

      {/* Search bar */}
      <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#122A45",
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 12,
            gap: 10,
            borderWidth: 1,
            borderColor: query ? "#38BDF840" : "#1A3050",
          }}
        >
          <Ionicons name="search-outline" size={16} color="#5F8BAE" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="키워드, 태그, 제목으로 검색"
            placeholderTextColor="#5F8BAE"
            style={{ flex: 1, color: "white", fontSize: 15 }}
            testID="search-input"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={16} color="#5F8BAE" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12, gap: 6 }}
      >
        <TouchableOpacity
          onPress={() => setFilterCategoryId("all")}
          style={{
            borderRadius: 20,
            paddingHorizontal: 14,
            paddingVertical: 6,
            backgroundColor: filterCategoryId === "all" ? "#38BDF8" : "#122A45",
          }}
          testID="filter-all"
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: filterCategoryId === "all" ? "#060E1F" : "#5F8BAE",
            }}
          >
            전체
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setFilterCategoryId(cat.id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 6,
              backgroundColor: filterCategoryId === cat.id ? "#38BDF8" : "#122A45",
              gap: 4,
            }}
            testID={`filter-${cat.id}`}
          >
            <Text style={{ fontSize: 12 }}>{cat.icon}</Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: filterCategoryId === cat.id ? "#060E1F" : "#5F8BAE",
              }}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      {filtered.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              backgroundColor: "#122A45",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="search-outline" size={28} color="#5F8BAE" />
          </View>
          <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "600" }}>
            {notes.length === 0 ? "저장된 아이디어가 없어요" : "검색 결과가 없어요"}
          </Text>
          <Text style={{ color: "#5F8BAE", fontSize: 13, marginTop: 6 }}>
            {notes.length === 0
              ? "캡처 탭에서 첫 아이디어를 입력해보세요"
              : "다른 키워드로 검색해보세요"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(n) => n.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const cat = getCategoryById(item.categoryId);
            return (
              <View
                style={{
                  marginHorizontal: 16,
                  marginBottom: 10,
                  borderRadius: 16,
                  backgroundColor: "#122A45",
                  padding: 16,
                }}
                testID={`search-result-${item.id}`}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      paddingRight: 12,
                      fontSize: 15,
                      fontWeight: "600",
                      color: "#FFFFFF",
                      letterSpacing: -0.2,
                      lineHeight: 22,
                    }}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  {cat && <CategoryBadge category={cat} size="sm" />}
                </View>
                {item.tags.length > 0 && (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
                    {item.tags.map((tag) => (
                      <Text key={tag} style={{ fontSize: 12, fontWeight: "500", color: "#38BDF8" }}>
                        #{tag}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            );
          }}
          testID="search-results"
        />
      )}
    </SafeAreaView>
  );
}
