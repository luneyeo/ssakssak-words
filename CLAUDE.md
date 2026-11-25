# 싹싹단어 (SsakSsak Words)

> 글 속 단어를 **싹싹** 쓸어 담아, 남김없이 **싹싹** 외운다.

이 파일은 AI 코딩 에이전트가 이 저장소에서 작업할 때 따르는 규칙입니다. 모든 작업 전에 이 파일을 먼저 읽습니다.

---

## 1. 프로젝트 개요

외국어 아티클이나 문장을 붙여넣으면, 학습할 가치가 있는 단어를 빠짐없이 뽑아 **문맥 기반 개념 카드**로 만들어 주는 웹 앱입니다.

### 개발 전략: 데모 먼저, AI는 나중에
1. **데모 버전으로 기능부터 완성합니다.** 실제 AI 대신 미리 만들어 둔 데이터(mock)를 돌려주는 가짜 제공자로 화면과 흐름을 전부 만듭니다. 이 단계에서는 API 키도 비용도 필요 없습니다.
2. 기능이 완성되면 **Google Gemini API**를 연결합니다 (무료 티어로 시작).
3. AI 호출 부분은 처음부터 mock과 Gemini를 **바꿔 끼울 수 있는 구조(provider)** 로 만듭니다.

### MVP 범위 (지금 만드는 것)
- 외국어 텍스트 입력 + 언어 선택
- 단어 카드 생성 (처음엔 mock, 이후 Gemini)
- 카드 목록 보기, 클릭하면 앞뒤 뒤집기
- 원문에서 카드로 만든 단어 하이라이트 (클릭 시 해당 카드로 이동)
- 생성한 카드를 localStorage에 저장하고 다시 보기
- **예시 글로 체험하기**: 배포 후에도 AI 호출 없이 미리 만든 결과를 바로 보여 주는 데모

### 이후 범위 (지금 구현하지 않음)
- 학습 모드 (알아요 / 몰라요)
- 난이도 (CEFR A1~C2)
- 간격 반복 학습 (SRS)
- 3,000자를 넘는 긴 글을 문단 단위로 나눠 처리하기
- 다크 모드, 로그인

> ⚠️ 이후 범위의 기능은 **미리 구현하지 않습니다.** 단, `WordCard` 타입의 `level?` 필드나 AI 제공자 인터페이스처럼 확장할 자리만 열어 둡니다.

---

## 2. 기술 스택

| 영역 | 선택 |
|---|---|
| 프레임워크 | Next.js (App Router, 최신 안정 버전) |
| 언어 | TypeScript (`strict: true`) |
| TypeScript 버전 | 타입 검사(`tsc`)는 7(`@typescript/native`), JS API가 필요한 도구(ESLint, Next.js 빌드)는 6 호환 패키지(`typescript`). `typescript-eslint`가 TypeScript 7을 지원하면 하나로 합칩니다 |
| 스타일 | Tailwind CSS |
| AI | 1차: mock 제공자 → 2차: Google Gemini (`@google/genai`). **서버에서만** 사용 |
| 검증 | zod |
| 상태 관리 | React state + 커스텀 훅 (전역 상태 라이브러리는 필요할 때 확인 후 도입) |
| 저장 | localStorage (`src/lib/storage.ts`를 통해서만 접근) |
| 테스트 | **Jest** + React Testing Library (`next/jest`로 설정) |
| 린트·포맷 | ESLint + Prettier (import 순서는 `eslint-plugin-import-x`로 검사) |
| 패키지 매니저 | pnpm |
| 배포 | Vercel (Hobby 플랜) |

> 테스트 도구는 Jest만 사용합니다. Vitest 등 다른 테스트 러너는 설치하지 않습니다.

### 명령어
```bash
pnpm dev         # 개발 서버
pnpm build       # 프로덕션 빌드
pnpm lint        # ESLint
pnpm typecheck   # tsc --noEmit
pnpm test        # Jest
pnpm format      # Prettier
```

