import { DEMO_ARTICLES } from "@/features/word-card/demo/demoArticles";
import { MAX_WORDS } from "@/lib/ai/postprocess";
import { mockProvider } from "@/lib/ai/providers/mock";

const MAX_DELAY_MS = 1500;

async function generate(text: string, language = "영어") {
  const promise = mockProvider.generateCards({ text, language });
  await jest.advanceTimersByTimeAsync(MAX_DELAY_MS);
  return promise;
}

async function generateWords(text: string, language = "영어") {
  const cards = await generate(text, language);
  return cards.map(({ word }) => word);
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

describe("예시 글", () => {
  it.each(DEMO_ARTICLES)("$label: 미리 만든 카드를 id 없이 돌려준다", async ({ cardSet }) => {
    const cards = await generate(`\n${cardSet.sourceText} `);

    expect(cards).toHaveLength(cardSet.cards.length);
    expect(cards.map((card, index) => ({ ...card, id: cardSet.cards[index].id }))).toEqual(
      cardSet.cards,
    );
    expect(cards[0]).not.toHaveProperty("id");
  });
});

describe("그 외의 글", () => {
  it("기능어와 숫자를 빼고 처음 나온 순서대로 단어를 뽑는다", async () => {
    expect(
      await generateWords("The weather is gorgeous today, and he ran 10km in 2 hours."),
    ).toEqual(["weather", "gorgeous", "today", "ran", "hours"]);
  });

  it("대소문자만 다른 단어는 처음 나온 형태 하나로 묶는다", async () => {
    const cards = await generate("Running helps. I love running.");
    expect(cards.map(({ word, lemma }) => [word, lemma])).toEqual([
      ["Running", "running"],
      ["helps", "helps"],
      ["love", "love"],
    ]);
  });

  it("context에 단어가 들어간 원문 문장을 그대로 담는다", async () => {
    const cards = await generate('It costs 3.5 dollars. "Really?"\nShe  laughed!');
    expect(cards.map(({ word, context }) => [word, context])).toEqual([
      ["costs", "It costs 3.5 dollars."],
      ["dollars", "It costs 3.5 dollars."],
      ["Really", '"Really?"'],
      ["laughed", "She  laughed!"],
    ]);
  });

  it("축약형 기능어는 빼고 하이픈으로 이은 단어는 유지한다", async () => {
    expect(await generateWords("I don’t like 'well-known' places--they're noisy.")).toEqual([
      "like",
      "well-known",
      "places",
      "noisy",
    ]);
  });

  it("데모용 안내 문구를 채운다", async () => {
    const [card] = await generate("Hello");
    expect(card.meaning).toBe("(데모) 실제 뜻은 AI 연결 후 표시돼요");
  });

  it("담을 단어가 없으면 빈 배열을 돌려준다", async () => {
    expect(await generate("I am in it.")).toEqual([]);
  });

  it("최대 카드 수를 넘지 않는다", async () => {
    const text = Array.from(
      { length: MAX_WORDS + 10 },
      (_, index) => `word${"x".repeat(index)}`,
    ).join(" ");
    expect(await generate(text)).toHaveLength(MAX_WORDS);
  });

  it("독일어와 일본어 글에서도 카드를 만든다", async () => {
    expect(await generateWords("Das Mädchen ist auf der Straße.", "독일어")).toEqual([
      "Mädchen",
      "Straße",
    ]);
    expect(await generateWords("天気がいい。散歩しよう。", "일본어")).toEqual([
      "天気がいい",
      "散歩しよう",
    ]);
  });
});

describe("에러 요청", () => {
  it.each(["INVALID_INPUT", "TEXT_TOO_LONG", "RATE_LIMITED", "AI_ERROR", "PARSE_ERROR"])(
    "!error:%s이면 해당 에러를 던진다",
    async (code) => {
      const promise = mockProvider.generateCards({ text: `!error:${code}`, language: "영어" });
      const expectation = expect(promise).rejects.toMatchObject({ code });
      await jest.advanceTimersByTimeAsync(MAX_DELAY_MS);
      await expectation;
    },
  );

  it("모르는 코드는 일반 글로 다룬다", async () => {
    expect(await generateWords("!error:UNKNOWN")).toEqual(["error", "UNKNOWN"]);
  });
});

describe("지연", () => {
  it.each([
    [0, 800],
    [1, 1500],
  ])("Math.random이 %d이면 %dms 뒤에 응답한다", async (random, delay) => {
    jest.spyOn(Math, "random").mockReturnValue(random);
    const handleDone = jest.fn();
    void mockProvider.generateCards({ text: "Hello", language: "영어" }).then(handleDone);

    await jest.advanceTimersByTimeAsync(delay - 1);
    expect(handleDone).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(1);
    expect(handleDone).toHaveBeenCalledTimes(1);
  });
});
