// Static checks over site/: broken local references, basic HTML hygiene.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const SITE = path.join(__dirname, '../site');
const files = fs.readdirSync(SITE, { recursive: true }).map((f) => path.join(SITE, f));
const html = files.filter((f) => f.endsWith('.html'));
const css = files.filter((f) => f.endsWith('.css'));
const rel = (f) => path.relative(SITE, f);

// Local file a reference points to, or null for external/anchor/mailto links.
function localTarget(from, ref) {
  if (/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(ref)) return null;
  const clean = ref.split(/[?#]/)[0];
  if (!clean) return null;
  const abs = clean.startsWith('/') ? path.join(SITE, clean) : path.resolve(path.dirname(from), clean);
  return abs.endsWith('/') ? path.join(abs, 'index.html') : abs;
}

function refs(file) {
  const text = fs.readFileSync(file, 'utf8');
  const re = file.endsWith('.css') ? /url\(\s*['"]?([^'")]+)['"]?\s*\)/g : /\b(?:src|href)="([^"]+)"/g;
  return [...text.matchAll(re)].map((m) => m[1]);
}

for (const file of [...html, ...css]) {
  test(`${rel(file)}: every local reference exists`, () => {
    const missing = refs(file).filter((r) => {
      const t = localTarget(file, r);
      return t && !fs.existsSync(t);
    });
    assert.deepEqual(missing, []);
  });
}

for (const file of html) {
  const text = fs.readFileSync(file, 'utf8');

  test(`${rel(file)}: has lang and a title`, () => {
    assert.match(text, /<html[^>]*\blang="/);
    assert.match(text, /<title>[^<]+<\/title>/);
  });

  test(`${rel(file)}: no duplicate ids`, () => {
    const ids = [...text.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(ids.filter((id, i) => ids.indexOf(id) !== i), []);
  });

  test(`${rel(file)}: every img has an alt attribute`, () => {
    assert.deepEqual([...text.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/g)].map((m) => m[0]), []);
  });

  test(`${rel(file)}: target=_blank links use rel=noopener`, () => {
    assert.deepEqual([...text.matchAll(/<a\b(?=[^>]*target="_blank")(?![^>]*rel="[^"]*noopener)[^>]*>/g)].map((m) => m[0]), []);
  });

  test(`${rel(file)}: absolute screensinschools.org asset URLs exist in site/`, () => {
    const urls = [...text.matchAll(/https:\/\/screensinschools\.org(\/[^"?#\s]+\.(?:png|jpe?g|svg|webp))/g)].map((m) => m[1]);
    assert.deepEqual(urls.filter((u) => !fs.existsSync(path.join(SITE, u))), []);
  });
}

test('site/about/index.html exists (served at /about/)', () => {
  assert.ok(fs.existsSync(path.join(SITE, 'about/index.html')));
});

test('every "survey" button on the About page opens the main survey page', () => {
  const text = fs.readFileSync(path.join(SITE, 'about/index.html'), 'utf8');
  const ctas = [...text.matchAll(/<a\b[^>]*>(?:(?!<\/a>)[\s\S])*?survey(?:(?!<\/a>)[\s\S])*?<\/a>/gi)].map((m) => m[0]);
  assert.ok(ctas.length >= 3, `expected 3+ survey buttons, found ${ctas.length}`);
  assert.deepEqual(ctas.filter((a) => !/href="https:\/\/screensinschools\.org\/[?"]/.test(a)), []);
});

// Large images slow the page down; resize before uploading (see docs/UPDATING.md).
test('no image in site/ is over 400 KB', () => {
  const big = files.filter((f) => /\.(png|jpe?g|webp|gif)$/i.test(f) && fs.statSync(f).size > 400 * 1024);
  assert.deepEqual(big.map(rel), []);
});
