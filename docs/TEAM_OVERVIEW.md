# Linky — 팀 공유 문서

> 최종 업데이트: 2026-04-17

---

## 1. 프로젝트 한 줄 소개

> "아이디어를 떠올리기만 해. 나머지는 링키가 다 한다."

**Linky(링키)** 는 콘텐츠 크리에이터(유튜버, 블로거, 인스타그래머, 팟캐스터 등)를 위한 AI 아이디어 인큐베이션 앱입니다.
단 하나의 키워드를 입력하면 AI가 파생 아이디어 3개·SEO 제목 3안·카테고리 자동 분류까지 처리합니다.

---

## 2. 타깃 유저 & 페인포인트

| 대상 | 문제 |
|---|---|
| 유튜버, 블로거, 인스타그래머, 뉴스레터 작가, 팟캐스터 | 아이디어는 넘치는데 → 정리에서 막힘 → 막상 제작할 때 소재가 없음 |

---

## 3. 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | React Native (Expo ~54) |
| 언어 | TypeScript (strict mode) |
| 스타일링 | NativeWind ^4.2.3 (Tailwind CSS for RN) |
| 상태 관리 | Zustand ^5 (설치 완료, store 미구현) |
| 라우팅 | Expo Router ~6 (미마이그레이션) |
| 백엔드 | Supabase (미연동) |
| AI | Claude API — 스트리밍 응답 예정 |
| 테스트 | Jest + jest-expo + @testing-library/react-native |

---

## 4. 핵심 기능 (MLP 범위)

### 4-1. 즉각 캡처
- 앱 오픈 = 바로 입력창 (로딩 없음)
- 텍스트 + 음성 입력 지원
- 카테고리 선택 안 하면 AI가 자동 추천

### 4-2. AI 파생 아이디어 ×3
키워드 1개 입력 → Claude API가 카드 3개 생성

```
📌 맥락   이 아이디어가 통하는 트렌드/배경
🎯 타겟   정확한 독자/시청자
📝 제목   클릭 유도형 예상 제목
```

### 4-3. SEO 제목 공식 ×3
| 공식 | 예시 |
|---|---|
| 숫자+행동+결과 | "30일간 새벽 5시 기상한 직장인의 리얼 변화" |
| 역발상 | "새벽기상 3개월 해봤는데 솔직히 별로였습니다" |
| 타겟 직접 호명 | "자기계발 유튜브 알고리즘 타는 사람들의 공통점" |

### 4-4. 카테고리 시스템
> **Stage(단계) 개념 없음. 모든 분류는 Category 하나로 통일.**

- 앱 시작 시 Default 카테고리 4개 자동 생성

