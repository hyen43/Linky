# Linky — Brand Identity & Design System

## Brand Essence
> 아이디어를 떠올리기만 해. 나머지는 링키가 다 한다.

**키워드**: 즉각적이다 · 자동화된다 · 크리에이터를 위한다 · 성장시킨다

---

## Visual Identity

### Color Palette
```
Primary:    #6C63FF   (보라 — 창의성, 아이디어)
Secondary:  #FF6584   (핑크 — 에너지, 영감)
Accent:     #43E97B   (그린 — 성장, 연결)
Background: #0F0F1A   (딥 네이비 — 깊이감, 집중)
Surface:    #1C1C2E   (다크 서피스)
Surface2:   #252538   (카드 배경)
Text:       #FFFFFF   (주 텍스트)
TextMuted:  #8B8BA7   (보조 텍스트)
Border:     #2E2E4A   (구분선)
```

### Typography
```
Font Family: System font (iOS: SF Pro, Android: Roboto)
Heading 1:  24px / Bold
Heading 2:  20px / SemiBold
Body:       16px / Regular
Caption:    13px / Regular
Micro:      11px / Regular
```

### Spacing Scale (Tailwind 기준)
```
xs: 4px   (p-1)
sm: 8px   (p-2)
md: 16px  (p-4)
lg: 24px  (p-6)
xl: 32px  (p-8)
```

### Border Radius
```
small:  8px   (rounded-lg)
medium: 16px  (rounded-2xl)
large:  24px  (rounded-3xl)
full:   9999px (rounded-full)
```

---

## Chat UI Design (KakaoTalk 스타일 참고)

### 채팅 버블
- **사용자 버블**: 오른쪽 정렬, Primary(#6C63FF) 배경, 흰 텍스트
- **AI 버블**: 왼쪽 정렬, Surface2(#252538) 배경, 흰 텍스트
- 버블 최대 너비: 화면의 75%
- 버블 패딩: 12px 수평, 8px 수직
- 버블 radius: 18px (발화자 방향 하단만 4px)

### 입력창 (Input Bar)
- 하단 고정 (safe area 고려)
- 배경: Surface(#1C1C2E)
- 상단 테두리: Border(#2E2E4A) 1px
- 내부 텍스트 입력창: Surface2 배경, rounded-full
- 왼쪽: 마이크 버튼 (음성 입력)
- 오른쪽: 전송 버튼 (Primary 색상, 내용 있을 때만 활성화)

### 마이크 버튼
- 기본 상태: 아이콘만 (mic outline)
- 녹음 중: Primary 배경 + 펄스 애니메이션
- 크기: 40x40, rounded-full

### 단계(Stage) 배지 색상
```
💡 초안      → 배경 #F59E0B (amber-500),  텍스트 흰색
📦 보관함    → 배경 #3B82F6 (blue-500),   텍스트 흰색
🎬 제작중    → 배경 #6C63FF (primary),     텍스트 흰색
✅ 제작완료  → 배경 #43E97B (accent),      텍스트 #0F0F1A
```

### 파생 아이디어 카드 (AI 생성)
```
┌─────────────────────────────────────┐
│ 💡 파생 아이디어 #1                  │
│ ─────────────────────────────────── │
│ 📌 맥락   MZ세대 생산성 트렌드 급부상 │
│ 🎯 타겟   자기계발 관심 직장인 2030  │
│ 📝 제목   "직장인이 새벽5시에 일어난 │
│            30일간의 리얼 변화"       │
│                                     │
│    [저장]    [수정 후 저장]  [스킵]  │
└─────────────────────────────────────┘
```

### SEO 제목 공식 카드
```
┌────────────────────────────────────┐
│ 🔤 제목 공식 3안                   │
│ ─────────────────────────────────  │
│ [숫자+행동+결과]                   │
│ "30일간 새벽 5시 기상한 직장인의   │
│  리얼 변화"                 [복사]  │
│                                    │
│ [역발상]                           │
│ "새벽기상 3개월 해봤는데 솔직히    │
│  별로였습니다"              [복사]  │
│                                    │
│ [타겟 직접 호명]                   │
│ "자기계발 유튜브 알고리즘 타는     │
│  사람들의 공통점"           [복사]  │
└────────────────────────────────────┘
```

### 보드 뷰 (단계별 칸반)
```
[전체] [💡초안 12] [📦보관함 8] [🎬제작중 3] [✅완료 24]
───────────────────────────────────────────────────────
┌──────────────────┐  ┌──────────────────┐
│ 새벽 루틴 브이로그 │  │ 협찬 영상 대본   │
│ #유튜브 #루틴     │  │ #유튜브 #스크립트│
│ [💡 초안]         │  │ [🎬 제작중]       │
└──────────────────┘  └──────────────────┘
```

### AI 저장 완료 버블
```
┌─────────────────────────────────────┐
│ ✅ 저장됐어요!                       │
│ 📺 YouTube · 💡 초안                 │
│ 🏷️ #새벽기상 #루틴 #브이로그         │
│                                     │
│ 파생 아이디어 3개 만들었어요 👇      │
└─────────────────────────────────────┘
```

---

## Iconography
- 라이브러리: `@expo/vector-icons` (Ionicons)
- 주요 아이콘:
  - 마이크: `mic` / `mic-outline`
  - 전송: `send`
  - 아이디어: `bulb-outline`
  - 메모: `document-text-outline`
  - 링크/연결: `git-network-outline`
  - 홈: `home-outline`
  - 탐색: `compass-outline`

---

## Animation Principles
- 모든 전환: 200-300ms, easing: ease-out
- 마이크 녹음 펄스: 1.2초 주기
- 채팅 버블 등장: fade-in + translateY(10 → 0)
- 로딩 (AI 처리 중): 3-dot bounce animation

---

## Tone of Voice (AI 응답)
- 친근하고 간결하게
- "~했어요", "~네요" 어조
- 이모지 적절히 사용 (과하지 않게)
- 크리에이터를 응원하는 느낌
- 예시:
  - "유튜브 아이디어로 저장했어요! 파생 아이디어 3개 만들어봤어요 👇"
  - "지난달에 비슷한 아이디어가 있었어요. 같이 발전시켜볼까요? 🔗"
  - "제목 공식 3가지 뽑아봤어요. 마음에 드는 거 골라보세요 🔤"
