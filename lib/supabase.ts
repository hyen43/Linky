/**
 * Supabase 클라이언트
 * TODO: @supabase/supabase-js 설치 후 실제 연동
 *   npm install @supabase/supabase-js
 *   .env에 EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY 설정
 */

// import { createClient } from "@supabase/supabase-js";
// export const supabase = createClient(
//   process.env.EXPO_PUBLIC_SUPABASE_URL!,
//   process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
// );

/** Mock placeholder — 실제 구현 전 타입만 export */
export const supabase = null as unknown as {
  from: (table: string) => unknown;
  auth: unknown;
};