| 이름 | 색상 |
|---|---|
| 💡 초안 | amber (#F59E0B) |
| 📦 보관함 | blue (#3B82F6) |
| 🎬 제작중 | purple (#6C63FF) |
| ✅ 완료 | green (#43E97B) |

- 사용자가 카테고리 추가·이름변경·삭제·순서변경 자유롭게 가능

### 4-5. 미분류 자동 묶음 (AI Auto-Grouping)
1. 카테고리 없는 아이디어가 30일(기본값) 이상 쌓이면 실행
2. pgvector 유사도 클러스터링
3. AI가 클러스터별 카테고리 이름 제안
4. 사용자 수락 / 수정 / 거절

---

## 5. AI 처리 파이프라인

```
사용자 입력 (텍스트/음성)
    + 카테고리 선택 여부 (optional)
         ↓
[Claude API]
         ↓
{
  "suggested_category": "초안",     // 카테고리 미선택 시만
  "content_type": "idea|script|reference|hook",
  "summary": "한 줄 요약 (20자)",
  "tags": ["키워드1", "키워드2"],
  "derived_ideas": [
    { "context": "...", "target": "...", "expected_title": "..." }
    × 3
  ],
  "title_options": [
    { "formula": "숫자+행동+결과", "title": "..." }
    × 3
  ]
}
         ↓
Vector Embedding → pgvector 저장
         ↓
유사 과거 아이디어 서페이싱
```

---

## 6. 앱 탭 구조 (Information Architecture)

```
Linky
├── ✏️ 캡처      ← 채팅 메인 화면 (현재 구현됨)
├── 📋 보드      ← 카테고리별 아이디어 목록 + 칸반
├── 🔍 검색      ← 키워드 + 카테고리 필터
└── ⚙️ 설정     ← 카테고리 관리, 자동 묶음 주기 설정
```

---

## 7. 데이터베이스 스키마 (Supabase v4)

### categories
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid → auth.users | |
| name | text | 카테고리 이름 |
| color | text | hex 색상 |
| icon | text | 이모지 |
| is_default | boolean | 앱 기본 제공 여부 |
| sort_order | int | 표시 순서 |
| created_at | timestamptz | |

### notes
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid → auth.users | |
| raw_content | text | 원본 입력 |
| summary | text | AI 한 줄 요약 |
| content_type | text | idea / script / reference / hook |
| tags | text[] | AI 추출 태그 |
| title | text | 사용자 선택 최종 제목 |
| category_id | uuid → categories (nullable) | null = 미분류 |
| derived_ideas | jsonb | AI 파생 아이디어 3개 |
| title_options | jsonb | SEO 제목 3안 |
| embedding | vector(1536) | pgvector 임베딩 |
| scheduled_at | timestamptz | 발행 예정일 |

### auto_group_logs
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK) | |
| proposed_at | timestamptz | AI 묶음 제안 시각 |
| status | text | pending / accepted / modified / rejected |
| clusters | jsonb | [{name, note_ids[], suggested_category_name}] |

---

## 8. 현재 구현 현황 (Step 1 완료)

### 완료된 것
- [x] `docs/PRD.md`, `docs/RULES.md`, `docs/IDENTITY.md` 문서 작성
- [x] Expo TypeScript 프로젝트 초기화 (blank-typescript template)
- [x] NativeWind 설정 (`tailwind.config.js`, `babel.config.js`, `nativewind-env.d.ts`)
- [x] Jest 테스트 환경 (`jest.config.js`, `jest.setup.ts`)
- [x] 메인 채팅 UI — 다크 테마, 카카오톡 스타일 채팅 버블
- [x] `types/index.ts` — 전체 타입 정의 완성 (Category, Note, AIProcessResult, AutoGroupLog 등)
- [x] 테스트 3개 통과 (헤더, 웰컴 메시지, 마이크/전송 버튼)

### 구현된 컴포넌트
| 파일 | 역할 |
|---|---|
| `App.tsx` | 메인 화면 (채팅 FlatList + InputBar, 목업 AI 응답) |
| `components/chat/ChatBubble.tsx` | 사용자/AI 채팅 버블 |
| `components/chat/IdeaResultCard.tsx` | AI 처리 결과 카드 |
| `components/chat/DerivedIdeaCard.tsx` | 파생 아이디어 카드 |
| `components/chat/TitleOptionsCard.tsx` | SEO 제목 3안 카드 |
| `components/chat/InputBar.tsx` | 텍스트 입력 + 마이크/전송 버튼 |
| `components/chat/TypingIndicator.tsx` | AI 타이핑 인디케이터 |
| `components/memo/MemoCard.tsx` | 메모 카드 |
| `components/ui/CategoryBadge.tsx` | 카테고리 색상 배지 |
| `components/ui/CategoryPicker.tsx` | 카테고리 선택 UI |

---

## 9. 다음 단계 (Step 2)

| 우선순위 | 작업 | 담당 |
|---|---|---|
| 1 | Supabase 연동 (`lib/supabase.ts`) + `.env` 설정 | |
| 2 | Zustand store (`store/useIdeaStore.ts`) | |
| 3 | Claude API 연동 (`lib/claude.ts`) — 스트리밍 응답 | |
| 4 | Expo Router 마이그레이션 (`app/` 구조) | |
| 5 | pgvector 유사 메모 검색 | |

---

## 10. 디자인 토큰

```
Primary:    #6C63FF   보라 — 창의성, 아이디어
Secondary:  #FF6584   핑크 — 에너지, 영감
Accent:     #43E97B   그린 — 성장, 연결
Background: #0F0F1A   딥 네이비 — 집중
Surface:    #1C1C2E   다크 서피스
Surface2:   #252538   카드 배경
TextMuted:  #8B8BA7   보조 텍스트
Border:     #2E2E4A   구분선
```

---

## 11. 주요 컨벤션

- **TypeScript strict mode** — `any` 사용 금지
- **NativeWind className만 사용** — `StyleSheet.create` 금지
- **모든 API 호출은 `lib/`에 래핑** — try/catch 필수
- **Conventional Commits** — `feat:` / `fix:` / `chore:` / `docs:` / `test:`
- **API 키 하드코딩 금지** — `.env` 사용
- **Supabase RLS 필수** 활성화
- 터치 영역 최소 **44×44pt**, 아이콘 버튼에 `accessibilityLabel` 필수

---

## 12. 성공 지표

| 지표 | 목표 |
|---|---|
| 저장 완료까지 | < 5초 |
| AI 파생 아이디어 생성 | < 3초 (스트리밍) |
| D7 재방문율 | > 45% |
| 카테고리 커스터마이징 사용률 | > 50% |
| 자동 묶음 수락률 | > 40% |

---

## 13. 로컬 개발 환경

```bash
# 의존성 설치
npm install

# iOS 시뮬레이터 실행
npx expo start --ios

# Android 에뮬레이터 실행
npx expo start --android

# 테스트 실행
npm test
```

> 루트 경로: `/Users/lina/Desktop/claudeproject/linky`
