export type HighlightTarget = { id: string; word: string };

export type TextSegment = { text: string; targetId?: string };

const REGEX_SPECIAL_CHARACTERS = /[.*+?^${}()|[\]\\/]/g;

// 띄어쓰기 없이 쓰는 문자는 단어 앞뒤에 다른 글자가 바로 붙으므로 경계를 검사하지 않는다
const UNSPACED_SCRIPT = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;

export function splitByTargets(text: string, targets: HighlightTarget[]): TextSegment[] {
  const idByWord = new Map<string, string>();
  for (const { id, word } of targets) {
    const key = normalize(word);
    if (key !== "" && !idByWord.has(key)) idByWord.set(key, id);
  }

  if (text === "") return [];
  if (idByWord.size === 0) return [{ text }];

  return text
    .split(createTargetPattern([...idByWord.keys()]))
    .map((part, index) => {
      // 캡처 그룹이 있는 split은 홀수 번째에 일치한 부분을 담는다
      const isMatch = index % 2 === 1;
      return isMatch ? { text: part, targetId: idByWord.get(normalize(part)) } : { text: part };
    })
    .filter((segment) => segment.text !== "");
}

function createTargetPattern(words: string[]): RegExp {
  // 숙어가 그 안의 짧은 단어보다 먼저 일치하도록 긴 것부터 둔다
  const alternatives = words.toSorted((a, b) => b.length - a.length).map(toPattern);
  return new RegExp(`(${alternatives.join("|")})`, "giu");
}

function toPattern(word: string): string {
  const characters = [...word];
  const escaped = word.replace(REGEX_SPECIAL_CHARACTERS, "\\$&").replaceAll(" ", "\\s+");
  const before = needsBoundary(characters[0]) ? "(?<![\\p{L}\\p{M}\\p{N}])" : "";
  const after = needsBoundary(characters[characters.length - 1]) ? "(?![\\p{L}\\p{M}\\p{N}])" : "";
  return `${before}${escaped}${after}`;
}

function needsBoundary(character: string): boolean {
  return /[\p{L}\p{M}\p{N}]/u.test(character) && !UNSPACED_SCRIPT.test(character);
}

function normalize(word: string): string {
  return word.trim().replace(/\s+/g, " ").toLowerCase();
}
