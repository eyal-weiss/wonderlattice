# Wonderlattice Arabic (ar) glossary and house style

For the room translators. The shared text is done: `src/lang/ar/app.js`, `page.js`, `language.js`. Read those first:
they show every rule below in use. For each room, keep the **Hebrew file of the same room** (`src/lang/he/<room>.js`)
open beside the English. Hebrew has already solved that room's right-to-left problems (which strings need isolates,
where a mark is needed, how canvas labels are ordered, which sources say «(in English)»). Copy its structure, and
translate the meaning from English.

## 1. House style

- **Register.** Modern Standard Arabic, plain and warm, the way a friendly guide would talk. Short sentences. It's
  not a textbook, a lesson, or homework: say «جرّبوا» rather than «قوموا بتجربة», and «لاحظوا» rather than «يُلاحَظ».
- **Addressing the visitor.** Use the plural (أنتم) everywhere: جرّبوا، اسحبوا، انقروا، غيّروا، لاحظوا. For possessives use
  ـكم (نردكم، دربكم، صورتكم). This matches Hebrew's plural and assumes no gender. Avoid adjectives and participles that
  describe the visitor. Use a verb instead: «تريدون معرفة الرياضيات؟» rather than «فضوليون؟», and «كل شيء جاهز للرمي»
  rather than «جاهزون؟». If you can't avoid one, the masculine plural is the inclusive form (as in Hebrew).
- **Buttons vs instructions.** This mirrors `he/app.js`:
  - **Buttons, toggles and links are verbal nouns or nouns**: حفظ هذه اللحظة، إعادة البدء، إيقاف مؤقت، تشغيل، إزالة، نسخ
    هذه التجربة، الاستماع إلى هذه الفكرة، التعرّف إلى شخصية أخرى. «Visit “X”» connection buttons → «زيارة «X»». A button's
    words that a sentence elsewhere quotes must match exactly (see §8).
  - **Instructions, hints, tips, nudges, status messages** use the plural imperative: «انقروا على نرد في الدائرة»،
    «تحقّقوا من الاتصال وحاولوا مجددًا».
  - **Panel headings** (panelEyebrow, presetsTitle) can be either: a short invitation in the imperative (أضيفوا لمستكم،
    جرّبوا إمكانية أخرى) or a noun phrase (أنماط للبداية). Use a verbal noun if the English is a label.
  - **Room names and titles**: an English imperative becomes a verbal noun, like Hebrew's infinitive («الرسم بالحركة»،
    «ثني المستوى»، «إنماء بصمة إصبع»). The `name` and the `title` use the same words; `title` keeps its final «.».
- **The room's own voice ("I").** Some rooms speak in the first person ("I pick mine"). Arabic first-person verbs have
  no gender (أختار، أجد، سأختار), so keep verbs and avoid adjectives about "me".
- **Punctuation.** Arabic comma «،», semicolon «؛», question mark «؟». Full stop and colon as usual. The ellipsis «…»
  stays.
