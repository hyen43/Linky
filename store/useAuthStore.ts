import { create } from "zustand";
import { Platform } from "react-native";
import { Session, User } from "@supabase/supabase-js";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "../lib/supabase";
import { useChatStore } from "./useChatStore";
import { useCategoryStore } from "./useCategoryStore";

WebBrowser.maybeCompleteAuthSession();

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;

  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithKakao: () => Promise<void>;
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
    if (Platform.OS === "web") {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      return;
    }

    const redirectUrl = Linking.createURL("/");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error || !data.url) return;

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

    if (result.type === "success" && result.url) {
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(result.url);
      if (sessionError) console.warn("OAuth session error:", sessionError.message);
    }
  },

  signInWithKakao: async () => {
    if (Platform.OS === "web") {
      await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
          scopes: "profile_nickname profile_image",
          queryParams: { scope: "openid profile_nickname profile_image", prompt: "login" },
        },
      });
      return;
    }

    const redirectUrl = Linking.createURL("/");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
        scopes: "profile_nickname profile_image",
        queryParams: { scope: "openid profile_nickname profile_image", prompt: "login" },
      },
    });

    if (error || !data.url) return;

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

    if (result.type === "success" && result.url) {
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(result.url);
      if (sessionError) console.warn("Kakao OAuth session error:", sessionError.message);
    }
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
      generatingIds: [],
      isTyping: false,
      isRecording: false,
    });
    useCategoryStore.setState({ categories: [], initialized: false });
    set({ user: null, session: null });
  },
}));
