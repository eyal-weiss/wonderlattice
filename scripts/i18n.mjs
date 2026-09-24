// Translation tools. No dependencies.
//
//   node scripts/i18n.mjs check                    report every language's coverage; fail on mistakes
//   node scripts/i18n.mjs new <code> "<name>" [rtl] start src/lang/<code>.js and link it from index.html
//
// English is the source: each room's src/rooms/<id>/text.en.js, the shared src/core/text.en.js,
// and the fixed page text in index.html (elements marked data-t / data-t-attr). A language file
// may translate any subset; whatever it leaves out falls back to English.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = new URL('..', import.meta.url).pathname;
const html = readFileSync(join(root, 'index.html'), 'utf8');
const langDir = join(root, 'src/lang');

// ---------- loading the dictionaries ----------

async function load() {
  await import(pathToFileURL(join(root, 'src/core/wonderloom.js')).href);
  const scripts = [...html.matchAll(/<script src="\.\/([^"]+)"><\/script>/g)].map((m) => m[1]);
  for (const path of scripts.filter((p) => /text\.en\.js$|^src\/lang\//.test(p)))
    await import(pathToFileURL(join(root, path)).href);
  const W = globalThis.Wonderloom;
  return { W, dictionaries: W.dictionaries(), languages: W.languages(), scripts };
}

/** The fixed page text: data-t elements (their inner HTML) and data-t-attr attributes, from index.html. */
function pageText() {
  const out = {};
  const put = (key, value) => {
    const parts = key.split('.');
    let o = out;
    for (const p of parts.slice(0, -1)) o = o[p] ??= {};
    const last = parts.at(-1);
    if (last in o && o[last] !== value) throw new Error(`index.html: data-t "${key}" has two different texts`);
    o[last] = value;
  };
  const tidy = (s) => s.replace(/\s+/g, ' ').replace(/> </g, '><').trim();
  for (const m of html.matchAll(/<([a-z0-9]+)\b[^>]*\sdata-t="([^"]+)"[^>]*>/g)) {
    const [open, tag, key] = m;
    let depth = 1,
      i = m.index + open.length;
    const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'g');
    re.lastIndex = i;
    let close;
    while (depth && (close = re.exec(html))) depth += close[1] ? -1 : close[0].endsWith('/>') ? 0 : 1;
    if (!close) throw new Error(`index.html: data-t "${key}" has no closing </${tag}>`);
    const inner = tidy(html.slice(i, close.index));
    if (!key.endsWith('Html') && /<[a-z]/i.test(inner))
      throw new Error(`index.html: data-t "${key}" contains markup; name it "${key}Html" or move the markup out`);
    put(key, inner);
  }
  for (const m of html.matchAll(/<[a-z0-9]+\b[^>]*\sdata-t-attr="([^"]+)"[^>]*>/g)) {
    for (const pair of m[1].split(';')) {
      const [attribute, key] = pair.split(':').map((x) => x.trim());
      const value = m[0].match(new RegExp(`\\s${attribute}="([^"]*)"`));
      if (!value) throw new Error(`index.html: data-t-attr names ${attribute}, which the element lacks`);
      put(key, value[1]);
    }
  }
  return out;
}

// ---------- comparing ----------

const kind = (v) => (Array.isArray(v) ? 'list' : v === null ? 'null' : typeof v);

/** Walk English and a translation side by side; collect missing, extra, and mismatched keys. */
function compare(en, tr, path, report) {
  if (tr === undefined) return void report.missing.push(path);
  if (kind(en) !== kind(tr))
    return void report.wrong.push(`${path}: English is a ${kind(en)}, translation a ${kind(tr)}`);
  if (typeof en === 'function' && en.length !== tr.length)
    report.warnings.push(`${path}: English takes ${en.length} value(s), translation ${tr.length}`);
  if (kind(en) === 'string') {
    report.total++;
    if (tr !== en || !/[a-z]{3}/i.test(en)) report.done++;
    else report.same.push(path);
    const holes = (s) => (s.match(/\$\{[^}]+\}/g) ?? []).sort().join();
    if (holes(en) !== holes(tr)) report.warnings.push(`${path}: placeholders differ`);
    return;
  }
  if (kind(en) === 'function') {
    report.total++;
    if (tr.toString() !== en.toString()) report.done++;
    else report.same.push(path);
    return;
  }
  if (kind(en) === 'list' || kind(en) === 'object') {
    for (const k of Object.keys(en)) {
      const sub = `${path}.${k}`;
      if (tr[k] === undefined) countMissing(en[k], sub, report);
      else compare(en[k], tr[k], sub, report);
    }
    for (const k of Object.keys(tr)) if (!(k in en)) report.extra.push(`${path}.${k}`);
  }
}
function countMissing(en, path, report) {
  if (kind(en) === 'object' || kind(en) === 'list')
    for (const k of Object.keys(en)) countMissing(en[k], `${path}.${k}`, report);
  else {
    report.total++;
    report.missing.push(path);
  }
}

