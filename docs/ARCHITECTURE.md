# ARCHITECTURE

AI 에이전트용 구조·데이터·API·기술 스택 명세. 어떤 장을 읽을지는 `AGENTS.md`를 따른다.

## 1. 폴더 구조

적용: 파일 추가·이동·이름 변경

```
src/
├─ app/
│  ├─ globals.css              # 디자인 토큰
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
│  │     ├─ mock.ts
│  │     ├─ mockFunctionWords.ts  # mock이 제외할 기능어 목록
│  │     └─ gemini.ts
│  ├─ storage.ts               # localStorage 래퍼
│  ├─ text.ts                  # 하이라이트용 텍스트 유틸
│  └─ cn.ts                    # 조건부 className 유틸
└─ components/
   └─ ui/                      # Button, Textarea, Select, Spinner, Chip, TextLink, focusRing 등 공용 UI
docs/
├─ ARCHITECTURE.md             # 구조, 데이터, AI 제공자, API, 기술 스택
├─ CONVENTIONS.md              # 코드, 커밋, 브랜치 규칙
├─ DESIGN.md                   # 색상, 레이아웃, 문구, 접근성
└─ DEVELOPMENT.md              # 명령어, 환경 변수
AGENTS.md                      # 작업 규칙, 상황별로 읽을 문서 안내
CLAUDE.md                      # 프로젝트 범위
.coderabbit.yaml               # CodeRabbit 코드 리뷰 설정
.github/workflows/ci.yml       # GitHub Actions 검사
README.md                      # 프로젝트 소개, 실행 방법
```

- 기능에 속한 코드는 `features/<기능>/` 아래에 둔다.
- 두 개 이상의 기능에서 쓰는 것만 `components/ui`, `lib`로 올린다.

## 2. 데이터 타입

적용: `src/features/word-card/types.ts`, `schema.ts`, `src/lib/ai/types.ts`

타입 정의는 위 파일이 원본이다. 코드에 드러나지 않는 의미만 적는다.

- `WordCard.id`: 서버가 아니라 클라이언트에서 `crypto.randomUUID()`로 만든다.
- `WordCard.word`: 원문에 나온 형태
- `WordCard.lemma`: 기본형. 중복 판단 기준
- `WordCard.meaning`: 문맥상 뜻 (한국어)
- `WordCard.context`: 원문 문장 그대로
- `WordCard.example`, `exampleTranslation`: 새 예문과 그 번역
- `WordCard.level?`: 난이도 확장 자리. 지금은 사용하지 않는다.
- `CardSet.title`: 원문 앞 30자
- `CardSet.isDemo`: 예시 글로 만든 세트인지
- `CardSet.createdAt`: ISO 문자열

## 3. AI 제공자

적용: `src/lib/ai/**`

### 공통
- 모든 제공자는 같은 프롬프트(`prompts.ts`), JSON 스키마(`cardJsonSchema.ts`), 후처리(`postprocess.ts`)를 쓴다.
- 프롬프트는 `prompts.ts`, 호출 설정은 `providers/*`가 원본이다.
- JSON 스키마는 `src/features/word-card/schema.ts`의 zod 스키마에서 만들어 한 곳에서만 관리한다.
- 스트리밍 없이 응답 한 번으로 받고, 기다리는 동안 스켈레톤 카드를 보여 준다.

### mock
- 입력이 `demoArticles.ts`의 예시 글과 같으면 미리 만든 카드를 그대로 돌려준다.
- 그 외의 글은 규칙(공백·문장부호로 분리, 기능어 제외, 소문자 기준 중복 제거)으로 단어를 뽑아 데모용 카드를 만든다. 어떤 글을 넣어도 하이라이트와 카드 UI를 확인할 수 있게 하기 위해서다.
  - `meaning`: `"(데모) 실제 뜻은 AI 연결 후 표시돼요"`
  - `context`: 해당 단어가 들어간 원문 문장
- 실제 AI처럼 느껴지도록 800~1,500ms 지연을 준다.
- 입력이 `!error:<코드>`로 시작하면 (`!error:RATE_LIMITED`) 해당 에러를 던진다. **mock에서만 동작한다.**

## 4. `POST /api/cards`

적용: `src/app/api/**`, `src/lib/ai/errors.ts`, API를 호출하는 화면 코드

- 요청: `{ text: string; language: string }`
- 성공 (200): `{ cards: GeneratedCard[]; provider: "mock" | "gemini" }`
- 실패: `{ error: { code: ErrorCode; message: string } }` (`message`는 사용자에게 보여 줄 한국어)
- 응답의 `provider`가 `"mock"`이면 화면 상단에 "데모 모드" 배지를 보여 준다.

| code | HTTP | 상황 |
|---|---|---|
| `INVALID_INPUT` | 400 | 빈 텍스트, 지원하지 않는 언어 |
| `TEXT_TOO_LONG` | 413 | 3,000자 초과 |
| `RATE_LIMITED` | 429 | AI 하루 사용 한도 초과 |
| `TOO_MANY_REQUESTS` | 503 | AI 분당 요청 한도 초과, 또는 AI 서버 과부하 |
| `AI_ERROR` | 502 | AI API 호출 실패 |
| `PARSE_ERROR` | 502 | 응답 검증 실패 (1회 재시도 후) |

## 5. 예시 글

적용: `src/features/word-card/demo/**`

- `demoArticles.ts`에는 영어 예시 글 3개(짧은 문장 / 숙어가 많은 글 / 뉴스 한 단락)와 **손으로 검수한 카드 결과**를 둔다.
- 예시 글을 고르면 **API를 호출하지 않고** 클라이언트에서 바로 결과를 보여 준다. 배포 후에도 비용 없이 체험할 수 있게 하기 위해서다.
- 카드 데이터는 `CardSet` 저장 형식과 같은 타입을 따르고, zod 검증 테스트를 둔다.

## 6. 기술 스택

적용: `package.json`, 패키지·도구 추가나 교체

| 영역 | 선택 |
|---|---|
| 프레임워크 | Next.js (App Router, 최신 안정 버전) |
| 언어 | TypeScript (`strict: true`) |
| TypeScript 버전 | 타입 검사(`tsc`)는 7(`@typescript/native`), JS API가 필요한 도구(ESLint, Next.js 빌드)는 6 호환 패키지(`typescript`). `typescript-eslint`가 TypeScript 7을 지원하면 하나로 합친다 |
| 스타일 | Tailwind CSS |
| AI | mock 제공자, Google Gemini (`@google/genai`, 무료 티어). **서버에서만** 사용 |
| 검증 | zod |
| 상태 관리 | React state + 커스텀 훅 (전역 상태 라이브러리는 필요할 때 확인 후 도입) |
| 저장 | localStorage (`src/lib/storage.ts`를 통해서만 접근) |
| 테스트 | **Jest** + React Testing Library (`next/jest`로 설정) |
| 린트·포맷 | ESLint + Prettier (import 순서는 `eslint-plugin-import-x`로 검사) |
| 패키지 매니저 | pnpm |
| 배포 | Vercel (Hobby 플랜) |
| 방문 통계 | Vercel Web Analytics (`@vercel/analytics`) |