### 환경 변수
```bash
AI_PROVIDER=mock     # mock | gemini (기본값 mock)

# Phase 4부터
GEMINI_API_KEY=      # 서버 전용
GEMINI_MODEL=        # gemini를 쓸 때 필수 (예: gemini-3.5-flash-lite)
```
- `AI_PROVIDER`가 없거나, 키 또는 `GEMINI_MODEL`이 비어 있으면 **mock으로 동작**해야 합니다. 키 없이도 앱 전체가 실행되어야 합니다.
- `.env.example`에는 키 이름만 적고 값은 비워 둡니다.
- API 키에 `NEXT_PUBLIC_` 접두사를 **절대** 붙이지 않습니다.
- 키는 `.env.local`에만 둡니다. 셸 설정 파일(`.zshrc` 등)에 `export`하지 않습니다.

---

## 3. 폴더 구조

```
src/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx                 # 입력 + 결과 화면
│  ├─ cards/page.tsx           # 저장한 카드 모아보기
│  └─ api/cards/route.ts       # POST: 단어 카드 생성 (선택된 AI 제공자 호출)
├─ features/
│  └─ word-card/
│     ├─ components/
│     │  ├─ WordCardWorkspace.tsx  # 입력부터 결과까지 화면 조립
│     │  ├─ TextInputForm.tsx
│     │  ├─ DemoArticlePicker.tsx  # "예시 글로 체험하기"
│     │  ├─ GenerateStatus.tsx     # 로딩·결과·빈 상태·에러 문구
│     │  ├─ CardResult.tsx         # 원문 하이라이트 + 카드 목록
│     │  ├─ SavedCardSets.tsx      # 저장한 세트 목록, 삭제
│     │  ├─ SavedCardSetItem.tsx
│     │  ├─ CardGrid.tsx
│     │  ├─ WordCard.tsx
│     │  ├─ WordCardList.tsx
│     │  ├─ WordCardSkeleton.tsx
│     │  └─ HighlightedText.tsx
│     ├─ demo/
│     │  └─ demoArticles.ts    # 예시 글 + 미리 만든 카드 결과 (3개)
│     ├─ hooks/
│     │  ├─ useGenerateCards.ts
│     │  └─ useSavedCards.ts
│     ├─ constants.ts          # 글자 수 제한, 지원 언어
│     ├─ savedCardSets.ts      # 카드 세트 저장·삭제·읽기
│     ├─ schema.ts             # zod 스키마
│     └─ types.ts
├─ lib/
│  ├─ ai/
│  │  ├─ types.ts              # WordCardProvider 인터페이스
│  │  ├─ errors.ts             # 에러 코드, HTTP 상태, 안내 문구
│  │  ├─ index.ts              # getWordCardProvider(): 환경 변수로 제공자 선택
│  │  ├─ prompts.ts            # 시스템 프롬프트, 사용자 메시지 템플릿 (제공자 공통)
│  │  ├─ cardJsonSchema.ts     # 응답 JSON 스키마 (제공자 공통)
│  │  ├─ postprocess.ts        # zod 검증, lemma 중복 제거 (제공자 공통)
│  │  └─ providers/
│  │     ├─ mock.ts            # Phase 1
│  │     ├─ mockFunctionWords.ts  # mock이 제외할 기능어 목록
│  │     └─ gemini.ts          # Phase 4
│  ├─ storage.ts               # localStorage 래퍼
│  ├─ text.ts                  # 하이라이트용 텍스트 유틸
│  └─ cn.ts                    # 조건부 className 유틸
└─ components/
   └─ ui/                      # Button, Textarea, Select, Spinner, Chip, TextLink 등 공용 UI
docs/
└─ word-card-prompt.md         # 프롬프트·스키마 원본 명세
.coderabbit.yaml               # CodeRabbit 코드 리뷰 설정
README.md                      # 프로젝트 소개, 실행·배포 방법
```

- 기능에 속한 코드는 `features/<기능>/` 아래에 둡니다.
- 두 개 이상의 기능에서 쓰는 것만 `components/ui`, `lib`로 올립니다.
- 화면 코드는 어떤 AI 제공자를 쓰는지 **몰라야 합니다.** 항상 `/api/cards`만 호출합니다.

---

## 4. 데이터, AI 제공자, API

