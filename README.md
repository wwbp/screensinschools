# screensinschools.org

Static site on S3 (`screensinschools.org` bucket) behind CloudFront (`E16BYKYLVPT1XN`).

```
site/                 everything here is served as-is
  index.html          /        survey landing page (Qualtrics embed)
  about/index.html    /about/  About page (styles.css, app.js, assets/)
  robots.txt, sitemap.xml, social-card.jpg, favicon-mark-*.png
cloudfront/router.js  viewer-request function screensinschools-about-router
tests/                node --test (no dependencies)
```

## Routing (cloudfront/router.js)

- `www.screensinschools.org/*` 301 → `https://screensinschools.org/*`
- `/about`, `/about.html` 301 → `/about/`
- any `…/` → `…/index.html`

## Develop

```sh
node --test                       # Node 22+
python3 -m http.server -d site    # preview at http://localhost:8000/about/
```

## Deploy

Merge to `main`. GitHub Actions ([ci.yml](.github/workflows/ci.yml)) runs the tests and then:

1. Syncs `site/` to S3. HTML, CSS and JS get `no-cache`; everything else gets a 1-day cache.
2. Publishes `cloudfront/router.js` to the CloudFront function.
3. Deletes bucket files no longer in `site/`, then invalidates `/*`.

AWS access goes through OIDC with the `github-actions-service-acc` role (it trusts `repo:wwbp/*`). The repo holds no AWS keys.
