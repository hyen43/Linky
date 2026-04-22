# Linky (링키) — Product Requirements Document v1.0

> **"아이디어를 떠올리기만 해. 나머지는 링키가 다 한다."**

`v1.0` · `2026.04.22`

---

## 1. 프로젝트 개요

### 1.1 한 줄 소개

Linky(링키)는 전세계 콘텐츠 크리에이터(유튜버, 블로거, 인스타그래머, 팟캐스터 등)를 위한 **AI 아이디어 인큐베이션 노트앱**입니다. 아이디어의 발상부터 콘텐츠 완성까지, 전체 제작 파이프라인을 AI가 함께 관리합니다.

### 1.2 비전 & 미션

- **Vision:** 모든 콘텐츠 크리에이터가 아이디어를 헛되이 버리지 않는 세상을 만든다.
- **Mission:** 채팅처럼 가볍게 적고, AI가 구조화하고, 실행까지 독려하는 아이디어 매니저.

### 1.3 핵심 가치 제안 (Value Proposition)

| 가치 | 설명 |
| --- | --- |
| **Zero Friction Capture** | 채팅처럼 자연스럽게 입력, AI가 자동 구조화 |
| **AI Incubation** | 제목 + 맥락만 입력하면 예상 타겟 및 제목 추천 |
| **Accountability System** | 진행률 기반 채찍질 알림으로 실행력 강화 |

---

## 2. 타깃 유저 & 페인포인트

### 2.1 타깃 유저

콘텐츠 크리에이터 — 유튜버, 블로거, 인스타그래머, 뉴스레터 작가, 팟캐스터

### 2.2 페인포인트 분석

| 단계 | 문제 | Linky 해결책 |
| --- | --- | --- |
| **발상** | 아이디어는 넘치지만 메모 앱을 열고 정리하기 귀찮음 | 채팅 UI로 바로 입력, AI 자동 구조화 |
| **정리** | 제목/본문/태그 분류하는 과정이 번거로움 | 퀵 모드(AI 자동) + 노트 모드(Bottomsheet 직접 입력) |
| **기획** | 타겟이 누구인지, 어떤 제목이 좋을지 고민 | AI가 예상 타겟 및 제목 3개 추천 |
| **실행** | 초안만 쌓이고 실제 제작으로 이어지지 않음 | 7일 진행률 분석 + 채찍질 알림 |

### 2.3 유저 페르소나

> **김창작 (28세, 유튜버 구독자 1.2만)**
>
> "매일 영상 아이디어가 3개씩 떠오르는데, 카카오톡 저장 메모에 쌓아두다가 결국 다 잊어버려요. 정리하려고 앉으면 막막하고, 그냥 찍기 시작하면 소재가 없는 것 같고..."

---

## 3. 핵심 기능 & 화면 상세

### 3.1 탭 구조

**3탭 구조:** 노트(채팅) / 탐색(폴더) / 마이(통계)

### 3.2 노트 탭 (메인 화면)

채팅 UI 기반의 아이디어 입력 화면.

**입력 모드 — Flow A: 퀵 모드**
- 하단 입력창에 한 줄로 자유롭게 입력
- 전송 → AI가 자동으로 제목/요약/태그/파생 아이디어 구조화
- AI 구조화 카드로 결과 미리보기 → 저장 or 수정

**입력 모드 — Flow B: 노트 모드**
- 입력창 우측 "노트 모드" 버튼 탭
- Bottomsheet 열림: 제목 / 본문 / 태그 / 폴더 직접 입력
- "저장하기" 버튼으로 즉시 저장 (AI 처리 없음)

### 3.3 탐색 탭

#### 폴더 구조

- **기본 폴더 3개:** 초안 / 제작중 / 완료 (수정/삭제 가능)
- **커스텀 폴더:** 사용자가 자유롭게 추가 (예: 유튜브 쇼츠, 블로그 포스트)
- **검색 기능:** 상단 검색바로 메모 제목·내용·태그 검색

#### 폴더 상세 화면

폴더를 탭하면 폴더 상세 화면으로 **push 네비게이션**됩니다.

