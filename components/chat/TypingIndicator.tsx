import React, { useEffect, useRef } from "react";
import { Animated, Platform, View } from "react-native";
import { useAppTheme } from "../../lib/theme";

export const TypingIndicator: React.FC = () => {
  const { colors } = useAppTheme();
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 140),
          Animated.timing(dot, { toValue: -5, duration: 280, useNativeDriver: Platform.OS !== "web" }),
          Animated.timing(dot, { toValue: 0, duration: 280, useNativeDriver: Platform.OS !== "web" }),
          Animated.delay(560),
        ])
      )
    );
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View className="mb-3 flex-row items-end justify-start">
      <View
        className="flex-row items-center rounded-2xl rounded-tl-sm px-4 py-3.5"
        style={{ gap: 5, backgroundColor: colors.surfaceElevated }}
      >
        {dots.map((dot, i) => (
          <Animated.View
            key={i}
            className="h-1.5 w-1.5 rounded-full"
            style={{ transform: [{ translateY: dot }], backgroundColor: colors.textTertiary }}
          />
        ))}
      </View>
    </View>
  );
};
