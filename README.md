# Linky

> 아이디어를 떠올리기만 해. 나머지는 링키가 다 한다.

콘텐츠 크리에이터를 위한 AI 아이디어 관리 앱. 말하듯 입력하면 Claude AI가 아이디어를 분석·정제하고, 칸반 보드로 콘텐츠 제작 흐름을 관리합니다.

---

## 주요 기능

### Capture
- 자연어로 아이디어 입력 → AI가 즉시 파생 아이디어 3개 + 제목 후보 + 태그 + 콘텐츠 유형 자동 생성
- 노트 저장 후 AI 추천 제목 자동 생성
- 아이디어 드릴다운으로 상세 콘텐츠 아웃라인 확장

### Board
- 칸반 스타일 카테고리 보드 (초안 / 제작중 / 완료 + 커스텀)
- 카드 드래그 앤 드롭으로 카테고리 이동
- 제목·내용·태그 전체 검색

### Settings
- 카테고리 추가 / 수정 / 삭제 / 순서 변경
- 색상 및 이모지 아이콘 설정
- 유저 프로필 Supabase DB 동기화

---

## 기술 스택

| 분류 | 라이브러리 |
|------|-----------|
| 프레임워크 | React Native 0.81 · Expo 54 · Expo Router |
| 상태 관리 | Zustand 5 · TanStack React Query 5 |
| 백엔드 | Supabase (PostgreSQL + Auth + Edge Functions) |
| AI | OpenRouter API (claude-haiku-4-5) |
| 스타일 | NativeWind 4 (Tailwind CSS) · React Native Reanimated |
| 인증 | Kakao OAuth · Google OAuth (expo-web-browser + Supabase) |
| 알림 | Expo Notifications + Supabase Edge Function + pg_cron |

---

## 시작하기

### 사전 준비

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)

### 설치

```bash
git clone https://github.com/hyen43/Linky.git
cd Linky
npm install
```

### 환경 변수

프로젝트 루트에 `.env` 파일을 생성하고 아래 값을 채워주세요.

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
EXPO_PUBLIC_OPENROUTER_API_KEY=your-openrouter-key
```

- Supabase 프로젝트: [supabase.com](https://supabase.com)
- OpenRouter API 키: [openrouter.ai](https://openrouter.ai)

### 실행

```bash
# Web (기능 확인용)
npm run web

# iOS / Android (OAuth · 푸시 알림 포함 전체 테스트)
npm run ios
npm run android
```

---

## 테스트 환경별 지원 범위

| 환경 | UI 확인 | OAuth 로그인 | 푸시 알림 |
|------|---------|-------------|---------|
| Web (`npm run web`) | ✅ | ✅ | ❌ |
| Expo Go | ✅ | ❌ | ❌ |
| 실기기 빌드 | ✅ | ✅ | ✅ |

> OAuth(카카오·구글)와 푸시 알림은 실기기에 빌드해서 설치해야 정상 동작합니다.
> Expo Go는 커스텀 URL 스킴(`linky://`)을 지원하지 않아 OAuth 리다이렉트가 동작하지 않습니다.

### iOS 실기기 테스트 (Xcode 필요)

1. **Xcode 설치** — Mac App Store에서 Xcode 설치 (약 15GB, 시간 다소 소요)
2. **iPhone을 Mac에 연결** — 케이블 연결 후 기기에서 신뢰 허용
3. **빌드 및 설치**
   ```bash
   npm run ios
   ```
4. Xcode가 자동으로 빌드하여 연결된 iPhone에 설치됩니다.

### Android 실기기 테스트 (Android Studio 필요)

1. **Android Studio 설치** — [developer.android.com](https://developer.android.com/studio)에서 설치
2. **Android SDK 설정** — `ANDROID_HOME` 환경변수 설정 필요
3. **기기에서 개발자 옵션 + USB 디버깅 활성화**
4. **빌드 및 설치**
   ```bash
   npm run android
   ```

---

## 프로젝트 구조

```
app/
├── _layout.tsx          # 루트 레이아웃 (인증 게이트, 푸시 토큰 등록)
├── login.tsx            # 카카오 · Google 로그인
├── onboarding.tsx       # 온보딩 (3단계)
└── (tabs)/
    ├── index.tsx        # Capture 탭
    ├── board.tsx        # Board 탭
    └── settings.tsx     # Settings 탭

store/
├── useAuthStore.ts      # 인증 상태 + OAuth 플로우 (카카오 · Google)
├── useChatStore.ts      # 메시지·노트 상태 + AI 처리
├── useCategoryStore.ts  # 카테고리 CRUD
└── useSettingsStore.ts  # 유저 설정 (Supabase profiles 동기화)

lib/
├── supabase.ts          # Supabase 클라이언트
├── claude.ts            # OpenRouter AI 호출
├── notifications.ts     # Expo Push Token 등록
├── theme.ts             # 색상 시스템
└── api/
    ├── profilesApi.ts   # 프로필 CRUD
    ├── notesApi.ts      # 노트 CRUD
    └── foldersApi.ts    # 폴더 CRUD

supabase/
└── functions/
    └── daily-push/
        └── index.ts     # 채찍질 푸시 알림 Edge Function (pg_cron 트리거)

components/
├── chat/                # ChatBubble, NoteCard, InputBar
├── sheet/               # IdeaFormSheet, FolderFormSheet
└── ui/                  # CategoryBadge, CategoryPicker 등
```

---

## 인증 플로우

| 환경 | 방식 |
|------|------|
| iOS / Android | `expo-web-browser`로 인앱 브라우저 열기 → 딥링크(`linky://`) 콜백 수신 → `exchangeCodeForSession` |
| Web | Supabase OAuth redirect → `window.location.origin`으로 리다이렉트 |

---

## 푸시 알림 플로우

```
pg_cron (매 시간 정각)
  → Supabase Edge Function (daily-push)
     → 알림 시간 일치 유저 조회
        → 최근 7일 노트 활동 분석 (OpenRouter AI)
           → 채찍질 필요 시 Expo Push API로 발송
```

---

## 개발 문서

- [`docs/PRD.md`](docs/PRD.md) — 제품 요구사항
- [`docs/USER_FLOW.md`](docs/USER_FLOW.md) — 사용자 흐름 다이어그램
- [`docs/IDENTITY.md`](docs/IDENTITY.md) — 브랜드 가이드라인
- [`docs/DESIGN_QA_CHECKLIST.md`](docs/DESIGN_QA_CHECKLIST.md) — 디자인 QA 체크리스트
