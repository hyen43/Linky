import { AIProcessResult, ContentType, DerivedIdea, TitleOption } from "../types";

/**
 * 아이디어 텍스트를 AI로 처리합니다.
 * TODO: 실제 Claude API 연동 (ANTHROPIC_API_KEY 설정 후 교체)
 *
 * 실제 구현 시 사용할 System Prompt:
 * ─────────────────────────────────────────────────────────────
 * 당신은 콘텐츠 크리에이터의 아이디어 관리 AI 비서입니다.
 * 사용자의 아이디어를 분석하고 다음 JSON을 반환하세요:
 * {
 *   "suggestedCategoryName": "초안|보관함|제작중|완료 중 하나",
 *   "contentType": "idea|script|reference|hook",
 *   "summary": "한 줄 요약 (20자 이내)",
 *   "tags": ["키워드1", "키워드2", "키워드3"],
 *   "derivedIdeas": [
 *     { "context": "...", "target": "...", "expectedTitle": "..." },
 *     { "context": "...", "target": "...", "expectedTitle": "..." },
 *     { "context": "...", "target": "...", "expectedTitle": "..." }
 *   ],
 *   "titleOptions": [
 *     { "formula": "숫자+행동+결과", "title": "..." },
 *     { "formula": "역발상",        "title": "..." },
 *     { "formula": "타겟호명",      "title": "..." }
 *   ]
 * }
 */
export async function processIdea(text: string): Promise<AIProcessResult> {
  // Mock: 실제 환경에서는 claude-sonnet-4-6 streaming API로 교체
  await new Promise((r) => setTimeout(r, 1200));
  return buildMockResult(text);
}

// ─── Mock 생성 로직 ───────────────────────────────────────────────────────────

function buildMockResult(text: string): AIProcessResult {
  const keywords = extractKeywords(text);
  const mainKeyword = keywords[0] ?? "콘텐츠";

  return {
    suggestedCategoryName: "초안",
    contentType: inferContentType(text),
    summary: text.slice(0, 20) + (text.length > 20 ? "…" : ""),
    tags: keywords,
    derivedIdeas: buildDerivedIdeas(mainKeyword),
    titleOptions: buildTitleOptions(mainKeyword),
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
  const words = text.replace(/[^\w가-힣\s]/g, "").split(/\s+/).filter((w) => w.length > 1);
  return words.slice(0, 3).length > 0 ? words.slice(0, 3) : ["아이디어"];
}

function buildDerivedIdeas(keyword: string): DerivedIdea[] {
  return [
    {
      context: `${keyword} 관련 트렌드가 최근 급상승 중`,
      target: "해당 분야에 관심 있는 20-30대",
      expectedTitle: `${keyword}로 시작하는 가장 쉬운 방법`,
    },
    {
      context: `기존 ${keyword} 콘텐츠의 공통된 한계점 존재`,
      target: "이미 시도해봤지만 실패한 경험이 있는 사람",
      expectedTitle: `${keyword} 3개월 해봤는데 솔직히 말할게요`,
    },
    {
      context: `${keyword} 초보자를 위한 가이드 콘텐츠 수요 높음`,
      target: "${keyword}을 처음 시작하려는 입문자",
      expectedTitle: `${keyword} 완전 처음인데 이것부터 시작하세요`,
    },
  ];
}

function buildTitleOptions(keyword: string): TitleOption[] {
  return [
    {
      formula: "숫자+행동+결과",
      title: `${keyword} 30일 도전한 결과 솔직하게 공개합니다`,
    },
    {
      formula: "역발상",
      title: `${keyword} 하지 말라고? 해봤더니 이렇게 됐습니다`,
    },
    {
      formula: "타겟호명",
      title: `${keyword} 관심 있다면 이 영상 꼭 보세요`,
    },
  ];
}