### 타입
```ts
export type PartOfSpeech = "명사" | "동사" | "형용사" | "부사" | "숙어" | "기타";

export type WordCard = {
  id: string;                 // 클라이언트에서 crypto.randomUUID()
  word: string;               // 원문에 나온 형태
  lemma: string;              // 기본형 (중복 판단 기준)
  meaning: string;            // 문맥상 뜻 (한국어)
  partOfSpeech: PartOfSpeech;
  context: string;            // 원문 문장 그대로
  example: string;            // 새 예문
  exampleTranslation: string; // 예문 번역
  level?: string;             // 이후 범위: 난이도 (지금은 사용하지 않음)
};

export type CardSet = {
  id: string;
  title: string;              // 원문 앞 30자
  language: string;
  sourceText: string;
  cards: WordCard[];
  isDemo: boolean;            // 예시 글로 만든 세트인지
  createdAt: string;          // ISO 문자열
};
```

### AI 제공자 인터페이스
```ts
// src/lib/ai/types.ts
export type GenerateCardsInput = { text: string; language: string };
export type GeneratedCard = Omit<WordCard, "id">;

export type WordCardProvider = {
  name: "mock" | "gemini";
  generateCards(input: GenerateCardsInput): Promise<GeneratedCard[]>;
};
```
- 모든 제공자는 같은 프롬프트(`prompts.ts`), 같은 JSON 스키마(`cardJsonSchema.ts`), 같은 후처리(`postprocess.ts`)를 사용합니다.
- 제공자별 코드에는 **SDK 호출 방식의 차이만** 담습니다.
- 제공자 내부 에러는 공통 에러 코드(아래 표)로 바꿔서 던집니다.

### mock 제공자 (Phase 1)
- 입력이 `demoArticles.ts`의 예시 글과 같으면, 미리 만든 카드를 그대로 돌려줍니다.
- 그 외의 글이면, 간단한 규칙(공백·문장부호로 단어 분리, 기능어 목록 제외, 소문자 기준 중복 제거)으로 단어를 뽑아 **데모용 카드**를 만듭니다. 이때 `meaning`은 `"(데모) 실제 뜻은 AI 연결 후 표시돼요"`, `context`는 해당 단어가 들어간 원문 문장으로 채웁니다. 이렇게 하면 어떤 글을 넣어도 하이라이트와 카드 UI를 확인할 수 있습니다.
- 실제 AI처럼 느껴지도록 **800~1,500ms 지연**을 줍니다.
- 에러 화면을 확인할 수 있도록, 입력이 `!error:RATE_LIMITED`처럼 `!error:<코드>`로 시작하면 해당 에러를 던집니다. **이 기능은 mock에서만 동작합니다.**

### 예시 글로 체험하기
- `demoArticles.ts`에는 영어 예시 글 3개(짧은 문장 / 숙어가 많은 글 / 뉴스 한 단락)와 **손으로 검수한 카드 결과**를 넣습니다.
- 화면에서 예시 글을 고르면 **API를 호출하지 않고** 클라이언트에서 바로 결과를 보여 줍니다. 배포 후에도 비용 없이 체험할 수 있게 하기 위해서입니다.
- 예시 카드 데이터는 `CardSet` 저장 형식과 같은 타입을 따르고, zod 검증 테스트를 둡니다.

### `POST /api/cards`
- 요청: `{ text: string; language: string }`
- 성공 (200): `{ cards: GeneratedCard[]; provider: "mock" | "gemini" }`
- 실패: `{ error: { code: ErrorCode; message: string } }` (`message`는 사용자에게 보여줄 한국어)

| code | HTTP | 상황 |
|---|---|---|
| `INVALID_INPUT` | 400 | 빈 텍스트, 지원하지 않는 언어 |
| `TEXT_TOO_LONG` | 413 | 3,000자 초과 |
| `RATE_LIMITED` | 429 | AI 하루 사용 한도 초과 |
| `TOO_MANY_REQUESTS` | 503 | AI 분당 요청 한도 초과, 또는 AI 서버 과부하 |
| `AI_ERROR` | 502 | AI API 호출 실패 |
| `PARSE_ERROR` | 502 | 응답 검증 실패 (1회 재시도 후) |

- 응답의 `provider`가 `"mock"`이면 화면 상단에 **"데모 모드"** 배지를 보여 줍니다.

### 프롬프트
- 프롬프트, JSON 스키마, 제공자별 호출 설정은 **`docs/word-card-prompt.md`를 그대로 따릅니다.**
- 프롬프트를 바꿀 때는 문서와 `src/lib/ai/prompts.ts`를 함께 수정합니다.
- 스트리밍 없이 응답 한 번으로 받고, 기다리는 동안 스켈레톤 카드를 보여 줍니다.

