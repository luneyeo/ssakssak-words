import "server-only";

const ENGLISH = `
a an the
i me my mine myself you your yours yourself yourselves he him his himself she her hers herself
it its itself we us our ours ourselves they them their theirs themselves
this that these those who whom whose which what
someone somebody something anyone anybody anything everyone everybody everything no one nobody nothing
and or but nor so yet for because although though while if unless until since when where whether as than
of in on at by to from with without about into onto over under between among through during before after
above below up down out off against toward towards across along around behind beside near within upon
am is are was were be been being do does did have has had having
can could will would shall should may might must
not no
i'm you're he's she's it's we're they're i've you've we've they've i'd you'd he'd she'd we'd they'd
i'll you'll he'll she'll it'll we'll they'll that's there's what's who's let's
don't doesn't didn't isn't aren't wasn't weren't haven't hasn't hadn't
can't couldn't won't wouldn't shouldn't mustn't
`;

const SPANISH = `
el la los las lo un una unos unas al del
yo tú él ella ello usted nosotros nosotras vosotros vosotras ellos ellas ustedes
me te se nos os le les mi mis tu tus su sus nuestro nuestra nuestros nuestras
este esta esto estos estas ese esa eso esos esas aquel aquella aquellos aquellas
que quien quienes cual cuales qué quién cuál
y e o u pero sino ni porque si aunque cuando como donde mientras pues
a ante bajo con contra de desde durante en entre hacia hasta para por según sin sobre tras
soy eres es somos sois son era eras éramos eran fue fueron ser sido
estoy estás está estamos estáis están estaba estaban estar
he has ha hemos habéis han había habían haber
no
`;

function toWordSet(words: string): Set<string> {
  return new Set(words.trim().split(/\s+/));
}

// 일본어는 조사가 단어에 붙어 있어 목록으로 거를 수 없으므로 두지 않는다
const FUNCTION_WORDS = new Map([
  ["영어", toWordSet(ENGLISH)],
  ["스페인어", toWordSet(SPANISH)],
]);

export function isFunctionWord(word: string, language: string): boolean {
  const normalized = word.toLowerCase().replaceAll("’", "'");
  return FUNCTION_WORDS.get(language)?.has(normalized) ?? false;
}
