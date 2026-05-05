import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY")!;
const MODEL = "anthropic/claude-haiku-4-5";

Deno.serve(async () => {
  const currentHourKST = ((new Date().getUTCHours() + 9) % 24)
    .toString()
    .padStart(2, "0");

  // 현재 시간(KST)에 알림 설정된 유저만 조회
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, user_name, push_token, whip_level")
    .eq("notification_enabled", true)
    .like("notification_time", `${currentHourKST}:%`)
    .not("push_token", "is", null);

  if (error || !profiles?.length) {
    return new Response(JSON.stringify({ sent: 0 }), { status: 200 });
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const messages: object[] = [];

  for (const profile of profiles) {
    const { data: recentNotes } = await supabase
      .from("notes")
      .select("title, created_at, updated_at")
      .eq("user_id", profile.id)
      .gte("created_at", sevenDaysAgo);

    const { data: staleNotes } = await supabase
      .from("notes")
      .select("title, created_at, updated_at")
      .eq("user_id", profile.id)
      .lt("updated_at", sevenDaysAgo);

    const body = await generateMessage(
      profile.user_name,
      profile.whip_level,
      recentNotes ?? [],
      staleNotes ?? []
    );

    if (body) {
      messages.push({ to: profile.push_token, title: "링키 💡", body });
    }
  }

  if (messages.length > 0) {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messages),
    });
  }

  return new Response(JSON.stringify({ sent: messages.length }), { status: 200 });
});

async function generateMessage(
  userName: string,
  whipLevel: string,
  recentNotes: { title: string }[],
  staleNotes: { title: string }[]
): Promise<string | null> {
  const whipDesc = { light: "가볍고 따뜻하게", normal: "적당히 자극적으로", hard: "강하고 직설적으로" };

  const prompt = `크리에이터 "${userName}"의 콘텐츠 활동 현황:
- 최근 7일 새 아이디어: ${recentNotes.length}개${recentNotes.length > 0 ? ` (${recentNotes.slice(0, 3).map((n) => n.title).join(", ")})` : ""}
- 방치된 오래된 아이디어: ${staleNotes.length}개

채찍질 강도: ${whipDesc[whipLevel as keyof typeof whipDesc] ?? "보통"}

이 크리에이터에게 오늘 채찍질이 필요한지 판단해줘.
- 최근 활발히 활동 중(7일 내 3개 이상)이면 "SKIP"
- 채찍질이 필요하면 35자 이내 한국어 푸시 메시지만 출력 (이모지 1개 포함, 다른 말 하지 마)`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://linky.app",
      "X-Title": "Linky",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 80,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  const text: string = data.choices?.[0]?.message?.content?.trim() ?? "";

  if (!text || text.includes("SKIP")) return null;
  return text;
}
