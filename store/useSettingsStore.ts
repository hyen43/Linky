import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type WhipLevel = "light" | "normal" | "hard";

interface SettingsState {
  userName: string;
  platforms: string[];
  notificationEnabled: boolean;
  notificationTime: string; // "HH:MM" 24h
  whipLevel: WhipLevel;
  setUserName: (name: string) => void;
  setPlatforms: (platforms: string[]) => void;
  setNotificationEnabled: (enabled: boolean) => void;
  setNotificationTime: (time: string) => void;
  setWhipLevel: (level: WhipLevel) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      userName: "크리에이터",
      platforms: ["유튜브"],
      notificationEnabled: true,
      notificationTime: "09:00",
      whipLevel: "normal",
      setUserName: (userName) => set({ userName }),
      setPlatforms: (platforms) => set({ platforms }),
      setNotificationEnabled: (notificationEnabled) => set({ notificationEnabled }),
      setNotificationTime: (notificationTime) => set({ notificationTime }),
      setWhipLevel: (whipLevel) => set({ whipLevel }),
    }),
    {
      name: "settings-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
