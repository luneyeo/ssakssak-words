# ARCHITECTURE

AI 에이전트용 구조·데이터·API·기술 스택 명세. 어떤 장을 읽을지는 `AGENTS.md`를 따른다.

## 1. 폴더 구조

적용: 파일 추가·이동·이름 변경

```
src/
├─ app/                        # Next.js 라우트. views를 불러 내보내기만 한다
│  ├─ layout.tsx               # 모든 페이지 공통 <main> 여백
│  ├─ page.tsx                 # views/home
│  ├─ cards/page.tsx           # views/cards (+ metadata)
│  └─ api/cards/route.ts       # POST: 단어 카드 생성 (선택된 AI 제공자 호출)
├─ views/                      # FSD pages 레이어: widgets를 페이지 단위로 조립
│  ├─ home/ui/HomePage.tsx     # SiteHeader(main) + HomeHero + CardGenerator
│  └─ cards/ui/CardsPage.tsx   # SiteHeader(cards) + SavedCardSets
├─ widgets/                    # features·entities를 화면 블록으로 조립
│  ├─ site-header/ui/
│  │  ├─ SiteHeader.tsx        # 로고 + 오른쪽 링크 (page가 main이면 담은 단어, cards면 단어 담으러 가기)
│  │  ├─ SavedWordsLink.tsx    # "담은 단어" 링크 + 개수 배지
│  │  └─ AddToWordsLink.tsx    # "단어 담으러 가기" 링크
│  ├─ home-hero/ui/HomeHero.tsx  # 서비스 소개 제목·설명
│  ├─ card-generator/ui/CardGenerator.tsx  # 입력 카드 + 결과 영역, 결과 저장
│  └─ saved-card-sets/ui/
│     ├─ SavedCardSets.tsx     # 저장한 세트 목록, 삭제
│     ├─ SavedCardSetItem.tsx
│     └─ CardsHero.tsx         # 모아보기 제목 + 모은 문장·단어 수
├─ features/                   # 사용자 행동
│  └─ generate-cards/          # 카드 만들기 (직접 입력, 예시 글 고르기)
│     ├─ model/useGenerateCards.ts
│     └─ ui/
│        ├─ TextInputForm.tsx
│        ├─ DemoArticlePicker.tsx  # "예시로 해보기" 칩 (예시 글로 체험하기)
│        ├─ GenerateStatus.tsx     # 로딩·결과·빈 상태·에러 문구
│        ├─ EmptyResult.tsx        # 단어 없음 상태
│        ├─ RequestErrorNotice.tsx # 요청 실패(연결 실패) 상태 + 다시 시도
│        ├─ BusyNotice.tsx         # 요청 몰림(TOO_MANY_REQUESTS) 상태 + 다시 시도
│        └─ RateLimitNotice.tsx    # 하루 한도 초과(RATE_LIMITED) 상태 + 예시 글로 체험하기
├─ entities/                   # 도메인
│  └─ word-card/
│     ├─ model/
│     │  ├─ types.ts
│     │  ├─ schema.ts          # zod 스키마
│     │  ├─ constants.ts       # 글자 수 제한, 지원 언어
│     │  ├─ savedCardSets.ts   # 카드 세트 저장·삭제·읽기
│     │  └─ useSavedCards.ts
│     ├─ config/
│     │  └─ demoArticles.ts    # 예시 글 + 미리 만든 카드 결과 (3개)
│     └─ ui/
│        ├─ WordCard.tsx
│        ├─ CardResult.tsx     # 원문 하이라이트 + 카드 목록
│        ├─ HighlightedText.tsx
│        ├─ CardGrid.tsx
│        ├─ WordCardList.tsx
│        └─ WordCardSkeleton.tsx
├─ ai/                         # AI 호출 (word-card 전용이라 shared가 아닌 레이어 밖 독립 폴더)
│  ├─ types.ts                 # WordCardProvider 인터페이스
│  ├─ errors.ts                # 에러 코드, HTTP 상태, 안내 문구
│  ├─ index.ts                 # getWordCardProvider(): 환경 변수로 제공자 선택
│  ├─ prompts.ts               # 시스템 프롬프트, 사용자 메시지 템플릿 (제공자 공통)
│  ├─ cardJsonSchema.ts        # 응답 JSON 스키마 (제공자 공통)
│  ├─ postprocess.ts           # zod 검증, lemma 중복 제거 (제공자 공통)
│  └─ providers/
│     ├─ mock.ts
│     ├─ mockFunctionWords.ts  # mock이 제외할 기능어 목록
│     └─ gemini.ts
└─ shared/                     # FSD shared 레이어: 특정 기능을 모르는 공통 코드
   ├─ icons/                   # 모든 SVG 아이콘. 한 파일에 하나, index.ts로 한 번에 내보냄
   ├─ styles/
   │  └─ globals.css           # 디자인 토큰, 전역 스타일 (layout.tsx에서 불러옴)
   ├─ ui/                      # Button, Textarea, Select, Spinner, Chip, TextLink, ErrorNotice, StatusNotice 등 공용 UI
   └─ lib/
      ├─ storage.ts            # localStorage 래퍼
      ├─ text.ts               # 하이라이트용 텍스트 유틸
      └─ cn.ts                 # 조건부 className 유틸
docs/
├─ ARCHITECTURE.md             # 구조, 데이터, AI 제공자, API, 기술 스택
├─ CONVENTIONS.md              # 코드, 커밋, 브랜치 규칙
├─ DESIGN.md                   # 색상, 레이아웃, 문구, 접근성
└─ DEVELOPMENT.md              # 명령어, 환경 변수
AGENTS.md                      # 작업 규칙, 상황별로 읽을 문서 안내
CLAUDE.md                      # 프로젝트 범위
.coderabbit.yaml               # CodeRabbit 코드 리뷰 설정
.github/
├─ pull_request_template.md    # PR 본문 템플릿
└─ workflows/ci.yml            # GitHub Actions 검사
README.md                      # 프로젝트 소개, 실행 방법
```

