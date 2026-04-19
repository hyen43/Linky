# Linky (링키) — Product Requirements Document v4

## Vision
> "아이디어를 떠올리기만 해. 나머지는 링키가 다 한다."

콘텐츠 크리에이터의 실제 창작 워크플로우를 AI로 자동화.
단 하나의 키워드를 입력하면, AI가 파생 아이디어·제목 공식·카테고리 관리까지 완성해준다.

---

## Target Users
**1순위**: 유튜버, 블로거, 인스타그래머, 뉴스레터 작가, 팟캐스터
**공통 페인포인트**: 아이디어는 넘치는데 → 정리에서 막힘 → 막상 만들 때 소재가 없음

---

## 카테고리 시스템 (핵심 모델)

### 개념
> **Stage(단계)는 존재하지 않는다. 모든 것은 Category다.**

- 카테고리 = 사용자가 자유롭게 만들고, 이름 짓고, 삭제하는 **유연한 버킷**
- 앱은 시작 시 **Default 카테고리 4개**를 제공 (사용자가 원하면 수정/삭제 가능)
- 사용자는 언제든 카테고리를 **추가·이름변경·삭제·순서변경** 가능
- 아이디어를 저장할 때 카테고리를 직접 선택하거나, AI가 추천

### Default 카테고리 (첫 실행 시 자동 생성)
| 이름 | 색상 | 설명 |
|---|---|---|
| 💡 초안 | 노란색 | 방금 떠오른 아이디어. 아직 다듬지 않음 |
| 📦 보관함 | 파란색 | 나중에 쓸 것. 지금 당장은 아닌 것 |
| 🎬 제작중 | 보라색 | 현재 작업 중인 아이디어 |
| ✅ 완료 | 초록색 | 발행·완성된 콘텐츠 |

### 사용자 커스텀 카테고리 예시
```
💡 초안          (default)
📦 보관함         (default)
🎬 제작중         (default)
✅ 완료           (default)
─────────────────
🎥 유튜브 브이로그  (사용자 추가)
✍️ 블로그 글감      (사용자 추가)
📸 릴스 컨셉       (사용자 추가)
+ 카테고리 추가
```

### 미분류 아이디어 자동 묶음 (AI Auto-Grouping)
Obsidian의 Periodic Notes에서 영감. 카테고리 없이 쌓인 아이디어를 AI가 주기적으로 정리.

**동작 방식:**
1. 카테고리 미지정 아이디어가 **30일(기본값, 사용자 설정 가능)** 이상 누적되면 실행
2. pgvector 유사도 분석으로 의미적으로 가까운 것끼리 클러스터링
3. 클러스터마다 AI가 카테고리 이름 자동 생성 (예: "브이로그 소재 묶음", "자기계발 글감")
4. 사용자에게 제안 노티: "30개의 미분류 아이디어를 3개 그룹으로 묶었어요. 확인해볼까요? 👀"
5. 사용자가 **수락 / 수정 / 거절** 선택

**설정 가능 항목:**
- 주기: 2주 / 1달(기본) / 3달
- 최소 묶음 개수: 미분류 아이디어가 N개 이상일 때만 실행 (기본 10개)

---

## 입력 UX (직접 입력 + AI 자동 분류 통합)

```
┌───────────────────────────────────────────┐
│ 오늘 떠오른 아이디어를 말해보세요           │
│                                           │
│                                           │
├───────────────────────────────────────────┤
│ 🎤  [카테고리 선택 ▾]              ➤      │
└───────────────────────────────────────────┘
```

**두 경로:**
- **AI 자동**: 카테고리 선택 안 함 → AI가 텍스트 분석 후 카테고리 추천 → 저장 후 변경 가능
- **직접 선택**: 카테고리 탭 → 사용자가 선택 → AI는 나머지(파생 아이디어·태그·제목)만 생성

---

## Core Features

### 1. ⚡ 즉각 캡처 — MLP
- 앱 오픈 = 바로 입력창 (로딩 없음)
- 텍스트 + 음성 입력
- 선택적 카테고리 지정 (안 하면 AI가 Default 카테고리 중 추천)

### 2. 🌱 AI 파생 아이디어 ×3 — MLP
키워드 1개 → 파생 카드 3개 자동 생성:
```
📌 맥락   이 아이디어가 통하는 트렌드/배경
🎯 타겟   정확한 독자/시청자
📝 제목   클릭 유도형 예상 제목
```

