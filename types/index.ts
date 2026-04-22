// ─── Category ────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;   // hex e.g. "#6C63FF"
  icon: string;    // emoji e.g. "💡"
  isDefault: boolean;
  sortOrder: number;
  createdAt: Date;
}

/** 앱 시작 시 생성되는 기본 카테고리 4개 */
export const DEFAULT_CATEGORIES: Omit<Category, "id" | "userId" | "createdAt">[] = [
  { name: "초안",   color: "#F59E0B", icon: "💡", isDefault: true, sortOrder: 0 },
  { name: "보관함", color: "#3B82F6", icon: "📦", isDefault: true, sortOrder: 1 },
  { name: "제작중", color: "#6C63FF", icon: "🎬", isDefault: true, sortOrder: 2 },
  { name: "완료",   color: "#43E97B", icon: "✅", isDefault: true, sortOrder: 3 },
];

// ─── AI 처리 결과 ─────────────────────────────────────────────────────────────

export interface DerivedIdea {
  context: string;        // 이 아이디어가 통하는 맥락/트렌드
  target: string;         // 정확한 타겟 독자/시청자
  expectedTitle: string;  // 클릭 유도형 예상 제목
}

export interface TitleOption {
  formula: string;  // "숫자+행동+결과" | "역발상" | "타겟호명"
  title: string;
}

export type ContentType = "idea" | "script" | "reference" | "hook";

export interface AIProcessResult {
  suggestedCategoryName: string; // 카테고리 미선택 시 AI 추천
  contentType: ContentType;
  summary: string;               // 한 줄 요약 (20자 이내)
  tags: string[];
  derivedIdeas: DerivedIdea[];   // 항상 3개
  titleOptions: TitleOption[];   // 항상 3개
}

export interface DrillDownResult {
  openingHook: string;      // 첫 3초 훅
  outline: string[];        // 콘텐츠 구조 3~5단계
  thumbnailConcept: string; // 썸네일 방향
  cta: string;              // 마무리 CTA
}

// ─── Note ────────────────────────────────────────────────────────────────────

export interface Note {
  id: string;
  userId: string;
  rawContent: string;
  summary: string;
  contentType: ContentType;
  tags: string[];
  title: string;            // 사용자가 선택한 최종 제목
  categoryId: string | null; // null = 미분류
  derivedIdeas: DerivedIdea[];
  titleOptions: TitleOption[];
  scheduledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export type MessageRole = "user" | "ai";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}

// ─── Auto-Grouping ────────────────────────────────────────────────────────────

export interface AutoGroupCluster {
  suggestedName: string;
  noteIds: string[];
}

export type AutoGroupStatus = "pending" | "accepted" | "modified" | "rejected";

export interface AutoGroupLog {
  id: string;
  proposedAt: Date;
  status: AutoGroupStatus;
  clusters: AutoGroupCluster[];
}
