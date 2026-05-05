import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { profilesApi } from "./api/profilesApi";

export async function registerPushToken(userId: string): Promise<void> {
  if (Platform.OS === "web") return;

  const { status: existing } = await Notifications.getPermissionsAsync();
  const { status } = existing === "granted"
    ? { status: existing }
    : await Notifications.requestPermissionsAsync();

  if (status !== "granted") return;

  const { data: token } = await Notifications.getExpoPushTokenAsync();
  await profilesApi.upsert({ id: userId, push_token: token });
}
