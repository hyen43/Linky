import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useChatStore } from "./useChatStore";
import { useCategoryStore } from "./useCategoryStore";

// 로컬 테스트용 목 유저 (Supabase 미설정 시 자동 로그인)
const LOCAL_USER = {
  id: "local-user",
  email: "local@test.com",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString(),
} as User;

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isLocalMode: boolean;

  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isLocalMode: !isSupabaseConfigured,

  initialize: async () => {
    if (!isSupabaseConfigured) {
      // 키 미설정 → 로컬 목 유저로 즉시 로그인
      set({ user: LOCAL_USER, session: null, isLoading: false });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, isLoading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },

  signInWithGoogle: async () => {
    if (!isSupabaseConfigured) {
      set({ user: LOCAL_USER, session: null, isLoading: false });
      return;
    }
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
  },

  signOut: async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
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
