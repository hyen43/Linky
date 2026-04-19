import React, { useState } from "react";
import {
  Alert,
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

const PRESET_COLORS = [
  "#38BDF8", "#F59E0B", "#3B82F6", "#34D399",
  "#FF6584", "#EC4899", "#F97316", "#A78BFA",
];
const PRESET_ICONS = ["💡", "📦", "🎬", "✅", "📝", "🎯", "🔖", "🌟", "🚀", "📌"];

function SectionHeader({ title }: { title: string }) {
  return (
    <Text
      style={{
        color: "#5F8BAE",
        fontSize: 11,
        fontWeight: "600",
        letterSpacing: 0.8,
        textTransform: "uppercase",
        marginBottom: 10,
        marginTop: 24,
      }}
    >
      {title}
    </Text>
  );
}

export default function SettingsScreen() {
  const { categories, addCategory, deleteCategory } = useCategoryStore();
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [newIcon, setNewIcon] = useState(PRESET_ICONS[0]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addCategory({ name: newName.trim(), color: newColor, icon: newIcon });
    setNewName("");
    setAdding(false);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      "카테고리 삭제",
      `'${name}' 카테고리를 삭제할까요?\n해당 카테고리의 아이디어는 미분류로 이동해요.`,
      [
        { text: "취소", style: "cancel" },
        { text: "삭제", style: "destructive", onPress: () => deleteCategory(id) },
      ]
    );
  };

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
          설정
        </Text>
        <Text style={{ color: "#5F8BAE", fontSize: 11, marginTop: 1 }}>
          카테고리 및 환경 설정
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="카테고리" />

        {categories.map((cat) => (
          <View
            key={cat.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#122A45",
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 14,
              marginBottom: 8,
            }}
            testID={`settings-cat-${cat.id}`}
          >
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: cat.color + "25",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 18 }}>{cat.icon}</Text>
            </View>

            <Text style={{ flex: 1, color: "#FFFFFF", fontSize: 14, fontWeight: "600" }}>
              {cat.name}
            </Text>

            {cat.isDefault ? (
              <View
                style={{
                  backgroundColor: "#1C3A5E",
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ color: "#5F8BAE", fontSize: 11 }}>기본</Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => handleDelete(cat.id, cat.name)}
                accessibilityLabel={`${cat.name} 삭제`}
                style={{
                  backgroundColor: "#FF658420",
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text style={{ color: "#FF6584", fontSize: 12, fontWeight: "600" }}>삭제</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Add category */}
        {adding ? (
          <View
            style={{
              marginTop: 8,
              backgroundColor: "#122A45",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700", marginBottom: 14 }}>
              새 카테고리
            </Text>

            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="카테고리 이름"
              placeholderTextColor="#5F8BAE"
              style={{
                backgroundColor: "#0C1D34",
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                color: "#FFFFFF",
                fontSize: 14,
                marginBottom: 14,
              }}
              testID="new-category-input"
              autoFocus
            />

            <Text style={{ color: "#5F8BAE", fontSize: 11, fontWeight: "600", marginBottom: 8 }}>
              색상
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              {PRESET_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setNewColor(c)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: c,
                    borderWidth: newColor === c ? 2.5 : 0,
                    borderColor: "white",
                  }}
                />
              ))}
            </View>

            <Text style={{ color: "#5F8BAE", fontSize: 11, fontWeight: "600", marginBottom: 8 }}>
              아이콘
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
              {PRESET_ICONS.map((ic) => (
                <TouchableOpacity
                  key={ic}
                  onPress={() => setNewIcon(ic)}
                  style={{
                    width: 40,
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 12,
                    backgroundColor: newIcon === ic ? "#38BDF830" : "#0C1D34",
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{ic}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                onPress={() => setAdding(false)}
                style={{
                  flex: 1,
                  alignItems: "center",
                  borderRadius: 12,
                  backgroundColor: "#0C1D34",
                  paddingVertical: 12,
                }}
              >
                <Text style={{ color: "#5F8BAE", fontSize: 14, fontWeight: "600" }}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAdd}
                disabled={!newName.trim()}
                style={{
                  flex: 1,
                  alignItems: "center",
                  borderRadius: 12,
                  backgroundColor: newName.trim() ? "#38BDF8" : "#0C1D34",
                  paddingVertical: 12,
                }}
                testID="add-category-confirm"
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: newName.trim() ? "#060E1F" : "#5F8BAE",
                  }}
                >
                  추가
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setAdding(true)}
            style={{
              marginTop: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              borderWidth: 1,
              borderStyle: "dashed",
              borderColor: "#1A3050",
              paddingVertical: 16,
              gap: 6,
            }}
            testID="add-category-btn"
          >
            <Ionicons name="add-circle-outline" size={16} color="#38BDF8" />
            <Text style={{ color: "#38BDF8", fontSize: 14, fontWeight: "600" }}>
              카테고리 추가
            </Text>
          </TouchableOpacity>
        )}

        {/* Auto grouping section */}
        <SectionHeader title="미분류 자동 묶음" />
        <View style={{ backgroundColor: "#122A45", borderRadius: 16, padding: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Text style={{ fontSize: 18 }}>🤖</Text>
            <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "600", flex: 1 }}>
              AI 자동 분류
            </Text>
            <View
              style={{
                backgroundColor: "#1C3A5E",
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 3,
              }}
            >
              <Text style={{ color: "#5F8BAE", fontSize: 11 }}>30일마다</Text>
            </View>
          </View>
          <Text style={{ color: "#5F8BAE", fontSize: 12, lineHeight: 18 }}>
            미분류 아이디어가 10개 이상 쌓이면 AI가 유사한 아이디어를 묶어 카테고리를 제안해요.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