---

## 5. 디자인 가이드

### 콘셉트
**"싹싹 쓸어 담은 깨끗한 책상"**: 군더더기 없이 깔끔하고, 상쾌하고, 친근한 느낌.
여백을 넉넉히 두고, 강조는 민트 한 가지 색으로만 합니다.

### 색상 토큰
`tailwind.config`(또는 CSS 변수)에 토큰으로 등록하고, 컴포넌트에서는 **토큰 이름으로만** 씁니다. 임의의 hex 값을 직접 쓰지 않습니다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `bg` | `#FAFAF7` | 페이지 배경 |
| `surface` | `#FFFFFF` | 카드, 입력창 |
| `border` | `#E7E5E4` | 테두리, 구분선 |
| `text` | `#1C1917` | 본문 |
| `text-muted` | `#78716C` | 보조 텍스트 |
| `primary` | `#14B8A6` | 버튼, 포인트 |
| `primary-strong` | `#0F766E` | 흰 배경 위 강조 텍스트, 버튼 hover |
| `primary-soft` | `#CCFBF1` | 원문 하이라이트 배경, 칩 배경 |
| `danger` | `#DC2626` | 에러 |

### 타이포그래피
- 폰트: **Pretendard** (한글·영문 공통), 대체 폰트는 `system-ui, sans-serif`
- 본문 16px / 행간 1.6
- 카드 앞면 단어: 28~32px, bold
- 보조 텍스트: 14px, `text-muted`

### 형태
- 모서리: 카드 `16px`, 버튼·입력창 `12px`, 칩·배지 `9999px`
- 그림자: 아주 옅게 (`shadow-sm` 수준), hover 시 한 단계만 진하게
- 간격: 4px 단위 (Tailwind 기본 스케일)

### 레이아웃
- 모바일 우선, 콘텐츠 최대 너비 `max-w-3xl`, 가운데 정렬
- 카드 그리드: 모바일 1열 → `sm` 2열 → `lg` 3열
- 입력 영역 아래에 "예시 글로 체험하기" 버튼 3개를 칩 형태로 배치합니다.

### 단어 카드
- **앞면**: 단어(`word`), 기본형(`lemma`, `word`와 다를 때만), 품사 칩
- **뒷면**: 뜻(`meaning`), 원문 문장(`context`, 해당 단어 하이라이트), 예문(`example`)과 번역(`exampleTranslation`)
- 뒤집기: Y축 3D 회전 400ms. `prefers-reduced-motion`이 켜져 있으면 회전 대신 페이드

### 문구 톤
친근한 존댓말("~해요")을 씁니다.

| 상황 | 문구 |
|---|---|
| 서비스 소개 | 글 속 단어를 싹싹 쓸어 담아 드려요 |
| 생성 버튼 | 단어 싹싹 담기 |
| 예시 영역 | 예시 글로 먼저 체험해 보세요 |
| 데모 배지 | 데모 모드 |
| 로딩 | 단어를 싹싹 쓸어 담는 중이에요… |
| 결과 | 단어 {n}개를 싹싹 담았어요! |
| 빈 상태 | 아직 담은 단어가 없어요. 글을 붙여넣어 보세요! |
| 단어 없음 | 이 글에서는 담을 단어를 찾지 못했어요 |
| 하루 한도 초과 | 오늘 담을 수 있는 양을 다 썼어요. 예시 글로 체험해 보세요! |
| 요청이 몰림 | 요청이 너무 많아요. 잠시 후 다시 시도해 주세요 |
| 에러 | 앗, 단어를 담지 못했어요. 잠시 후 다시 시도해 주세요 |

### 접근성
- 카드는 `<button>`으로 만들고, Enter와 Space로 뒤집을 수 있어야 합니다.
- 뒤집힌 상태를 `aria-pressed` 또는 `aria-label`로 알립니다.
- 모든 인터랙션 요소에 눈에 보이는 focus 스타일(`primary` 링)을 줍니다.
- 텍스트 대비는 WCAG AA 이상을 지킵니다. `primary` 위의 흰 글씨는 굵은 큰 글씨에만 쓰고, 작은 글씨는 `primary-strong`을 씁니다.

---

## 6. 코드 컨벤션

