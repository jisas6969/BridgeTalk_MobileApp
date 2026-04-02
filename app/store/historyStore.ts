import { create } from "zustand";

type HistoryItem = {
  id: string;
  input: string;
  output: string;
  type: "camera" | "speech";
  time: string;
};

type State = {
  history: HistoryItem[];
  add: (item: HistoryItem) => void;
  clear: () => void;
};

export const useHistoryStore = create<State>((set) => ({
  history: [],

  add: (item) =>
    set((state) => ({
      history: [item, ...state.history], // newest first
    })),

  clear: () => set({ history: [] }),
}));