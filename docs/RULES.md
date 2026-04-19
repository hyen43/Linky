# Linky — Engineering Rules & Conventions

## 1. 언어 & 타입 규칙
- **TypeScript strict mode** 필수. `any` 사용 금지.
- 모든 컴포넌트는 `FC<Props>` 타입 명시.
- API 응답 타입은 반드시 `types/` 디렉토리에 정의.
- `interface`는 객체 형태, `type`은 유니온/인터섹션에 사용.

## 2. 파일 구조
```
linky/
├── app/                    # Expo Router 페이지
│   ├── (tabs)/
│   │   ├── index.tsx       # 채팅 메인 화면
│   │   ├── explore.tsx     # 메모 탐색
│   │   └── profile.tsx     # 프로필
│   └── _layout.tsx
├── components/
│   ├── chat/               # 채팅 관련 컴포넌트
│   ├── memo/               # 메모 카드 컴포넌트
│   └── ui/                 # 공통 UI (Button, Input 등)
├── hooks/                  # 커스텀 훅
├── lib/                    # 외부 서비스 클라이언트 (supabase, claude)
├── store/                  # Zustand 스토어
├── types/                  # TypeScript 타입 정의
├── utils/                  # 순수 유틸 함수
└── docs/                   # 프로젝트 문서
```

## 3. 컴포넌트 규칙
- 컴포넌트당 파일 하나. 파일명은 PascalCase.
- Props 인터페이스는 컴포넌트 파일 상단에 정의.
- `StyleSheet.create` 금지. **NativeWind className만 사용**.
- 200줄 초과 시 분리 검토.

## 4. 상태 관리
- 로컬 UI 상태: `useState` / `useReducer`
- 전역 앱 상태: **Zustand** (store/useIdeaStore.ts 등)
- 서버 상태: **Supabase Realtime** + React Query 고려

## 5. API & 비동기 처리
- 모든 API 호출은 `lib/` 에 래핑.
- `try/catch` 필수. 에러는 사용자에게 토스트로 표시.
- Claude API는 스트리밍 응답 사용 (UX를 위해).

## 6. 테스트 규칙
- 컴포넌트 테스트: `@testing-library/react-native`
- 유틸 함수: `jest` 단위 테스트
- 테스트 파일: `__tests__/` 폴더 또는 `*.test.ts(x)` 형식
- **핵심 컴포넌트는 반드시 렌더 테스트 통과** 후 PR 가능

## 7. 커밋 규칙 (Conventional Commits)
```
feat: 새로운 기능
fix: 버그 수정
chore: 설정, 패키지 변경
docs: 문서 수정
test: 테스트 추가/수정
refactor: 리팩토링
```

## 8. 보안 규칙
- API 키는 절대 코드에 하드코딩 금지. `.env` 사용.
- Supabase RLS(Row Level Security) 필수 활성화.
- 사용자 입력은 저장 전 sanitize.

## 9. 성능 규칙
- FlatList에 `keyExtractor` 필수.
- 이미지는 `expo-image` 사용 (캐싱).
- 무거운 연산은 `useMemo` / `useCallback` 래핑.

## 10. 접근성
- 모든 터치 영역 최소 44x44pt.
- `accessibilityLabel` 필수 (아이콘 버튼).