### TypeScript
- `any`는 쓰지 않습니다. 모르는 값은 `unknown`으로 받고 zod나 타입 가드로 좁힙니다.
- 외부에서 들어오는 데이터(AI 응답, localStorage, 요청 body)는 **항상 zod로 검증**합니다.
- 객체 모양은 `type`으로 정의합니다 (`interface`는 쓰지 않음).

### 네이밍
| 대상 | 규칙 | 예 |
|---|---|---|
| 컴포넌트 파일·이름 | PascalCase | `WordCard.tsx` |
| 훅 | `use` + camelCase | `useSavedCards.ts` |
| 함수·변수 | camelCase | `highlightWords` |
| 상수 | UPPER_SNAKE_CASE | `MAX_TEXT_LENGTH` |
| Props 타입 | `컴포넌트명Props` | `WordCardProps` |
| boolean | `is`, `has`, `can`으로 시작 | `isFlipped` |
| 이벤트 핸들러 | 정의는 `handle~`, props는 `on~` | `handleFlip`, `onFlip` |

### 컴포넌트
- 함수 선언문 + named export (`export function WordCard() {}`). default export는 Next.js가 요구하는 파일(`page.tsx`, `layout.tsx`)에서만 씁니다.
- 기본은 서버 컴포넌트로 만들고, 상태나 이벤트가 필요한 컴포넌트에만 `"use client"`를 붙입니다.
- 한 파일에는 컴포넌트 하나를 둡니다. 150줄이 넘으면 나눌지 검토합니다.
- 로직은 훅으로 분리하고, 컴포넌트는 화면을 그리는 데 집중합니다.

### 상태 불변성 (중요)
- state는 **직접 수정하지 않습니다.** `push`, `splice`, `sort`, `reverse`, `obj.key = value`를 state에 쓰지 않습니다.
- 새 배열을 반환하는 방식을 씁니다: `[...arr, x]`, `filter`, `map`, `toSorted`
- 중첩 객체는 **바뀐 경로만 단계마다 얕은 복사**합니다 (구조적 공유). `structuredClone`으로 state 전체를 깊은 복사하지 않습니다.
- memo된 자식에게 객체나 함수를 넘길 때만 `useMemo`, `useCallback`을 씁니다. 근거 없는 최적화는 하지 않습니다.

### 스타일
- Tailwind 유틸리티 클래스만 씁니다. 인라인 `style`은 애니메이션 값처럼 꼭 필요할 때만 씁니다.
- 조건부 클래스는 `cn()` 유틸을 씁니다.
- 색상은 5장의 디자인 토큰만 씁니다.

### 서버와 보안
- AI SDK와 API 키를 쓰는 파일(`src/lib/ai/providers/*`, `src/lib/ai/index.ts`) 맨 위에 `import "server-only";`를 넣습니다.
- 클라이언트 코드에서 AI API를 직접 호출하지 않습니다. 반드시 `/api/cards`를 거칩니다.
- 서버 로그에 사용자 원문 전체나 API 키를 남기지 않습니다.

### import 순서
1. React·Next.js
2. 외부 라이브러리
3. `@/` 내부 모듈
4. 상대 경로

그룹 사이에는 빈 줄을 하나 둡니다. 경로 별칭은 `@/` → `src/`입니다.

### 주석
- 주석은 한국어로, **무엇**보다 **왜**를 씁니다.
- 코드를 그대로 읽어 주는 주석은 쓰지 않습니다.

### 테스트 (Jest)
- 설정: `next/jest`로 `jest.config.ts`를 만들고, 환경은 `jsdom`, `@testing-library/jest-dom`을 `jest.setup.ts`에서 불러옵니다. `@/` 경로 별칭을 `moduleNameMapper`에 등록합니다.
- 순수 함수(`lib/text.ts`, `lib/storage.ts`, `lib/ai/postprocess.ts`, zod 스키마, mock 제공자)는 반드시 단위 테스트를 작성합니다.
- 예시 카드 데이터(`demoArticles.ts`)가 zod 스키마를 통과하는지 테스트합니다.
- 컴포넌트는 핵심 상호작용(카드 뒤집기, 폼 제출, 예시 글 선택, 에러 표시)만 테스트합니다.
- 실제 AI API는 테스트에서 호출하지 않습니다. Gemini 제공자는 `jest.mock`으로 SDK를 대체해 테스트합니다.
- 테스트 파일은 대상 옆에 `*.test.ts(x)`로 둡니다.