- FSD(Feature-Sliced Design)를 따른다. 레이어는 위에서부터 `views` → `widgets` → `features` → `entities` → `shared` 순서다. FSD의 pages 레이어는 Next.js의 `src/pages`(Pages Router)와 겹치지 않도록 `views`라고 부른다.
- 레이어는 **자기보다 아래 레이어만** import한다. 같은 레이어의 다른 슬라이스(예: `features/a` → `features/b`)도 import하지 않는다.
- `app`은 라우트 파일만 둔다. 화면은 `views`의 페이지 컴포넌트를 내보내기만 하고, `metadata`처럼 Next.js가 요구하는 것만 직접 쓴다.
- `views`는 `widgets`를 조립만 한다. 페이지 여백(`<main>`)은 모든 페이지가 같아서 `app/layout.tsx`가 맡는다.
- `widgets`는 `features`와 `entities`를 조립한 화면 블록이다. 여러 feature에 걸친 상태(예: 생성 결과 저장)는 widget에서 잇는다.
- `features`는 사용자 행동(카드 만들기 등) 하나를 맡는다.
- `entities`는 도메인 데이터(타입, 스키마, 저장소)와 그것을 보여 주는 UI를 둔다.
- 슬라이스 안은 `ui`, `model`, `config` 세그먼트로 나눈다. `index.ts`(public API)는 두지 않고 세그먼트 파일을 바로 import한다. 서버 코드가 barrel을 거쳐 클라이언트 컴포넌트까지 불러오지 않게 하기 위해서다.
- 예외로 `shared/icons`만 `index.ts` barrel을 둔다(`import { FlipIcon } from "@/shared/icons"`). 아이콘은 상태 없는 SVG라 어디서 불러도 안전하다.
- SVG는 컴포넌트 안에 인라인으로 쓰지 않고 `shared/icons`에 아이콘 컴포넌트로 만들어 쓴다. 아이콘은 `className`만 받고 `aria-hidden`을 고정하며, 색은 `currentColor`로 주변 글자색을 따른다.
- 도메인을 모르는 공통 UI는 `shared/ui`, 유틸은 `shared/lib`에 둔다. `shared`는 다른 레이어와 `ai`를 import하지 않는다.
- `ai`는 FSD 레이어 밖에 둔다. `ai`는 `entities/word-card`의 타입·스키마·예시 글을 가져다 쓰고, 화면 코드는 `ai/errors.ts`와 `ai/types.ts`만 가져다 쓴다. 제공자(`ai/index.ts`, `ai/providers/*`)는 `server-only`라 화면에서 import하지 않는다.