- **Quotation marks** « ». Nested quotes also use « » (they're rare). Never a straight `"` in plain text. Html
  attributes keep their straight quotes as in English.
- **Spelling.** Write the hamzas (أن، إلى، إذا، اقرؤوا), ى vs ي, and ة vs ه correctly. Write tanween fath on the letter
  before alif: «جدًا، أيضًا، شيئًا» (not «جداً»). No full vowelling. A shadda is welcome where it helps reading
  (جرّبوا، غيّروا، تتبّعوا), and so is a single damma for a passive that could be misread (يُفتح، تُحفظ). Prefer «تم + verbal
  noun» for short status messages (تم نسخ الرابط).
- **Eyebrows** (the English is in capitals, e.g. `'COUNTING'`): write plain Arabic. Arabic has no capitals, and CSS
  already turns off letter-spacing for `:lang(ar)` on eyebrows.
- **Sources.** Most links lead to English pages. Add «(بالإنجليزية)» at the end of the link text, as Hebrew does with
  «(באנגלית)»: «مفارقة باروندو (بالإنجليزية)». Translate a descriptive link text. Keep a paper or book title in Latin
  letters inside an isolate (§3).

## 2. Numbers

- **Digits are always Western 0–9.** Use the English decimal point and thousands comma: 0.5، 1,000، 95%. Never ٠–٩ or
  «٫».
- **Format numbers with `toLocaleString('en')`, not `toLocaleString(Wonderlattice.lang)`.** Current Chrome prints
  0–9 for `'ar'`, but browsers with older locale data print ٠١٢٣. `'en'` gives «1,234.5» everywhere. Options still
  work: `x.toLocaleString('en', { maximumFractionDigits: 1 })`.
- **Percent**: «95%» with no space, the % after the number (it stays correct in RTL, no isolate needed).
- **Fractions** like 5/9 and **plain numbers** need no isolate. **Signed numbers** (−5، +0.3، −0.010), ranges with a
  dash, and **number + Latin unit** (2.4 MB، 38 °C، 440 Hz) do: see §3.
- Write a number as a word only where English does ("three dice"). Then the gender rules in §4 apply. Otherwise use
  digits.

## 3. Direction (bidi)

- **Isolates** `⁦ … ⁩` (LRI … PDI) go around anything that must read left to right as one unit: formulas
  (`⁦z → z² + c⁩`), signed numbers and values that may be signed (`⁦${value}⁩`), sequences of Latin
  letters with spaces (`⁦A A B B⁩`), number + unit (`⁦2.4 MB⁩`), trademarks ending in a symbol
  (`⁦Rubik’s Cube®⁩`), and Latin citations (`⁦G. P. Harmer and D. Abbott, “…”, Nature 402 (1999).⁩`).
  Prefer the visible escapes `⁦`/`⁩` over the invisible characters. They work in '…' strings and template
  literals alike.
- **Single Latin words and letters** (A، B، PNG، GitHub، x) need no isolate.
- **Two Latin items separated only by punctuation or spaces** join into one left-to-right run, and an RTL reader sees
  them in the wrong order ("A, B" reads B first). Put an Arabic word between them, «A وB وC», or put RLM `‏` after
  the separator, as Hebrew does («A،‏ B»). The same applies to a number that directly follows a Latin word
  («مع A: ‏34.5%»).
- **Prefix letters on Latin or digits.** «و» attaches directly: «وB»، «و5». Avoid «بـ / لـ / كـ» on a Latin word or a
  number. Rephrase instead: «بنسبة 95%»، «في 49.5% من المرات»، «لموقع Wonderlattice»، «إلى B».
- **Arrows.** Arrow keys stay as they are («اضغطوا ← و→»). An arrow meaning "leads to" in prose points left in RTL:
  English «→» becomes «←», as in Hebrew. The "back to all experiments" arrow is already «→ كل التجارب».
- **Canvas text** is drawn by the room's code. Follow the Hebrew file's order for labels such as `${value} ${name}`
  (Hebrew notes where the chart is left to right). Check the room in the browser.
- The external-link mark «↗» stays as it is (Hebrew keeps it too).

## 4. Numbers with nouns (plural agreement)

Arabic counted nouns change with the number. With digits, the pattern is:

| n (look at n % 100 for the tens) | form                            | example, feminine رمية                            | example, masculine لاعب  |
| -------------------------------- | ------------------------------- | ------------------------------------------------- | ------------------------ |
| 1                                | singular + واحد/واحدة, no digit | رمية واحدة                                        | لاعب واحد                |
| 2                                | dual, no digit                  | رميتان (after a preposition or as object: رميتين) | لاعبان / لاعبين          |
| 3–10, also 103–110 …             | plural                          | 3 رميات                                           | 3 لاعبين                 |
| 11–99, also 111–199 …            | singular, accusative            | 11 رمية                                           | 11 لاعبًا (note the ـًا) |
| 0, 100, 101, 102, 1,000 …        | singular                        | 100 رمية                                          | 100 لاعب                 |

A feminine noun in ة looks the same in the last two rows. A masculine noun gains «ـًا» for 11–99. The dual changes with
its place in the sentence: «ـان/ـتان» as subject or standalone label, «ـين/ـتين» after a preposition (بعد رميتين) or as
object. Pick the form that fits the sentence the function builds.

The worked pattern below passes `scripts/lang-guard.mjs`, which allows a block body of `const` declarations and one
`return`, ternaries, `%`, comparisons, `&&`, and `toLocaleString`:

```js
rolls: (n) => {
  const k = n % 100;
  const shown = n.toLocaleString('en');
  return n === 1
    ? 'رمية واحدة'
    : n === 2
      ? 'رميتان'
      : k >= 3 && k <= 10
        ? `${shown} رميات`
        : `${shown} رمية`;
},
players: (n) => {
  const k = n % 100;
  const shown = n.toLocaleString('en');
  return n === 1
    ? 'لاعب واحد'
    : n === 2
      ? 'لاعبان'
      : k >= 3 && k <= 10
        ? `${shown} لاعبين`
        : k >= 11
          ? `${shown} لاعبًا`
          : `${shown} لاعب`;
},
```

The guard does not allow helper functions defined outside a string, reading properties other than `.length`, or
loops. Repeat the pattern inside each function.

**When a neutral form is fine:** readouts, labels, tallies, aria-labels and canvas captions can avoid agreement:
«عدد الرميات: ${n}»، «الرميات حتى الآن: ${n}»، «الجولة ${t} من ${rounds}». Don't use it in flowing sentences
(verdicts, nudges, insights), where it sounds robotic. Write the agreement there. If a count is fixed and known (the trail
holds 32), you only need the branch that applies, but keep it correct (see `trail.full` in app.js).

**Gender of counted nouns** matters for «واحد/واحدة», the dual, adjectives, and numbers written as words (3–10 take
the _opposite_ gender: ثلاثة أحجار، ثلاث رميات):

| feminine                                                                                                                                                                                                                                                                                                                                        | masculine                                                                                                                                                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| رمية roll, جولة round, مرة time (occurrence), لحظة moment, دورة turn/cycle, خطوة step, ثانية second, دقيقة minute, قطعة نقدية coin, عيّنة sample, خلية cell, بلاطة tile, نقطة point, زاوية angle, ذراع arm (treated as feminine here), سيارة car, صورة picture, حركة move (cube), لعبة game, شبكة network, موجة wave, يراعة firefly, لوحة board | حجر نرد die, لاعب player, فحص test, أنبوب tube, بِت bit, مربع square, عدد number, رقم digit, حرف letter, يوم day, أسبوع week, بكسل pixel, شخص person, سائق driver, طريق road (either gender, use masculine), مستحمّ bather, كاشف detector, كنز treasure, خيط thread, نمط pattern, استطلاع survey, صوت voice/sound |

## 5. The site's own words

| English                                             | Arabic                                          | note                                                                     |
| --------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------ |
| experiment (room bar, "All experiments")            | تجربة، التجارب                                  | «التجربة السابقة/التالية». Also used for "exploration" in stage messages |
| room (in prose: "Every room…", "In the dice room…") | غرفة                                            | «في غرفة النرد» or by the room's name                                    |
| exploration                                         | تجربة / استكشاف                                 | «رابط التجربة»; «استكشاف» for the act of exploring                       |
| trail / My trail                                    | الدرب / دربي                                    | chosen over «مسار», which is kept for mathematical paths                 |
| moment                                              | لحظة                                            |                                                                          |
| Keep this moment (button)                           | ✧ حفظ هذه اللحظة                                |                                                                          |
| thought (on revisiting)                             | خاطرة                                           | «حفظ هذه الخاطرة». A visitor's written **note** is «ملاحظة»              |
| visitor / visiting mathematician (label)            | زيارة من عالم الرياضيات                         | the guest card label. Avoids a gendered «ضيف»                            |
| mathematician                                       | عالِم رياضيات / عالمة رياضيات                   | «التعرّف إلى شخصية أخرى» for "Meet another mathematician"                |
| drawn visitors (sketches)                           | الضيوف المرسومون                                |                                                                          |
| explanation / insight                               | شرح                                             | «إغلاق الشرح»                                                            |
| the "why" button (whyLabel)                         | a question as in English                        | «لماذا يحدث هذا؟», «كيف يمكن لكل نرد أن يخسر؟»                           |
| The mathematics, if you want it (details summary)   | الرياضيات، لمن يريدها                           |                                                                          |
| presets / starting points                           | نقاط انطلاق / أنماط للبداية                     | preset _names_ are short nouns                                           |
| Make it yours                                       | أضيفوا لمستكم                                   |                                                                          |
| A little nudge                                      | اقتراح صغير                                     |                                                                          |
| Start again                                         | إعادة البدء                                     |                                                                          |
| Pause / Play                                        | إيقاف مؤقت / تشغيل                              |                                                                          |
| Turn sound on / Sound on · mute                     | تشغيل الصوت / الصوت يعمل · كتم                  |                                                                          |
| Listen to this idea / Stop narration                | الاستماع إلى هذه الفكرة / إيقاف القراءة الصوتية | narration = القراءة الصوتية                                              |
| Copy this exploration / pattern                     | نسخ هذه التجربة / نسخ هذا النمط                 |                                                                          |
| copy link, link copied                              | نسخ الرابط، تم نسخ الرابط                       |                                                                          |
| Save image / save as PNG                            | حفظ الصورة / حفظ … كصورة PNG                    |                                                                          |
| Surprise me                                         | ✧ مفاجأة                                        | a noun, as Hebrew «הפתעה»                                                |
| Undo / Clear / Repeat                               | تراجع / مسح / تكرار                             |                                                                          |
| Next step                                           | الخطوة التالية                                  |                                                                          |
| optional                                            | اختياري                                         |                                                                          |
| slider                                              | منزلق                                           |                                                                          |
| tap / click                                         | انقروا                                          | one verb for touch and mouse, like Hebrew «הקישו»                        |
| drag                                                | اسحبوا                                          |                                                                          |
| press (a key) / hold                                | اضغطوا / اضغطوا مطوّلًا                         |                                                                          |
| canvas / drawing surface                            | لوحة الرسم                                      | canvasRole = «صورة تفاعلية»                                              |
| (opens in a new tab)                                | (تُفتح في علامة تبويب جديدة)                    |                                                                          |
| (in English) on source links                        | (بالإنجليزية)                                   |                                                                          |
| A little surprise (in `field`)                      | مفاجأة صغيرة                                    | the fields are joined with « · »                                         |
| No scores. No right answers.                        | بلا علامات. بلا إجابات صحيحة.                   |                                                                          |

## 6. Mathematics and everyday terms

| English                                       | Arabic                                           | note                                                                                                                                                               |
| --------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| mathematics / maths                           | الرياضيات                                        |                                                                                                                                                                    |
| probability                                   | الاحتمال (field: الاحتمالات)                     | «نظرية الاحتمالات»                                                                                                                                                 |
| chance (the number) / by chance               | احتمال / صدفة، عشوائيًا                          | "the exact chance is 5/9" → «الاحتمال الدقيق 5/9». Theme: «الصدفة والأدلة»                                                                                         |
| odds                                          | الاحتمالات / فرص                                 | "Change the odds" → «تغيير الاحتمالات»                                                                                                                             |
| random / at random                            | عشوائي / عشوائيًا                                |                                                                                                                                                                    |
| expected (value)                              | متوقَّع / القيمة المتوقعة                        |                                                                                                                                                                    |
| average                                       | المتوسط                                          | «المعدّل» is common for grades. Keep «المتوسط»                                                                                                                     |
| weighted average                              | المتوسط الموزون                                  |                                                                                                                                                                    |
| wobble (random fluctuation)                   | تذبذب                                            |                                                                                                                                                                    |
| share (a proportion)                          | نسبة                                             | «نسبة الفوز», not «حصة»                                                                                                                                            |
| sample / sampling                             | عيّنة / أخذ العيّنات                             | field: «أخذ العيّنات»                                                                                                                                              |
| poll / survey                                 | استطلاع (رأي)                                    | pl. استطلاعات                                                                                                                                                      |
| bias / random error / margin of error         | انحياز / خطأ عشوائي / هامش الخطأ                 |                                                                                                                                                                    |
| test (medical, pooled)                        | فحص، pl. فحوص                                    | «فحص» is the everyday word, as in «فحص كورونا». «اختبار» only for a quiz or trial                                                                                  |
| pool / pooled testing / group testing         | خليط / الفحص المجمَّع / الفحص الجماعي            | "test the pool" → «افحصوا الخليط»; retest → «إعادة الفحص»                                                                                                          |
| tube / well (of a tray)                       | أنبوب / تجويف                                    |                                                                                                                                                                    |
| positive / negative (test)                    | إيجابي / سلبي                                    | false alarm → «إنذار كاذب»                                                                                                                                         |
| detector / beep                               | كاشف / صفير، يُصفِّر                             |                                                                                                                                                                    |
| statistics                                    | الإحصاء                                          |                                                                                                                                                                    |
| network                                       | شبكة                                             |                                                                                                                                                                    |
| graph (nodes and edges)                       | مخطّط                                            | «رسم بياني» is only for a chart of data. Graph colouring → «تلوين المخططات»                                                                                        |
| chart / plot                                  | رسم بياني                                        |                                                                                                                                                                    |
| node / edge (graph)                           | عُقدة / حافة                                     | also «حافة» for the edge of a table, tile or ribbon. A polygon's side is «ضلع»                                                                                     |
| tile / tiling / tessellation                  | بلاطة / تبليط                                    | «فسيفساء» only for mosaic art                                                                                                                                      |
| pattern                                       | نمط، pl. أنماط                                   | «نقشة» is fine for a woven design in the loom                                                                                                                      |
| symmetry                                      | تماثل                                            | «تناظر» competes. Use «تماثل»                                                                                                                                      |
| grid / square / cell                          | شبكة / مربع / خلية                               | sudoku row/column/box → صف / عمود / مربع (صندوق)                                                                                                                   |
| prime (number)                                | عدد أوّلي                                        |                                                                                                                                                                    |
| remainder / clock arithmetic                  | باقي القسمة / حساب الساعة                        | modular arithmetic → «الحساب النمطي»                                                                                                                               |
| secret / key                                  | سرّ / مفتاح                                      | key exchange → «تبادل المفاتيح»                                                                                                                                    |
| signal / bit / noise                          | إشارة / بِت، pl. بِتّات / تشويش                  | «تشويش» for a noisy channel. «ضجيج» only for audible noise                                                                                                         |
| code (error-correcting) / redundancy / parity | شيفرة / زيادة احتياطية / التكافؤ                 | parity bit → «بِت التكافؤ» («الزوجية» competes). Not «التماثل», which is symmetry                                                                                  |
| compression                                   | الضغط                                            |                                                                                                                                                                    |
| wave / frequency / tone                       | موجة / تردد / نغمة                               |                                                                                                                                                                    |
| beats (two tones) / heartbeat                 | ضربات / نبضة قلب                                 |                                                                                                                                                                    |
| ratio                                         | نسبة                                             |                                                                                                                                                                    |
| interference                                  | تداخل                                            |                                                                                                                                                                    |
| chaos / butterfly effect                      | الفوضى / أثر الفراشة                             |                                                                                                                                                                    |
| feedback / delay                              | التغذية الراجعة / تأخير                          |                                                                                                                                                                    |
| stability / stable / settle                   | استقرار / مستقر / يستقر                          |                                                                                                                                                                    |
| equilibrium                                   | توازن                                            | Nash equilibrium → «توازن ناش»                                                                                                                                     |
| paradox                                       | مفارقة                                           | Braess's paradox → «مفارقة برايس»                                                                                                                                  |
| proof / prove                                 | برهان / يبرهن                                    |                                                                                                                                                                    |
| theorem                                       | مبرهنة                                           | keeps «نظرية» for "theory" (number theory → «نظرية الأعداد», game theory → «نظرية الألعاب»). Levant schools say «نظرية فيثاغورس», so a reviewer may prefer «نظرية» |
| invariant                                     | لامتغيّر، pl. لامتغيّرات                         | explain it as «شيء لا يتغيّر مهما فعلتم»                                                                                                                           |
| colouring / colour                            | تلوين / لون                                      |                                                                                                                                                                    |
| dice / die                                    | أحجار النرد / حجر نرد, short: نرد                | "Your die" → «نردكم». "Roll the odd dice" → «رمي أحجار النرد الغريبة»                                                                                              |
| roll (n. / v.)                                | رمية / رمي، يرمي                                 |                                                                                                                                                                    |
| coin                                          | قطعة نقدية، pl. قطع نقدية                        | a coin as a unit of money in a game is still «قطعة نقدية»                                                                                                          |
| game / round / player                         | لعبة / جولة / لاعب                               |                                                                                                                                                                    |
| win / lose / beat                             | يفوز، يربح / يخسر / يغلب                         | «يغلب» for "beats" (dice), «يربح/يخسر» for money                                                                                                                   |
| strategy                                      | استراتيجية                                       |                                                                                                                                                                    |
| circle / curve / loop / path                  | دائرة / منحنى / حلقة / مسار                      | a closed path → «مسار مغلق»                                                                                                                                        |
| plane / complex numbers                       | المستوى / الأعداد المركّبة                       | «العقدية» competes. Use «المركّبة»                                                                                                                                 |
| conformal map / right angle                   | تحويل حافظ للزوايا / زاوية قائمة                 |                                                                                                                                                                    |
| fractal / Julia set / Mandelbrot set          | فراكتال (كسيري) / مجموعة جوليا / مجموعة ماندلبرو | seed → «بذرة»                                                                                                                                                      |
| repetition / iteration                        | تكرار                                            |                                                                                                                                                                    |
| topology / surface / Möbius strip             | الطوبولوجيا / سطح / شريط موبيوس                  | a side of a surface → «وجه»                                                                                                                                        |
| centre of mass / harmonic series              | مركز الكتلة / المتسلسلة التوافقية                | overhang → «البروز»                                                                                                                                                |
| group / order (cube moves)                    | زمرة / رتبة                                      | move → «حركة», sticker → «ملصق»                                                                                                                                    |
| logic / Latin square                          | المنطق / مربع لاتيني                             | clue → «دليل» (sudoku given → «رقم معطى»)                                                                                                                          |
| dynamical system / oscillator / coupled       | نظام ديناميكي / مذبذب / مقترن                    |                                                                                                                                                                    |
| synchrony / fall into step                    | التزامن / تتزامن                                 |                                                                                                                                                                    |
| emergence / flock / crowd / neighbours        | الانبثاق / سرب / حشد / الجيران                   |                                                                                                                                                                    |
| excitable media / spiral wave / resting       | الأوساط القابلة للإثارة / موجة حلزونية / في راحة |                                                                                                                                                                    |
| reaction–diffusion / Turing patterns          | التفاعل والانتشار / أنماط تورينغ                 |                                                                                                                                                                    |
| fingerprint / ridge / whorl, loop, arch       | بصمة إصبع / نتوء، خط / دوّامة، عروة، قوس         |                                                                                                                                                                    |
| weave / loom / thread / cloth / shaft         | نسج / نَوْل / خيط / قماش / إطار                  | a four-shaft loom → «نَوْل بأربعة أطر» (the shaft term needs a native weaver's check). Warp / weft → «السَّدى / اللُّحمة»                                          |
| model / simulation                            | نموذج / محاكاة                                   |                                                                                                                                                                    |
| differential equation / forecast              | معادلة تفاضلية / توقعات الطقس، التنبؤ            |                                                                                                                                                                    |
| function / equation / formula                 | دالّة / معادلة / صيغة                            | «اقتران» is used in Jordan and Palestine. Use «دالّة», as Israeli Arab schools do                                                                                  |
| whole number / rational / irrational          | عدد صحيح / نسبي / غير نسبي                       |                                                                                                                                                                    |
| square root / fraction                        | الجذر التربيعي / كسر                             |                                                                                                                                                                    |
| geometry / engineering                        | الهندسة / الهندسة التطبيقية                      | in Arabic «الهندسة» alone is geometry. The theme is «الهندسة التطبيقية»                                                                                            |
| shower / tap / pipe / bather                  | الدُّش / الحنفية / الأنبوب / المستحمّ            | eager / patient bather → «المستحمّ المتعجّل / الصبور»                                                                                                              |
| road / shortcut / driver / trip               | طريق / الاختصار / سائق / رحلة                    |                                                                                                                                                                    |

## 7. Room names (fixed, because rooms quote each other's names)

Connection buttons and insights name other rooms. Use these exact names and quote them with « ». A room's own `name`
and `title` use the same words.

| id          | English                              | Arabic                                               |
| ----------- | ------------------------------------ | ---------------------------------------------------- |
| blocks      | The leaning tower of blocks          | برج المكعبات المائل                                  |
| compress    | How much picture can you throw away? | كم من الصورة يمكنكم أن ترموا؟                        |
| cube        | Inside the puzzle cube               | داخل مكعّب الألغاز                                   |
| dice        | The dice that beat each other        | أحجار نرد يغلب بعضها بعضًا                           |
| fingerprint | Grow a fingerprint                   | إنماء بصمة إصبع                                      |
| fireflies   | Fireflies that fall into step        | يراعات تومض معًا                                     |
| flock       | A mind of many                       | عقل الجماعة                                          |
| floor       | The impossible floor                 | الأرضية المستحيلة                                    |
| heart       | A heartbeat travels                  | نبضة قلب تسري                                        |
| julia       | A seed for an infinite landscape     | بذرة لمنظر بلا نهاية                                 |
| loom        | The mathematical loom                | النَّول الرياضي                                      |
| motion      | Paint with motion                    | الرسم بالحركة                                        |
| parrondo    | Two losing games that win            | لعبتان خاسرتان تربحان                                |
| plane       | Bend the plane                       | ثني المستوى                                          |
| pools       | A thousand samples, ten tests        | ألف عيّنة وعشرة فحوص                                 |
| ribbon      | Where is the other side?             | أين الوجه الآخر؟ ("The other side" → «الوجه الآخر»)  |
| sample      | A spoonful of a city                 | ملعقة من مدينة                                       |
| secret      | A secret shouted across the room     | سرّ على الملأ                                        |
| shots       | Two players, three leaderboards      | لاعبان وثلاث لوحات صدارة                             |
| shower      | The shower that never settles        | الدُّش الذي لا يستقر أبدًا                           |
| storm       | Send a picture through a storm       | إرسال صورة عبر عاصفة                                 |
| sudoku      | Sudoku, made transparent             | سودوكو على المكشوف ("Visit Sudoku" → «زيارة سودوكو») |
| tiles       | A tile that fills the world          | بلاطة تملأ العالم                                    |
| traffic     | The tempting shortcut                | الاختصار المُغري                                     |
| treasure    | The imperfect treasure detector      | كاشف الكنز غير المثالي                               |
| waves       | Hear the shape                       | سماع الشكل                                           |
| weather     | Weather twins                        | توأما الطقس                                          |

Themes (already in app.js): الشكل والفضاء · الصدفة والأدلة · ألعاب وألغاز · إبداع · الهندسة التطبيقية · أنماط حيّة ·
إشارات وشبكات.

## 8. Strings that other files quote (keep identical)

| where                                                  | English               | Arabic                                         |
| ------------------------------------------------------ | --------------------- | ---------------------------------------------- |
| page.motion.finish (quoted by motion.js nudges)        | Trace it all          | إكمال الرسم                                    |
| motion preset (quoted by page.why.p3)                  | Almost a circle       | دائرة تقريبًا                                  |
| app.stage.keep                                         | Keep this moment      | حفظ هذه اللحظة                                 |
| page.stage.reset                                       | Start again           | إعادة البدء                                    |
| page.motion.surprise                                   | Surprise me           | مفاجأة                                         |
| any room's actionLabel quoted in its own tip/startHint | e.g. "Roll 100 times" | quote your own button text exactly: «100 رمية» |

## 9. People (transliteration and gender)

Guest notes are in the first person, which has no gender in Arabic verbs. Third-person sentences about a guest need
the right gender. **Nicole Oresme is a man.** Ada Lovelace, Emmy Noether and Marjorie Rice are women.

| English            | Arabic           |     | English              | Arabic             |
| ------------------ | ---------------- | --- | -------------------- | ------------------ |
| Nicole Oresme (m)  | نيكول أوريسم     |     | Juan Parrondo        | خوان باروندو       |
| Leonhard Euler     | ليونهارد أويلر   |     | Richard Feynman      | ريتشارد فاينمان    |
| Joseph Fourier     | جوزيف فورييه     |     | Bernhard Riemann     | برنهارد ريمان      |
| Nasir Ahmed        | ناصر أحمد        |     | Robert Dorfman       | روبرت دورفمان      |
| Évariste Galois    | إيفاريست غالوا   |     | Claude Shannon       | كلود شانون         |
| Blaise Pascal      | بليز باسكال      |     | August Möbius        | أوغست موبيوس       |
| Pierre de Fermat   | بيير دو فيرما    |     | Johann Listing       | يوهان ليستنغ       |
| Alan Turing        | آلان تورينغ      |     | Jerzy Neyman         | جيرزي نيمان        |
| Christiaan Huygens | كريستيان هويغنز  |     | Edward H. Simpson    | إدوارد سيمبسون     |
| Arthur Winfree     | آرثر وينفري      |     | George Udny Yule     | جورج أودني يول     |
| John Conway        | جون كونواي       |     | James Clerk Maxwell  | جيمس كلارك ماكسويل |
| Martin Gardner     | مارتن غاردنر     |     | Nicolas Minorsky     | نيكولاس مينورسكي   |
| Ralph Gomory       | رالف غوموري      |     | Richard Hamming      | ريتشارد هامنغ      |
| Norbert Wiener     | نوربرت وينر      |     | Marjorie Rice (f)    | مارجوري رايس       |
| Gaston Julia       | غاستون جوليا     |     | M. C. Escher         | م. ك. إيشر         |
| Benoit Mandelbrot  | بنوا ماندلبرو    |     | John von Neumann     | جون فون نويمان     |
| Ada Lovelace (f)   | آدا لوفليس       |     | John Nash            | جون ناش            |
| Emmy Noether (f)   | إيمي نويتر       |     | Thomas Bayes         | توماس بايز         |
| Bradley Efron      | برادلي إفرون     |     | Pierre-Simon Laplace | بيير سيمون لابلاس  |
| James Grime        | جيمس غرايم       |     | Jules Lissajous      | جول ليساجو         |
| Dietrich Braess    | ديتريش برايس     |     | Edward Lorenz        | إدوارد لورنز       |
| Alice / Bob / Eve  | أليس / بوب / إيف |     | Henri Poincaré       | هنري بوانكاريه     |

The owner's name: إيال فايس (to be confirmed by the owner). "Wonderlattice" always stays in Latin letters.

## 10. Before you hand a room back

- `npx prettier --write src/lang/ar/<room>.js`, then `npm run i18n:check`: no «!» warnings for ar.
- No `toLocaleString(Wonderlattice.lang)` left: `grep -n "Wonderlattice.lang" src/lang/ar/<room>.js`.
- No straight `"` in plain text, no ٠–٩ digits: `grep -nP '[\x{0660}-\x{0669}]' src/lang/ar/<room>.js`.
- Open `index.html?lang=ar#room=<room>` at desktop and phone widths. Check the order of mixed Latin/Arabic lines,
  the canvas labels, and the insight dialog.
