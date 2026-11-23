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

const GERMAN = `
der die das den dem des ein eine einen einem einer eines kein keine keinen keinem keiner keines
ich mich mir du dich dir er ihn ihm sie es wir uns ihr euch ihnen man sich
mein meine meinen meinem meiner meines dein deine deinen deinem deiner deines
sein seine seinen seinem seiner seines ihre ihren ihrem ihrer ihres
unser unsere unseren unserem unserer unseres euer eure euren eurem eurer eures
dieser diese dieses diesen diesem jener jene jenes jenen jenem
wer wen wem wessen was welcher welche welches welchen welchem
jemand niemand etwas nichts
und oder aber denn sondern weil dass ob wenn als während obwohl damit bevor nachdem bis seit wie wo
in im ins an am ans auf aus bei beim mit nach von vom zu zum zur für gegen ohne um durch über unter vor
hinter neben zwischen wegen trotz statt
bin bist ist sind seid war warst waren wart gewesen
habe hast hat haben habt hatte hattest hatten hattet gehabt
werde wirst wird werden werdet wurde wurden geworden
kann kannst können könnt konnte konnten könnte könnten muss musst müssen müsst musste mussten
soll sollst sollen sollt sollte sollten will willst wollen wollt wollte wollten
darf darfst dürfen dürft durfte durften mag magst mögen mögt mochte mochten möchte möchten
nicht nein
`;

function toWordSet(words: string): Set<string> {
  return new Set(words.trim().split(/\s+/));
}

// 일본어는 조사가 단어에 붙어 있어 목록으로 거를 수 없으므로 두지 않는다
const FUNCTION_WORDS = new Map([
  ["영어", toWordSet(ENGLISH)],
  ["독일어", toWordSet(GERMAN)],
]);

export function isFunctionWord(word: string, language: string): boolean {
  const normalized = word.toLowerCase().replaceAll("’", "'");
  return FUNCTION_WORDS.get(language)?.has(normalized) ?? false;
}
