# 싹싹단어 (SsakSsak Words)

> 글 속 단어를 **싹싹** 쓸어 담아, 남김없이 **싹싹** 외운다.

외국어 글을 붙여넣으면 학습할 단어를 뽑아 **문맥에 맞는 뜻과 예문이 담긴 카드**로 만들어 주는 웹 앱입니다.

## 주요 기능

- **단어 카드 만들기**: 영어·일본어·독일어 글(최대 3,000자)에서 단어와 숙어를 최대 40개까지 뽑습니다.
- **카드 뒤집기**: 앞면은 단어와 품사, 뒷면은 문맥상 뜻, 원문 문장, 새 예문과 번역입니다.
- **원문 하이라이트**: 원문에서 단어를 누르면 해당 카드로 이동합니다.
- **담은 단어 모아보기**: 만든 카드는 브라우저에 자동으로 저장됩니다.
- **예시 글로 체험하기**: AI를 호출하지 않고 미리 만든 카드를 바로 볼 수 있습니다.

## 기술 스택

| 영역 | 사용 기술 |
|---|---|
| 프레임워크 | Next.js (App Router), React, TypeScript |
| 스타일 | Tailwind CSS, Pretendard |
| AI | Google Gemini (`@google/genai`, 구조화 출력) |
| 검증 | zod |
| 테스트 | Jest, React Testing Library |
| 배포 | Vercel, Vercel Web Analytics |

## 설계에서 신경 쓴 점

- **바꿔 끼울 수 있는 AI 제공자**: mock과 Gemini가 같은 인터페이스를 쓰도록 했습니다. 화면은 `/api/cards`만 호출하고, API 키 없이도 앱 전체가 mock으로 동작합니다.
- **AI 응답을 믿지 않기**: zod로 검증하고, 형식이 틀리면 한 번만 다시 요청하도록 했습니다. JSON 스키마는 zod 스키마에서 만들어 서로 어긋나지 않습니다.
- **이유에 맞는 에러 안내**: 하루 한도 초과, 요청이 몰린 상황, 그 밖의 실패를 구분해서 안내하도록 했습니다. 과부하(503)일 때만 자동으로 다시 시도합니다.
- **사용자 글 보호**: 서버 로그에 원문과 키를 남기지 않고, Gemini에 대화를 보관하지 않도록 요청했습니다(`store: false`).
- **접근성**: 키보드로 카드를 뒤집을 수 있고, 운영체제의 동작 줄이기 설정을 켜면 회전 대신 페이드로 바뀌도록 했습니다.

## 실행하기

Node.js 22 이상과 pnpm이 필요합니다.

```bash
pnpm install
pnpm dev
```

http://localhost:3000 을 열면 **데모 모드(mock)** 로 동작합니다.

### Gemini 연결하기

```bash
cp .env.example .env.local
```

| 변수 | 설명 |
|---|---|
| `AI_PROVIDER` | `gemini` 또는 `mock` |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey)에서 발급한 키 (서버 전용) |
| `GEMINI_MODEL` | 모델 이름 (예: `gemini-3.5-flash-lite`) |

하나라도 비어 있으면 mock으로 동작합니다. `GEMINI_API_KEY`에 `NEXT_PUBLIC_`을 붙이면 안 됩니다.

> Gemini 무료 티어로 보낸 글은 Google 제품 개선에 사용될 수 있습니다. 개인정보가 담긴 글은 넣지 않아야 합니다.

### 명령어

```bash
pnpm lint        # ESLint
pnpm typecheck   # 타입 검사
pnpm test        # Jest
pnpm build       # 프로덕션 빌드
pnpm format      # Prettier
```

## 문서

- [CLAUDE.md](./CLAUDE.md): 프로젝트 범위
- [AGENTS.md](./AGENTS.md): AI 에이전트의 작업 규칙, 상황별로 읽을 문서 안내
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md): 폴더 구조, 데이터, AI 제공자, API, 기술 스택
- [docs/DESIGN.md](./docs/DESIGN.md): 색상, 레이아웃, 문구, 접근성
- [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md): 명령어, 환경 변수
- [docs/CONVENTIONS.md](./docs/CONVENTIONS.md): 코드, 커밋, 브랜치 규칙
