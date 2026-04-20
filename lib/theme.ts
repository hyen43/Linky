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
    danger: string;
    dangerSoft: string;
  };
};

const lightTheme: Theme = {
  isDark: false,
  colors: {
    background: "#F8FAFD",
    surface: "#FFFFFF",
    surfaceElevated: "#F1F6FF",
    border: "#DDE7F5",
    text: "#0F172A",
    textSecondary: "#334155",
    textTertiary: "#64748B",
    primary: "#1D4ED8",
    primarySoft: "#DBEAFE",
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
