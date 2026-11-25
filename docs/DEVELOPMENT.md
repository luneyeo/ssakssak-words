# DEVELOPMENT

AI 에이전트용 명령어·환경 변수 명세. 어떤 장을 읽을지는 `AGENTS.md`를 따른다.

## 1. 명령어

적용: `package.json`의 `scripts`, 실행·검사

```bash
pnpm dev           # 개발 서버
pnpm build         # 프로덕션 빌드
pnpm lint          # ESLint
pnpm typecheck     # tsc --noEmit
pnpm test          # Jest
pnpm format        # Prettier로 고치기
pnpm format:check  # Prettier 검사만
```

- CI(`.github/workflows/ci.yml`)는 `main` push와 `main` 대상 PR에서 lint, format:check, test, build, typecheck를 실행한다.

## 2. 환경 변수

적용: `.env.example`, `src/lib/ai/index.ts`, 환경 변수를 읽는 코드

```bash
AI_PROVIDER=mock     # mock | gemini (기본값 mock)

# gemini를 쓸 때
GEMINI_API_KEY=      # 서버 전용
GEMINI_MODEL=        # 필수, 코드에 기본값 없음 (예: gemini-3.5-flash-lite)
```

- `AI_PROVIDER`가 없거나, 키 또는 `GEMINI_MODEL`이 비어 있으면 **mock으로 동작**해야 한다. 키 없이도 앱 전체가 실행되어야 한다.
- 키 보호 규칙은 `AGENTS.md` 1장 5번을 따른다.
