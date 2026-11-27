# CONVENTIONS

AI 에이전트용 코드·커밋·브랜치 규칙. 어떤 장을 읽을지는 `AGENTS.md`를 따른다.

## 1. 코드 공통

적용: `src/**/*.{ts,tsx}`

### TypeScript
- `any` 금지. 모르는 값은 `unknown`으로 받고 zod나 타입 가드로 좁힌다.
- 외부 데이터(AI 응답, localStorage, 요청 body, API 응답)는 항상 zod로 검증한다. `as` 단언으로 대신하지 않는다.
- 객체 모양은 `type`으로 정의한다. `interface` 금지.
- 타입만 가져올 때는 별도의 `import type` 문을 쓴다.
- localStorage는 `src/shared/lib/storage.ts`를 통해서만 접근한다.

### 네이밍
- 컴포넌트 파일·이름: PascalCase (`WordCard.tsx`)
- 훅: `use` + camelCase (`useSavedCards.ts`)
- 함수·변수: camelCase (`splitByTargets`)
- 상수: UPPER_SNAKE_CASE (`MAX_TEXT_LENGTH`)
- Props 타입: `컴포넌트명Props` (`WordCardProps`)
- boolean: `is`, `has`, `can`으로 시작 (`isFlipped`)
- 이벤트 핸들러: 정의는 `handle~`, props는 `on~` (`handleFlip`, `onFlip`)

### import
- 순서: ① React·Next.js·`server-only` ② 외부 라이브러리 ③ `@/` 내부 모듈 ④ 상대 경로
- 그룹 사이에 빈 줄 하나. ESLint `import-x/order`가 검사한다.
- 경로 별칭: `@/` → `src/`

### 주석
- 한국어로, **무엇**이 아니라 **왜**를 쓴다.
- 코드를 그대로 읽어 주는 주석 금지.
- 좋음: `// 항목 하나가 깨졌다고 나머지까지 잃지 않도록 하나씩 검증한다`
- 나쁨: `// 배열을 돌면서 safeParse를 호출한다`

## 2. 화면

적용: `src/**/*.tsx`, `src/**/model/use*.ts`

### 컴포넌트
- 함수 선언문 + named export (`export function WordCard() {}`). default export는 Next.js가 요구하는 파일(`page.tsx`, `layout.tsx`)에서만 쓴다.
- 기본은 서버 컴포넌트. 상태나 이벤트가 필요한 컴포넌트에만 `"use client"`를 붙인다.
- 한 파일에 컴포넌트 하나. 150줄이 넘으면 나눌지 검토한다.
- 로직은 훅으로 분리하고, 컴포넌트는 화면을 그리는 데 집중한다.
- AI 제공자를 직접 import하지 않고 `/api/cards`만 호출한다.

### 상태 불변성
- state 직접 수정 금지: `push`, `splice`, `sort`, `reverse`, `obj.key = value`
- 새 배열을 반환한다: `[...arr, x]`, `filter`, `map`, `toSorted`
- 중첩 객체는 바뀐 경로만 단계마다 얕은 복사한다 (구조적 공유). `structuredClone`으로 state 전체를 깊은 복사하지 않는다.

```ts
// 바뀐 세트와 카드만 새로 만들고 나머지는 공유한다
cardSets.map((set) =>
  set.id === setId
    ? { ...set, cards: set.cards.map((card) => (card.id === cardId ? { ...card, meaning } : card)) }
    : set,
);
```

### 최적화
- `useMemo`, `useCallback`은 memo된 자식에게 객체나 함수를 넘길 때만 쓴다. 근거 없는 최적화 금지.

### 스타일
- Tailwind 유틸리티 클래스만 쓴다. 인라인 `style`은 애니메이션 값처럼 꼭 필요할 때만 쓴다.
- 조건부 클래스는 `cn()`(`src/shared/lib/cn.ts`)을 쓴다.
- 색상은 `docs/DESIGN.md` 1장의 디자인 토큰만 쓴다. hex 값과 Tailwind 기본 색상 금지.

## 3. 서버와 보안

적용: `src/app/api/**`, `src/ai/**`, 환경 변수, 서버 로그

