import {
  AIProcessResult,
  ContentType,
  DerivedIdea,
  TitleOption,
} from "../types";

/**
 당신은 콘텐츠 크리에이터의 아이디어 1단계 적재를 도와주는 AI 비서입니다.
사용자가 던진 거친 아이디어를 받아서,
나중에 2단계(선별)에서 꺼내 쓸 수 있는 매력적인 아이디어들로 변환해주세요.

다음 JSON만 반환하세요. 다른 텍스트나 마크다운 없이 JSON만 반환하세요:
{
  "originalSummary": "사용자가 던진 원본 아이디어 한 줄 요약 (20자 이내)",
  "ideas": [
    {
      "title": "구체화된 아이디어 제목",
      "type": "유머형 또는 감성형 또는 공감형 또는 정보형 또는 도전형 중 하나",
      "angle": "어떤 관점/각도로 접근하는지 한 줄",
      "whyAttractive": "왜 이 아이디어가 매력적인지 구체적인 이유 한 줄",
      "tags": ["키워드1", "키워드2"]
    }
  ]
}

ideas 생성 규칙:
- 사용자가 메모한 구체적인 디테일(장면, 소재, 반전 포인트 등)을
  아이디어 안에 반드시 녹여야 합니다.
  아이디어를 새로 만드는 게 아니라,
  메모의 핵심 장면이 콘텐츠의 중심에 있어야 합니다.
- 사용자가 생각하지 못한 각도까지 포함해서 다양하게 제안하세요.
- 각 아이디어는 반드시 서로 다른 감정이나 독자층을 공략해야 합니다.
  유머형 / 감성형 / 공감형 / 정보형 / 도전형 중 겹치지 않게 선택하세요.
- title은 아직 발행용 제목이 아니라 내부 메모용으로,
  방향이 명확하게 읽히면 충분합니다.
- whyAttractive는 나중에 선별할 때 판단 근거가 되므로
  구체적인 이유를 적어주세요.
- 플랫폼이 입력된 경우 해당 플랫폼에 맞는 포맷과 길이를 고려해서
  아이디어를 제안하세요.
- 플랫폼이 미정이거나 입력이 없는 경우 플랫폼 무관하게 제안하세요.
- 아이디어는 정확히 3개만 반환하세요.
 */

export async function processIdea(text: string): Promise<AIProcessResult> {
  // Mock: 실제 환경에서는 claude-sonnet-4-6 streaming API로 교체
  await new Promise((r) => setTimeout(r, 1200));
  return buildMockResult(text);
}

// ─── Mock 생성 로직 ───────────────────────────────────────────────────────────

function buildMockResult(text: string): AIProcessResult {
  const keywords = extractKeywords(text);
  const details = extractMemoDetails(text);
  const mainKeyword = keywords[0] ?? details.primary ?? "콘텐츠";

  return {
    suggestedCategoryName: "초안",
    contentType: inferContentType(text),
    summary: buildOriginalSummary(text),
    tags: mergeTags(keywords, details.tags),
    derivedIdeas: buildDerivedIdeasFromMemo({ keyword: mainKeyword, details }),
    titleOptions: buildTitleOptionsFromMemo({ keyword: mainKeyword, details }),
  };
}

function inferContentType(text: string): ContentType {
  if (text.includes("스크립트") || text.includes("대본")) return "script";
  if (text.includes("레퍼런스") || text.includes("참고")) return "reference";
  if (text.includes("훅") || text.includes("제목")) return "hook";
  return "idea";
}

function extractKeywords(text: string): string[] {
  const keywordMap: Record<string, string[]> = {
    브이로그: ["브이로그", "일상", "영상"],
    루틴: ["루틴", "자기계발", "습관"],
    AI: ["AI", "인공지능", "기술"],
    마케팅: ["마케팅", "브랜딩", "광고"],
    레시피: ["레시피", "요리", "푸드"],
    여행: ["여행", "여행기", "장소"],
    리뷰: ["리뷰", "후기", "추천"],
  };
  for (const [key, tags] of Object.entries(keywordMap)) {
    if (text.includes(key)) return tags;
  }
  const words = text
    .replace(/[^\w가-힣\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 1);
  return words.slice(0, 3).length > 0 ? words.slice(0, 3) : ["아이디어"];
}

type IdeaType = "유머형" | "감성형" | "공감형" | "정보형" | "도전형";

function buildOriginalSummary(text: string): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return "빈 메모";
  const slice = normalized.slice(0, 20);
  return slice + (normalized.length > 20 ? "…" : "");
}

function mergeTags(a: string[], b: string[]): string[] {
  const set = new Set<string>();
  for (const t of a) set.add(t);
  for (const t of b) set.add(t);
  return Array.from(set).slice(0, 6);
}

