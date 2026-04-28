import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const isSupabaseConfigured =
  SUPABASE_URL.startsWith("https://") && SUPABASE_KEY.length > 10;

// ─── 로컬 모드용 No-op stub ───────────────────────────────────────────────────
// Supabase 키 없이 테스트할 때 호출되는 모든 DB/Auth 메서드를 조용히 무시합니다.

class NoopQuery {
  from(_t: string): this { return this; }
  select(_c: string): this { return this; }
  insert(_d: unknown): this { return this; }
  update(_d: unknown): this { return this; }
  delete(): this { return this; }
  eq(_c: string, _v: unknown): this { return this; }
  order(_c: string, _o?: unknown): this { return this; }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  then(resolve: (v: { data: never[]; error: null }) => any, reject?: any): any {
    return Promise.resolve({ data: [] as never[], error: null }).then(resolve, reject);
  }
}

const noopQuery = new NoopQuery();

const noopSupabase = {
  from: (_t: string) => noopQuery,
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithOAuth: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: (_cb: unknown) => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
  },
} as unknown as ReturnType<typeof createClient>;

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : noopSupabase;
