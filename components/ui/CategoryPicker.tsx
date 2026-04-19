import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useCategoryStore } from "../../store/useCategoryStore";

interface Props {
  selectedId: string | null;
  onSelect: (categoryId: string | null) => void;
}

export const CategoryPicker: React.FC<Props> = ({ selectedId, onSelect }) => {
  const [open, setOpen] = useState(false);
  const { categories, getCategoryById } = useCategoryStore();
  const selected = getCategoryById(selectedId);

  const handleSelect = (id: string | null) => {
    onSelect(id);
    setOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="카테고리 선택"
        className="flex-row items-center rounded-full bg-surface2 px-3 py-1.5"
        style={{ gap: 4 }}
        testID="category-picker-trigger"
      >
        <Text style={{ fontSize: 13 }}>
          {selected ? selected.icon : "📂"}
        </Text>
        <Text className="text-xs font-medium text-white">
          {selected ? selected.name : "카테고리"}
        </Text>
        <Ionicons name="chevron-down" size={12} color="#8B8BA7" />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          className="flex-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onPress={() => setOpen(false)}
        />
        <View className="rounded-t-3xl bg-surface px-4 pb-10 pt-3">
          {/* Handle bar */}
          <View className="mb-4 self-center h-1 w-10 rounded-full bg-border" />

          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-base font-bold text-white">카테고리 선택</Text>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Ionicons name="close" size={20} color="#8B8BA7" />
            </TouchableOpacity>
          </View>

          {/* AI auto option */}
          <TouchableOpacity
            onPress={() => handleSelect(null)}
            className={`mb-2 flex-row items-center rounded-2xl px-4 py-3.5 ${
              selectedId === null ? "bg-primary/20" : "bg-surface2"
            }`}
            style={{ gap: 12 }}
            testID="category-option-auto"
          >
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Text style={{ fontSize: 18 }}>🤖</Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-white">AI 자동 분류</Text>
              <Text className="text-xs text-textMuted">AI가 적합한 카테고리를 추천해요</Text>
            </View>
            {selectedId === null && (
              <Ionicons name="checkmark" size={16} color="#6C63FF" />
            )}
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => handleSelect(cat.id)}
                className={`mb-2 flex-row items-center rounded-2xl px-4 py-3.5 ${
                  selectedId === cat.id ? "bg-primary/20" : "bg-surface2"
                }`}
                style={{ gap: 12 }}
                testID={`category-option-${cat.id}`}
              >
                <View
                  className="h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: cat.color + "25" }}
                >
                  <Text style={{ fontSize: 18 }}>{cat.icon}</Text>
                </View>
                <Text className="flex-1 text-sm font-semibold text-white">{cat.name}</Text>
                {selectedId === cat.id && (
                  <Ionicons name="checkmark" size={16} color="#6C63FF" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};