### 3. 🗂️ 카테고리 관리 — MLP
- Default 4개 카테고리 제공
- `+ 카테고리 추가`: 이름·색상·이모지 설정
- 이름변경 / 삭제 / 순서 드래그
- 아이디어 카드 길게 누르기 → 카테고리 이동

### 4. 🤖 미분류 자동 묶음 — MLP
- 주기적 AI 클러스터링 (기본 30일)
- 카테고리 이름 자동 제안
- 사용자 수락/수정/거절

### 5. 🏷️ 상태 태그 — MLP
```
[💡초안] [#브이로그] [#새벽기상]
```
- AI 추출 키워드 태그
- 카테고리 배지 (색상 자동 반영)

### 6. 🔤 제목 공식 엔진 — MLP
AI가 입력 기반으로 SEO 최적화 제목 3안 생성:
- 숫자+행동+결과 공식
- 역발상 공식
- 타겟 직접 호명 공식

### 7. 🔍 꺼내기 (Retrieve) — MLP
- 카테고리 필터
- 자연어 검색
- 유사 아이디어 자동 묶음 (pgvector)

### 8. 📅 콘텐츠 캘린더 — v1.1
- 업로드 예정일 연결
- 주간 파이프라인 뷰

---

## AI 처리 파이프라인

```
사용자 입력 (텍스트/음성)
    + 카테고리 선택 여부 (optional)
         ↓
[Claude API]
         ↓
{
  "suggested_category": "초안",     // 선택 안 했을 때만
  "content_type": "idea|script|reference|hook",
  "summary": "한 줄 요약 (20자)",
  "tags": ["키워드1", "키워드2"],
  "derived_ideas": [
    { "context": "...", "target": "...", "expected_title": "..." },
    { "context": "...", "target": "...", "expected_title": "..." },
    { "context": "...", "target": "...", "expected_title": "..." }
  ],
  "title_options": [
    { "formula": "숫자+행동+결과", "title": "..." },
    { "formula": "역발상",        "title": "..." },
    { "formula": "타겟호명",      "title": "..." }
  ]
}
         ↓
Vector Embedding → pgvector 저장
         ↓
유사 과거 아이디어 서페이싱
```

---

## Information Architecture

```
Linky
├── ✏️ 캡처      ← 입력 (홈)
├── 📋 보드      ← 카테고리별 아이디어 목록 + 칸반
├── 🔍 검색      ← 키워드 + 카테고리 필터
└── ⚙️ 설정     ← 카테고리 관리, 자동 묶음 주기 설정
```

---

## Supabase Schema (v4)

```sql
-- 카테고리 (Default + 사용자 커스텀 통합)
create table categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  name        text not null,
  color       text not null default '#6C63FF',
  icon        text not null default '💡',
  is_default  boolean default false,   -- 앱 제공 기본값 여부
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- 아이디어 노트
create table notes (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users not null,

  raw_content    text not null,
  summary        text,
  content_type   text,                     -- idea|script|reference|hook
  tags           text[],
  title          text,

  category_id    uuid references categories(id) on delete set null,
                                           -- null = 미분류

  derived_ideas  jsonb,   -- [{context, target, expected_title} ×3]
  title_options  jsonb,   -- [{formula, title} ×3]

  embedding      vector(1536),
  scheduled_at   timestamptz,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- 자동 묶음 이력
create table auto_group_logs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users not null,
  proposed_at  timestamptz default now(),
  status       text default 'pending',     -- pending|accepted|modified|rejected
  clusters     jsonb                        -- [{name, note_ids[], suggested_category_name}]
);

-- 인덱스
create index on notes using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index on notes (user_id, category_id);
create index on notes (user_id, created_at desc);
create index on notes (user_id, category_id) where category_id is null; -- 미분류 빠른 조회
```

---

## Success Metrics
| 지표 | 목표 |
|---|---|
| 저장 완료까지 | < 5초 |
| AI 파생 아이디어 생성 | < 3초 (스트리밍) |
| D7 재방문율 | > 45% |
| 카테고리 커스터마이징 사용률 | > 50% |
| 자동 묶음 수락률 | > 40% |
