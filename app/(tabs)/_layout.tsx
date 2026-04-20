import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../lib/theme";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export default function TabsLayout() {
  const theme = useAppTheme();
  const { colors } = theme;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "캡처",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={(focused ? "create" : "create-outline") as IoniconName}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="board"
        options={{
          title: "보드",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={(focused ? "grid" : "grid-outline") as IoniconName}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "설정",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={(focused ? "settings" : "settings-outline") as IoniconName}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
