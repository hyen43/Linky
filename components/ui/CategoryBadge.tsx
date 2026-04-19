import React from "react";
import { Text, View } from "react-native";
import type { Category } from "../../types";

interface Props {
  category: Category;
  size?: "sm" | "md";
}

export const CategoryBadge: React.FC<Props> = ({ category, size = "md" }) => {
  const isSmall = size === "sm";
  return (
    <View
      className={`flex-row items-center rounded-full ${
        isSmall ? "px-2 py-0.5" : "px-3 py-1"
      }`}
      style={{ backgroundColor: category.color + "25" }}
      testID={`category-badge-${category.id}`}
    >
      <Text style={{ fontSize: isSmall ? 11 : 13 }}>{category.icon}</Text>
      <Text
        className={`ml-1 font-semibold ${isSmall ? "text-xs" : "text-sm"}`}
        style={{ color: category.color }}
      >
        {category.name}
      </Text>
    </View>
  );
};