async function check() {
  const { dictionaries, languages, scripts } = await load();
  const page = pageText();
  const scopes = Object.keys(dictionaries).filter((s) => dictionaries[s].en);
  const files = existsSync(langDir) ? readdirSync(langDir).filter((f) => f.endsWith('.js')) : [];
  let errors = 0;
  const fail = (m) => {
    errors++;
    console.log('  ✗ ' + m);
  };
  console.log(`English: ${scopes.length} text scopes plus the page text (${countLeaves(page)} strings).`);
  for (const file of files) {
    if (!scripts.includes(`src/lang/${file}`))
      fail(`src/lang/${file} is not linked from index.html (npm run i18n:new adds the tag)`);
  }
  const codes = Object.keys(languages).filter((c) => c !== 'en');
  for (const code of codes) {
    const report = { missing: [], extra: [], wrong: [], same: [], warnings: [], total: 0, done: 0 };
    for (const scope of scopes) {
      const tr = dictionaries[scope][code];
      if (tr) compare(dictionaries[scope].en, tr, scope, report);
      else countMissing(dictionaries[scope].en, scope, report);
    }
    const trPage = dictionaries.page?.[code];
    if (trPage) compare(page, trPage, 'page', report);
    else countMissing(page, 'page', report);
    for (const scope of Object.keys(dictionaries)) {
      if (!dictionaries[scope].en && scope !== 'page' && dictionaries[scope][code])
        report.extra.push(`${scope} (no such scope)`);
    }
    const pct = Math.round((100 * report.done) / Math.max(1, report.total));
    console.log(
      `\n${code} (${languages[code].name}, ${languages[code].dir}): ${report.done} of ${report.total} strings translated (${pct}%)`,
    );
    report.extra.forEach((k) => fail(`unknown key ${k}`));
    report.wrong.forEach((k) => fail(k));
    report.warnings.forEach((k) => console.log('  ! ' + k));
    if (report.missing.length)
      console.log(
        `  · ${report.missing.length} missing (shown in English): ${report.missing.slice(0, 8).join(', ')}${report.missing.length > 8 ? ', …' : ''}`,
      );
    if (report.same.length)
      console.log(
        `  · ${report.same.length} still in English: ${report.same.slice(0, 5).join(', ')}${report.same.length > 5 ? ', …' : ''}`,
      );
  }
  if (!codes.length) console.log('No translations yet. Start one with: npm run i18n:new -- <code> "<name>" [rtl]');
  if (errors) {
    console.log(`\n${errors} problem(s) found.`);
    process.exit(1);
  }
  console.log('\nTranslations are consistent.');
}

const countLeaves = (o) => (o && typeof o === 'object' ? Object.values(o).reduce((n, v) => n + countLeaves(v), 0) : 1);

// ---------- starting a new language ----------

/** Serialise a dictionary as readable JavaScript, keeping functions as source. */
function literal(value, indent = '  ') {
  if (typeof value === 'function') return value.toString();
  if (typeof value === 'string')
    return /\n|`/.test(value) && !value.includes('${') ? '`' + value.replace(/`/g, '\\`') + '`' : JSON.stringify(value);
  if (Array.isArray(value))
    return `[\n${value.map((v) => indent + '  ' + literal(v, indent + '  ')).join(',\n')},\n${indent}]`;
  if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    return `{\n${keys.map((k) => `${indent}  ${/^[a-zA-Z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${literal(value[k], indent + '  ')}`).join(',\n')},\n${indent}}`;
  }
  return String(value);
}

async function create(code, name, rtl) {
  if (!code || !/^[a-z]{2,3}(-[A-Z]{2})?$/.test(code) || !name)
    throw new Error(
      'Usage: npm run i18n:new -- <code> "<language name>" [rtl]   e.g. npm run i18n:new -- he "עברית" rtl',
    );
  const file = join(langDir, `${code}.js`);
  if (existsSync(file)) throw new Error(`src/lang/${code}.js already exists`);
  const { dictionaries } = await load();
  const scopes = Object.keys(dictionaries).filter((s) => dictionaries[s].en);
  let out = `/*
 * ${name} (${code}). Started from English by \`npm run i18n:new\`; translate the strings in place.
 * - Keep every key; delete any you don't translate, and English will show there instead.
 * - Strings written as functions, like (n) => \`\${n} rolls\`, receive numbers or names: keep the
 *   \${…} parts, and move them wherever your language needs them.
 * - Keys ending in Html may contain markup such as <strong> or <em>; keep the tags balanced.
 * - Check your work with: npm run i18n:check
 */
Wonderloom.defineLanguage('${code}', { name: ${JSON.stringify(name)}, dir: '${rtl ? 'rtl' : 'ltr'}', speech: '${code}' });
`;
  for (const scope of scopes)
    out += `\nWonderloom.defineText('${scope}', '${code}', ${literal(dictionaries[scope].en, '')});\n`;
  out += `\n// The fixed text of the page (index.html, elements marked data-t).\nWonderloom.defineText('page', '${code}', ${literal(pageText(), '')});\n`;
  mkdirSync(langDir, { recursive: true });
  writeFileSync(file, out);
  const marker = '    <!-- /languages -->';
  if (!html.includes(marker)) throw new Error('index.html has no <!-- /languages --> marker');
  writeFileSync(
    join(root, 'index.html'),
    html.replace(marker, `    <script src="./src/lang/${code}.js"></script>\n${marker}`),
  );
  console.log(`Created src/lang/${code}.js and linked it from index.html. Translate it, then run npm run i18n:check.`);
  console.log(`Try it: open index.html?lang=${code}`);
}

const [command, ...args] = process.argv.slice(2);
try {
  if (command === 'check') await check();
  else if (command === 'new') await create(args[0], args[1], args[2] === 'rtl');
  else {
    console.log('Usage: node scripts/i18n.mjs check | new <code> "<name>" [rtl]');
    process.exit(1);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
