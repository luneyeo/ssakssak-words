# AGENTS

AI 에이전트의 작업 규칙과, 상황별로 읽을 문서를 정한다. 모든 작업 전에 이 파일을 먼저 읽는다.

## 1. 작업 규칙

1. **계획 먼저**: 작업을 시작하기 전에 무엇을 어떤 순서로 할지 짧게 계획을 보여 준다.
2. **범위 지키기**: 요청받은 범위만 작업한다. `CLAUDE.md` 1장의 "이후 범위" 기능은 만들지 않는다.
3. **의존성 확인**: `docs/ARCHITECTURE.md` 6장에 없는 패키지를 추가하기 전에 이유를 설명하고 확인을 받는다.
4. **최신 문서 확인**: Gemini SDK(`@google/genai`)의 호출 방식과 모델 이름은 자주 바뀐다. Gemini 호출을 바꿀 때는 구현 전에 공식 문서(ai.google.dev)의 최신 구조화 출력(structured output) 예제를 확인한다. 공식 문서와 저장소 문서가 다르면 공식 문서를 따르되 그 사실을 보고한다.
5. **비밀 정보 보호**: `.env*` 파일의 값을 읽거나 출력하거나 커밋하지 않는다. `.gitignore`에 `.env*.local`이 있는지 확인한다.
    - API 키에 `NEXT_PUBLIC_` 접두사를 **절대** 붙이지 않는다.
    - 키는 `.env.local`에만 둔다. 셸 설정 파일(`.zshrc` 등)에 `export`하지 않는다.
    - `.env.example`에는 키 이름만 적고 값은 비워 둔다.
6. **완료 기준**: 작업을 끝내기 전에 `pnpm lint && pnpm typecheck && pnpm test && pnpm build`를 실행하고, 모두 통과한 결과를 보고한다.
7. **커밋은 요청받았을 때만**: 사용자가 요청하기 전에는 커밋하거나 push하지 않는다. 작업이 끝나면 변경을 커밋 전 상태로 두고 보고한다. 커밋을 요청받으면 `docs/CONVENTIONS.md` 5장에 따라 의미 있는 단위로 나눈다.
8. **추측 금지**: 요구사항이 모호하거나 `AGENTS.md`, `CLAUDE.md`, `docs/`의 문서와 충돌하면 추측하지 말고 질문한다.
9. **문서 동기화**: 구조, 명령어, 규칙이 바뀌면 `AGENTS.md`, `CLAUDE.md`, `docs/` 중 해당 문서도 함께 수정한다. 문서를 추가하거나 이름을 바꾸면 2장의 표, README의 문서 목록, `.coderabbit.yaml`도 맞춘다.
10. **보고 형식**: 작업이 끝나면 아래 형식으로 보고한다.
    - 한 일
    - 바뀐 파일
    - 확인 방법 (직접 눌러 볼 수 있는 순서)
    - 남은 이슈나 다음 단계 제안

## 2. 상황별로 읽을 문서

작업을 시작하기 전에 해당하는 행을 **모두** 찾아 읽는다. 이미 읽은 내용은 다시 읽지 않는다.

| 상황 | 읽을 곳 |
|---|---|
| 모든 작업 | `CLAUDE.md` 1장 |
| 명령어를 실행하거나 바꿀 때 | `docs/DEVELOPMENT.md` 1장 |
| 환경 변수나 제공자 선택(`src/lib/ai/index.ts`)을 다룰 때 | `docs/DEVELOPMENT.md` 2장 |
| 패키지를 추가하거나 도구를 바꿀 때 | `docs/ARCHITECTURE.md` 6장 |
| 파일을 추가·이동하거나 이름을 바꿀 때 | `docs/ARCHITECTURE.md` 1장 |
| `src/`의 TypeScript 코드를 만들거나 고칠 때 | `docs/CONVENTIONS.md` 1장 |
| 컴포넌트(`*.tsx`)나 훅을 만들거나 고칠 때 | `docs/CONVENTIONS.md` 2장, `docs/DESIGN.md` 1~5장 |
| 색상 토큰이나 `globals.css`를 고칠 때 | `docs/DESIGN.md` 1장, 2장 |
| 사용자에게 보이는 문구를 고칠 때 (에러 메시지 포함) | `docs/DESIGN.md` 4장 |
| `src/app/api/`, `src/lib/ai/`를 고치거나 API 키·서버 로그를 다룰 때 | `docs/CONVENTIONS.md` 3장, `docs/ARCHITECTURE.md` 3장, 4장 |
| 타입이나 zod 스키마를 바꿀 때 | `docs/ARCHITECTURE.md` 2장 |
| 화면에서 `/api/cards`를 호출하거나 응답을 다룰 때 | `docs/ARCHITECTURE.md` 4장 |
| 예시 글 데이터를 바꿀 때 | `docs/ARCHITECTURE.md` 5장 |
| 테스트나 Jest 설정을 고칠 때, 테스트가 필요한 코드를 추가할 때 | `docs/CONVENTIONS.md` 4장 |
| 커밋을 요청받았을 때, PR 제목을 쓸 때 | `docs/CONVENTIONS.md` 5장 |
| 파일을 수정하기 전, push를 요청받았을 때 | `docs/CONVENTIONS.md` 6장 |

- 코드·구조·디자인 규칙은 위 문서에만 적고 이 파일에는 적지 않는다.
- 문서의 장을 추가하거나 번호를 바꾸면 이 표도 함께 고친다.