### Git
- 커밋 메시지는 Conventional Commits 형식에 한국어 설명을 씁니다.
  - `feat: 단어 카드 뒤집기 애니메이션 추가`
  - `fix: 활용형 단어가 중복 생성되는 문제 수정`
  - `refactor:`, `style:`, `test:`, `docs:`, `chore:`
- 하나의 커밋에는 하나의 목적만 담습니다.
- 브랜치 이름: `feat/카드-뒤집기`처럼 `종류/짧은-설명`

---

## 7. 에이전트 작업 규칙

1. **계획 먼저**: 작업을 시작하기 전에 무엇을 어떤 순서로 할지 짧게 계획을 보여 줍니다.
2. **단계 범위 지키기**: 요청받은 Phase 범위만 작업합니다. 다음 Phase나 "이후 범위" 기능은 만들지 않습니다.
3. **의존성 확인**: 2장에 없는 패키지를 추가하기 전에 이유를 설명하고 확인을 받습니다.
4. **최신 문서 확인**: Gemini SDK(`@google/genai`)의 호출 방식과 모델 이름은 자주 바뀝니다. Phase 4에서는 구현 전에 공식 문서(ai.google.dev)의 최신 구조화 출력(structured output) 예제를 확인하고, 문서와 이 파일이 다르면 문서를 따르되 그 사실을 보고합니다.
5. **비밀 정보 보호**: `.env*` 파일의 값을 읽거나 출력하거나 커밋하지 않습니다. `.gitignore`에 `.env*.local`이 있는지 확인합니다.
6. **완료 기준**: 단계를 끝내기 전에 `pnpm lint && pnpm typecheck && pnpm test && pnpm build`를 실행하고, 모두 통과한 결과를 보고합니다.
7. **작은 커밋**: 의미 있는 단위로 나눠 커밋합니다.
8. **추측 금지**: 요구사항이 모호하거나 이 문서와 충돌하면 추측하지 말고 질문합니다.
9. **문서 동기화**: 구조, 명령어, 규칙이 바뀌면 이 파일도 함께 수정합니다.
10. **보고 형식**: 단계가 끝나면 아래 형식으로 보고합니다.
    - 한 일
    - 바뀐 파일
    - 확인 방법 (직접 눌러 볼 수 있는 순서)
    - 남은 이슈나 다음 단계 제안

---

## 8. 로드맵

| Phase | 내용 | 완료 기준 |
|---|---|---|
| **0. 세팅** | Next.js 프로젝트 생성, Tailwind 디자인 토큰, Pretendard, ESLint·Prettier·Jest, 폴더 구조, `.env.example` | `pnpm dev`로 "싹싹단어" 빈 화면이 뜨고 모든 검사 통과 |
| **1. 데모 데이터와 mock API** | 타입·zod 스키마, `demoArticles.ts`(예시 3개), `WordCardProvider` 인터페이스, mock 제공자, 후처리, `/api/cards`(mock 연결), 에러 코드 | API 키 없이 curl로 `/api/cards`를 호출해 데모 카드와 각 에러 응답 확인 |
| **2. 카드 UI** | 입력 폼, 예시 글로 체험하기, 데모 배지, 스켈레톤, 카드 목록, 뒤집기, 원문 하이라이트, 에러·빈 상태 | 브라우저에서 예시 글 선택 → 카드 확인, 직접 입력 → mock 카드 생성 → 뒤집기 흐름 동작 |
| **3. 저장** | localStorage 저장, `/cards` 모아보기, 카드 세트 삭제 | 새로고침해도 카드가 남아 있음 |
| **4. Gemini 연결** | Gemini 제공자, 프롬프트·JSON 스키마 적용, 재시도, 에러 변환, `AI_PROVIDER=gemini` 전환 | `docs/word-card-prompt.md`의 테스트 입력 5종이 기대대로 동작. `AI_PROVIDER=mock`으로 되돌려도 정상 동작 |
| **5. 배포** | 하루 한도 초과와 요청이 몰릴 때의 안내 문구, Vercel 배포, README 작성 | 배포 URL에서 예시 체험과 직접 생성이 모두 동작하고, 한도 초과 시 안내 문구 표시 |