- **필터 칩:** 전체 / 최신순 / 태그별로 메모 필터링
- **메모 카드:** 제목, 미리보기(2줄 말줄임), 태그, 날짜, AI 분석 완료 여부
- **FAB(플로팅 버튼):** 폴더 상세에서 바로 새 메모 작성 가능
- **Empty State:** 빈 폴더일 때 동기부여 카피 표시

### 3.4 마이페이지

#### 통계 대시보드

초안, 제작중, 완료 각각의 메모 개수를 **3칸 그리드**로 표시.

#### 채찍질 시스템 (7일 진행률 리포트)

7일 동안의 진행 전환율을 **블루 그라디언트 카드**로 시각화:
- 초안 → 제작중 전환율
- 제작중 → 완료 전환율
- AI 코치 메시지 (진행 상태에 따라 동적 생성)

---

## 4. 내비게이션 구조

### 4.1 탭 구성

| 탭 | 역할 | 주요 화면 |
| --- | --- | --- |
| **노트** | 아이디어 입력/채팅 | 채팅 피드 / AI 구조화 카드 / NoteCard |
| **탐색** | 폴더·검색 | 폴더 목록 / 폴더 상세 / 검색 |
| **마이** | 통계, 진행률 리포트 | 프로필 / 채찍질 카드 / 설정 |

### 4.2 화면 플로우

```
메인(채팅) → 입력 → AI 구조화 응답 → 저장 → 메모 상세
탐색 → 폴더 선택 → 폴더 상세(push) → 메모 탭 → 메모 상세
마이페이지 → 진행률 확인 → 알림 설정
```

---

## 5. 디자인 시스템

### 5.1 디자인 원칙

| 원칙 | 설명 |
| --- | --- |
| **깨끗하고 심플** | 화이트 베이스에 블루 포인트 컬러 (필라이즈 레퍼런스) |
| **Zero Friction** | 입력까지 최소 탭수. 한 화면에서 입력부터 저장까지 완결 |
| **Familiar UX** | 카카오톡/인스타 DM 같은 채팅 UI + 아이폰 메모앱 같은 구조화 |
| **Dual Mode** | 퀵 모드(빠른 캡처) + 노트 모드(정밀 입력) 선택권 제공 |

### 5.2 컬러 시스템

| 용도 | Light Mode | Dark Mode |
| --- | --- | --- |
| **Primary (Blue)** | `#1A6DFF` | `#1A6DFF` |
| **Background** | `#FFFFFF` | `#061225` |
| **Surface** | `#FFFFFF` | `#0C1D34` |
| **Surface Elevated** | `#F2F3F5` | `#122A45` |
| **Border** | `#E5E5E5` | `#1E3A5B` |
| **Text** | `#111111` | `#F8FAFC` |
| **Text Secondary** | `#555555` | `#D0DEEF` |
| **Text Tertiary** | `#999999` | `#8AA4C1` |
| **Primary Soft** | `#E8F0FE` | `#1E3A5B` |
| **Note Bg** | `#F0F6FF` | `#0D2240` |
| **Note Border** | `#D0E2FF` | `#1E3A5B` |

### 5.3 컴포넌트 스타일

| 컴포넌트 | 사양 |
| --- | --- |
| **Chat Bubble** | border-radius 18px, bottom-right 4px(user) / bottom-left 4px(AI) |
| **Note Card** | border-radius 16px, 0.5px border, padding 14–16px |
| **Tag Chip** | border-radius 12px, padding 3px 10px, font-size 12px |
| **Input Field** | border-radius 20px, height 38px, bg `#F7F7F8` |
| **Bottom Tab Bar** | height 83px, 3탭(노트/탐색/마이), icon 24px + label 10px |
| **FAB** | 52px 원형, Blue background, 우하단 고정, shadow 포함 |
| **Bottomsheet** | top border-radius 20px, handle bar 36×4px, 필드간 간격 16px |
| **Status Badge** | border-radius 10px, font-size 11px, semi-bold |

---

## 6. 화면 목록 (Screen Inventory)

