import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsState = {
  volume: number;
  speed: number;

  setVolume: (v: number) => void;
  setSpeed: (s: number) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      volume: 75,
      speed: 1,

      setVolume: (v) => set({ volume: v }),
      setSpeed: (s) => set({ speed: s }),
    }),
    {
      name: "app-settings",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);