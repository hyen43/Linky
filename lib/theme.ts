import { useColorScheme } from "react-native";

type Theme = {
  isDark: boolean;
  colors: {
    background: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    primary: string;
    primarySoft: string;
    noteBg: string;
    noteBorder: string;
    danger: string;
    dangerSoft: string;
  };
};

const lightTheme: Theme = {
  isDark: false,
  colors: {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceElevated: "#F2F3F5",
    border: "#E5E5E5",
    text: "#111111",
    textSecondary: "#555555",
    textTertiary: "#999999",
    primary: "#1A6DFF",
    primarySoft: "#E8F0FE",
    noteBg: "#F0F6FF",
    noteBorder: "#D0E2FF",
    danger: "#DC2626",
    dangerSoft: "#FEE2E2",
  },
};

const darkTheme: Theme = {
  isDark: true,
  colors: {
    background: "#061225",
    surface: "#0C1D34",
    surfaceElevated: "#122A45",
    border: "#1E3A5B",
    text: "#F8FAFC",
    textSecondary: "#D0DEEF",
    textTertiary: "#8AA4C1",
    primary: "#60A5FA",
    primarySoft: "#1E3A5B",
    noteBg: "#0D2240",
    noteBorder: "#1E3A5B",
    danger: "#FB7185",
    dangerSoft: "#4A2231",
  },
};

export function useAppTheme(): Theme {
  const scheme = useColorScheme();
  // Product default: always start with light theme (white/blue).
  // Dark mode can be re-enabled later through an explicit in-app preference.
  const forceLightAsDefault = true;
  if (forceLightAsDefault) {
    return lightTheme;
  }
  return scheme === "dark" ? darkTheme : lightTheme;
}