| No. | 화면명 | 설명 | 상태 |
| --- | --- | --- | --- |
| 1 | **메인 (채팅노트)** | 채팅 UI 기반 아이디어 입력, 노트 버블, 폴더 셀렉터, 하단 탭바 | ✅ 구현 |
| 2 | **메모 상세** | 메모 내용 + AI 예상 타겟 칩 + AI 추천 제목 3개(선택 버튼) + 삭제 | ✅ 구현 |
| 3 | **탐색 (폴더 목록)** | 기본/커스텀 폴더 목록 + 검색바 + 최근 메모 | ✅ 구현 |
| 4 | **폴더 상세** | 폴더 내 메모 목록 + 필터 칩 + FAB + Empty State | ✅ 구현 |
| 5 | **마이페이지** | 프로필 + 통계 3칸 + 채찍질 리포트 + 설정 | ✅ 구현 |
| 6A | **퀵모드 - 입력** | 채팅 입력 상태 + 노트모드 토글 버튼 + 폴더 셀렉터 | ✅ 구현 |
| 6B | **퀵모드 - AI응답** | 유저 버블 + AI 구조화 응답 + 노트 카드(저장/수정 버튼) | ✅ 구현 |
| 7A | **노트모드 - 토글** | 노트 모드 활성화 상태 (블루 필드 토글) | ✅ 구현 |
| 7B | **노트모드 - Bottomsheet** | 제목/본문/태그/폴더 구조화 입력 폼 + 저장하기 버튼 | ✅ 구현 |

---

## 7. 기술 스택 & 레퍼런스

### 7.1 플랫폼

모바일 앱 (iOS / Android) — Expo + React Native + TypeScript

### 7.2 기술 스택

| 분류 | 기술 |
| --- | --- |
| **프레임워크** | Expo ~54, React 19, React Native 0.81 |
| **스타일** | NativeWind ^4.2.3 (Tailwind CSS for RN) |
| **상태관리** | Zustand |
| **내비게이션** | Expo Router (파일 기반) |
| **AI** | Claude API (claude-sonnet-4-6) |
| **백엔드** | Supabase (인증 + DB + pgvector) — 미연동 |
| **테스트** | Jest + jest-expo + @testing-library/react-native |

### 7.3 레퍼런스 앱

| 레퍼런스 | 참고 요소 |
| --- | --- |
| **아이폰 내장 메모앱** | 타이틀 + 본문 구조, 폴더 구조, 검색 UX |
| **Evernote** | 태그 시스템, 노트북 구조 |
| **필라이즈 (Pillyze)** | 화이트 베이스 + 포인트 컬러, 통계 카드 디자인 |
| **카카오톡 / 인스타 DM** | 채팅 UI 입력 방식, 버블 스타일 |

### 7.4 AI 기능 요구사항

| AI 기능 | 입력 | 출력 |
| --- | --- | --- |
| **아이디어 구조화** | 자유 텍스트 | summary, contentType, tags |
| **파생 아이디어 ×3** | 텍스트 | context + target + expectedTitle |
| **제목 공식 3안** | 텍스트 | formula + title (숫자행동결과 / 역발상 / 타겟호명) |
| **카테고리 추천** | 텍스트 | suggestedCategoryName |

---

## 8. Supabase Schema

```sql
create table categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  name        text not null,
  color       text not null default '#6C63FF',
  icon        text not null default '💡',
  is_default  boolean default false,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

create table notes (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users not null,
  raw_content    text not null,
  summary        text,
  content_type   text,
  tags           text[],
  title          text,
  category_id    uuid references categories(id) on delete set null,
  derived_ideas  jsonb,
  title_options  jsonb,
  embedding      vector(1536),
  scheduled_at   timestamptz,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create index on notes using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index on notes (user_id, category_id);
create index on notes (user_id, created_at desc);
```

---

## 9. 성공 지표

| 지표 | 목표 |
| --- | --- |
| 저장 완료까지 | < 5초 |
| AI 구조화 응답 | < 3초 |
| D7 재방문율 | > 45% |
| 폴더 커스터마이징 사용률 | > 50% |

---

## 10. 미구현 (향후 개발)

- 푸시 알림 UI (채찍질 알림 카드)
- 폴더 삭제 확인 모달
- 태그 관리 화면
- 메모 스와이프 액션 (swipe to delete / 상태 변경)
- 마이크로 애니메이션 및 트랜지션 사양
- Supabase 연동 (auth + DB + pgvector)
- Claude API 실 연동 (mock → real)
- 음성 입력 (STT)
- 콘텐츠 캘린더 뷰

---

*End of Document*
