// Unit tests for cloudfront/router.js (CloudFront Function, viewer request).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// CloudFront Functions are a bare `function handler(event)`, not a module.
const src = fs.readFileSync(path.join(__dirname, '../cloudfront/router.js'), 'utf8');
const handler = new Function(`${src}; return handler;`)();

function req(uri, host = 'screensinschools.org', querystring = {}) {
  return { request: { uri, querystring, headers: { host: { value: host } } } };
}

test('/ serves index.html', () => {
  assert.equal(handler(req('/')).uri, '/index.html');
});

test('/about/ serves about/index.html', () => {
  assert.equal(handler(req('/about/')).uri, '/about/index.html');
});

test('/about redirects to /about/', () => {
  const res = handler(req('/about'));
  assert.equal(res.statusCode, 301);
  assert.equal(res.headers.location.value, '/about/');
});

test('old /about.html redirects to /about/', () => {
  const res = handler(req('/about.html'));
  assert.equal(res.statusCode, 301);
  assert.equal(res.headers.location.value, '/about/');
});

test('/about/ assets are passed through', () => {
  assert.equal(handler(req('/about/styles.css')).uri, '/about/styles.css');
});

test('www redirects to the apex, keeping path and query', () => {
  const res = handler(req('/about/', 'www.screensinschools.org', {
    utm_source: { value: 'sis' }, tag: { value: 'a b', multiValue: [{ value: 'a b' }, { value: 'c' }] },
  }));
  assert.equal(res.statusCode, 301);
  assert.equal(res.headers.location.value, 'https://screensinschools.org/about/?utm_source=sis&tag=a%20b&tag=c');
});