## 2. 데이터 타입

적용: `src/entities/word-card/model/types.ts`, `schema.ts`, `src/ai/types.ts`

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

적용: `src/ai/**`

### 공통
- 모든 제공자는 같은 프롬프트(`prompts.ts`), JSON 스키마(`cardJsonSchema.ts`), 후처리(`postprocess.ts`)를 쓴다.
- 프롬프트는 `prompts.ts`, 호출 설정은 `providers/*`가 원본이다.
- JSON 스키마는 `src/entities/word-card/model/schema.ts`의 zod 스키마에서 만들어 한 곳에서만 관리한다.
- 스트리밍 없이 응답 한 번으로 받고, 기다리는 동안 스켈레톤 카드를 보여 준다.

### mock
- 입력이 `demoArticles.ts`의 예시 글과 같으면 미리 만든 카드를 그대로 돌려준다.
- 그 외의 글은 규칙(공백·문장부호로 분리, 기능어 제외, 소문자 기준 중복 제거)으로 단어를 뽑아 데모용 카드를 만든다. 어떤 글을 넣어도 하이라이트와 카드 UI를 확인할 수 있게 하기 위해서다.
  - `meaning`: `"(데모) 실제 뜻은 AI 연결 후 표시돼요"`
  - `context`: 해당 단어가 들어간 원문 문장
- 실제 AI처럼 느껴지도록 800~1,500ms 지연을 준다.
- 입력이 `!error:<코드>`로 시작하면 (`!error:RATE_LIMITED`) 해당 에러를 던진다. **mock에서만 동작한다.**

## 4. `POST /api/cards`

적용: `src/app/api/**`, `src/ai/errors.ts`, API를 호출하는 화면 코드

- 요청: `{ text: string; language: string }`
- 성공 (200): `{ cards: GeneratedCard[]; provider: "mock" | "gemini" }`
- 실패: `{ error: { code: ErrorCode; message: string } }` (`message`는 사용자에게 보여 줄 한국어)
- 응답의 `provider`가 `"mock"`이면 결과 제목 옆에 "데모 모드" 배지를 보여 준다.
- `fetch` 자체가 실패하면(서버에 닿지 못함) 에러 코드 없이 화면에서 "요청 실패" 상태로 따로 안내한다. 응답 형식이 다르면 `AI_ERROR` 문구를 쓴다.
- `RATE_LIMITED`와 `TOO_MANY_REQUESTS`는 응답의 `message` 대신 화면이 정한 상태 안내 상자로 보여 준다. 해결 방법이 달라서다(내일 다시 / 잠시 후 다시). 나머지 코드는 응답의 `message`를 그대로 보여 준다.

| code | HTTP | 상황 |
|---|---|---|
| `INVALID_INPUT` | 400 | 빈 텍스트, 지원하지 않는 언어 |
| `TEXT_TOO_LONG` | 413 | 3,000자 초과 |
| `RATE_LIMITED` | 429 | AI 하루 사용 한도 초과 |
| `TOO_MANY_REQUESTS` | 503 | AI 분당 요청 한도 초과, 또는 AI 서버 과부하 |
| `AI_ERROR` | 502 | AI API 호출 실패 |
| `PARSE_ERROR` | 502 | 응답 검증 실패 (1회 재시도 후) |

## 5. 예시 글

적용: `src/entities/word-card/config/demoArticles*`

- `demoArticles.ts`에는 영어 예시 글 3개(짧은 문장 / 숙어가 많은 글 / 뉴스 한 단락)와 **손으로 검수한 카드 결과**를 둔다.
- 예시 글을 고르면 **API를 호출하지 않고** 클라이언트에서 바로 결과를 보여 준다. 입력창에도 예시 글을 채워, 고쳐서 다시 담아 볼 수 있게 한다. 배포 후에도 비용 없이 체험할 수 있게 하기 위해서다.
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
| 저장 | localStorage (`src/shared/lib/storage.ts`를 통해서만 접근) |
| 테스트 | **Jest** + React Testing Library (`next/jest`로 설정) |
| 린트·포맷 | ESLint + Prettier (import 순서는 `eslint-plugin-import-x`로 검사) |
| 패키지 매니저 | pnpm |
| 배포 | Vercel (Hobby 플랜) |
| 방문 통계 | Vercel Web Analytics (`@vercel/analytics`) |