function extractMemoDetails(text: string): {
  primary: string | null;
  scene: string | null;
  twist: string | null;
  tags: string[];
} {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const hashTags = Array.from(text.matchAll(/#([0-9A-Za-z가-힣_]{1,24})/g))
    .map((m) => m[1])
    .filter(Boolean);

  const titleLine =
    lines.find((l) => l.startsWith("제목:"))?.replace(/^제목:\s*/, "").trim() ?? null;
  const memoLine =
    lines.find((l) => l.startsWith("메모:"))?.replace(/^메모:\s*/, "").trim() ?? null;

  const primary = titleLine || (memoLine ? memoLine.split(/\s+/)[0] : null);
  const scene = memoLine ? memoLine.slice(0, 48) : (lines[0] ?? null);
  const twist =
    memoLine && memoLine.includes("근데")
      ? memoLine.split("근데").slice(1).join("근데").trim().slice(0, 40)
      : null;

  return {
    primary: primary && primary.length > 0 ? primary : null,
    scene: scene && scene.length > 0 ? scene : null,
    twist: twist && twist.length > 0 ? twist : null,
    tags: hashTags,
  };
}

function pick3DistinctTypes(seedText: string): [IdeaType, IdeaType, IdeaType] {
  const all: IdeaType[] = ["유머형", "감성형", "공감형", "정보형", "도전형"];
  let hash = 0;
  for (let i = 0; i < seedText.length; i++) hash = (hash * 31 + seedText.charCodeAt(i)) >>> 0;
  const start = hash % all.length;
  return [
    all[start],
    all[(start + 2) % all.length],
    all[(start + 4) % all.length],
  ];
}

function buildDerivedIdeasFromMemo({
  keyword,
  details,
}: {
  keyword: string;
  details: ReturnType<typeof extractMemoDetails>;
}): DerivedIdea[] {
  const scene = details.scene ?? `${keyword} 관련 장면`;
  const twist = details.twist ? `반전: ${details.twist}` : null;
  const [t1, t2, t3] = pick3DistinctTypes(`${keyword}|${scene}|${twist ?? ""}`);

  const toIdea = (type: IdeaType): DerivedIdea => {
    switch (type) {
      case "유머형":
        return {
          context: `사소한 ${keyword} 순간을 웃기게 뒤집는 포맷 (${scene})`,
          target: "짧게 웃고 넘길 콘텐츠를 찾는 사람",
          expectedTitle: twist
            ? `${scene}… 근데 ${details.twist}`
            : `${scene}에서 나만 이러는 거야?`,
        };
      case "감성형":
        return {
          context: `한 장면으로 감정을 끌어올리는 내레이션 중심 (${scene})`,
          target: "잔잔한 몰입/공감형 콘텐츠를 좋아하는 사람",
          expectedTitle: `${scene} 그날, 마음이 조용해졌다`,
        };
      case "공감형":
        return {
          context: `다들 겪는 상황을 정확히 찌르는 공감 포인트 (${scene})`,
          target: "일상 공감 밈/릴스를 즐기는 사람",
          expectedTitle: `${keyword} 할 때 꼭 나오는 그 상황`,
        };
      case "정보형":
        return {
          context: `장면 속 문제를 해결하는 정보/팁으로 전환 (${scene})`,
          target: `${keyword}을(를) 더 잘하고 싶은 입문자`,
          expectedTitle: `${keyword} 초보가 ${scene}에서 바로 쓰는 3가지 팁`,
        };
      case "도전형":
        return {
          context: `짧은 기간 미션으로 참여 유도 (${scene})`,
          target: "챌린지/습관 만들기에 관심 있는 사람",
          expectedTitle: `${keyword} 7일 챌린지: ${scene}부터 바꿔보기`,
        };
    }
  };

  return [toIdea(t1), toIdea(t2), toIdea(t3)];
}

function buildTitleOptionsFromMemo({
  keyword,
  details,
}: {
  keyword: string;
  details: ReturnType<typeof extractMemoDetails>;
}): TitleOption[] {
  const scene = details.scene ?? keyword;
  const hook = details.twist ? `근데 ${details.twist}` : "결과가 의외였다";

  return [
    {
      formula: "숫자+행동+결과",
      title: `${keyword} 7일 해보고 바뀐 것 3가지`,
    },
    {
      formula: "역발상",
      title: `${scene}에서 ${keyword}를 '반대로' 해봤더니…`,
    },
    {
      formula: "타겟호명",
      title: `${keyword} 하다가 ${hook} 경험 있는 사람?`,
    },
  ];
}
