import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useChatStore } from "./useChatStore";
import { useCategoryStore } from "./useCategoryStore";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;

  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, isLoading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },

  signInWithGoogle: async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    useChatStore.setState({
      messages: [],
      notes: [],
      initialized: false,
      pendingNoteId: null,
      drillDownResults: {},
      drillingDownKeys: [],
      isTyping: false,
      isRecording: false,
    });
    useCategoryStore.setState({ categories: [], initialized: false });
    set({ user: null, session: null });
  },
}));