- `src/ai/providers/*`, `src/ai/index.ts` 첫 줄은 `import "server-only";`
- 클라이언트에서 AI API를 직접 호출하지 않는다. 반드시 `/api/cards`를 거친다.
- API 키에 `NEXT_PUBLIC_` 접두사 금지.
- 서버 로그에 사용자 원문 전체나 API 키를 남기지 않는다. 에러 메시지에 섞일 수 있으므로 에러 코드와 `error.name`만 남긴다.
- 응답에 내부 에러 메시지를 내보내지 않는다. `ERROR_DETAILS`의 안내 문구만 보낸다.
- 제공자별 코드에는 SDK 호출 방식의 차이만 둔다. 프롬프트, 스키마, 후처리는 공통 모듈을 쓴다.
- 제공자 내부 에러는 `CardGenerationError`로 바꿔서 던진다.

## 4. 테스트

적용: `**/*.test.{ts,tsx}`, `jest.config.ts`, `jest.setup.ts`

- Jest + React Testing Library만 쓴다. Vitest 등 다른 러너 설치 금지.
- 설정: `next/jest`, `jsdom` 환경, `jest.setup.ts`에서 `@testing-library/jest-dom`, `moduleNameMapper`에 `@/` 별칭.
- API 라우트 등 서버 환경이 필요한 테스트는 파일 맨 위에 `@jest-environment node`를 적는다.
- 테스트 파일은 대상 옆에 `*.test.ts(x)`로 둔다.
- 단위 테스트 필수: 순수 함수(`shared/lib/text.ts`, `shared/lib/storage.ts`, `ai/postprocess.ts`), zod 스키마, mock 제공자
- `demoArticles.ts`가 zod 스키마를 통과하는지 테스트한다.
- 컴포넌트는 핵심 상호작용(카드 뒤집기, 폼 제출, 예시 글 선택, 에러 표시)만 테스트한다.
- 실제 AI API 호출 금지. Gemini는 `jest.mock`으로 SDK를 대체한다.
- 테스트 이름은 한국어로, 기대하는 동작을 "~한다" 체로 쓴다 (`it("해당 세트만 지운다")`).
- 입력만 다른 경우는 `it.each`로 묶는다.

## 5. 커밋

적용: 커밋, PR 제목

### 원칙
- 사용자가 요청했을 때만 커밋한다. 커밋 요청은 push 요청이 아니다.
- 커밋 하나에 목적 하나.
- `.env*`의 값은 커밋하지 않는다 (키 이름만 있는 `.env.example`은 예외).

### 메시지
- 형식: `종류: 한국어 설명` (Conventional Commits)
- 종류는 소문자. 설명은 명사로 끝내고 마침표를 찍지 않는다.
- 파일 이름보다 무엇이 달라졌는지를 쓴다.

| 종류 | 쓰는 때 | 예 |
|---|---|---|
| `feat` | 기능 추가·변경 | `feat: 단어 카드 뒤집기 애니메이션 추가` |
| `fix` | 버그 수정 | `fix: 활용형 단어가 중복 생성되는 문제 수정` |
| `refactor` | 동작은 그대로, 구조만 개선 | `refactor: 카드 저장 로직을 훅으로 분리` |
| `style` | 동작과 무관한 포맷 수정 (화면 디자인 변경은 `feat`·`fix`) | `style: Prettier 포맷 적용` |
| `test` | 테스트만 추가·수정 | `test: 후처리 중복 제거 테스트 추가` |
| `docs` | 문서만 수정 | `docs: README 작성` |
| `chore` | 패키지, 설정 등 나머지 | `chore: zod와 server-only 추가` |

### 나누는 순서
1. `chore`: 패키지와 설정
2. `feat`·`fix`: 기능 코드 + 그 기능의 테스트
3. `docs`: 바뀐 구조와 규칙 반영

패키지 추가가 기능의 전부면 `feat` 하나로 묶는다 (`feat: Vercel Analytics 추가`).

### PR 제목
- 형식: `[브랜치명] 내용` (`[chore/#1] GitHub Actions CI와 PR 템플릿 추가`)
- 브랜치명은 6장의 이름 형식을 따르고, 내용은 커밋 설명과 같은 방식으로 쓴다.

## 6. 브랜치

적용: 파일 수정 전, push

- 브랜치는 사용자가 GitHub에서 만든다. 에이전트는 브랜치를 만들지 않는다.
- `main`에서 작업하지 않는다. 현재 브랜치가 `main`이면 파일을 수정하기 전에 사용자에게 알린다.
- push는 사용자가 직접 한다. 에이전트는 요청받았을 때만 push한다.
- 이름 형식: `종류/#이슈번호` (`chore/#1`). 종류는 5장과 같고, 번호는 작업하는 GitHub 이슈의 번호다.
