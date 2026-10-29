# Updating screensinschools.org

You can do everything in your web browser on github.com. When you save a change, the website updates by itself in about 2 minutes. You don't need AWS, S3 or CloudFront invalidations any more.

> **Don't upload files to S3 directly.** The next update from GitHub will overwrite or delete them.

## One-time setup

1. Create a free GitHub account at [github.com/signup](https://github.com/signup), then send Abhay your username.
2. Accept the invitation email from GitHub. The site lives at **github.com/wwbp/screensinschools**.

## Where things are

| On the website | File on GitHub |
|---|---|
| screensinschools.org (survey page) | `site/index.html` |
| screensinschools.org/about/ | `site/about/index.html` |
| About page styles / behaviour | `site/about/styles.css`, `site/about/app.js` |
| About page images | `site/about/assets/…` |

Only change files inside the `site` folder.

## Change some text

1. On GitHub, click into `site` → `about` → `index.html`.
2. Click the **pencil icon** (top right of the file) to edit.
3. Find the text with **Ctrl+F** (**Cmd+F** on Mac) and change it. Only change the words between tags, not the `<…>` parts.
4. Click the green **Commit changes…** button, write a short note (e.g. "Fix typo in team section"), keep **Commit directly to the main branch** selected, and click **Commit changes**.

## Replace an image or upload a new export

1. Go to the folder the file belongs in, e.g. `site` → `about` → `assets` → `team`.
2. Click **Add file** → **Upload files**.
3. Drag the files in. **Use exactly the same file name** as the one you're replacing; a file with the same name replaces the old one.
4. Click **Commit changes**.

When you upload a whole new design export to `site/about`, leave out `README.txt`, `robots.txt` and `sitemap.xml`. The site already has its own copies.

### Image sizes

Pages load faster when images aren't bigger than they need to be. **The site won't update if any image is over 400 KB.**

| Image | Size (pixels) | Format |
|---|---|---|
| Hero photo | 2400 × 1350 | JPG |
| Background photo ("This year" band) | about 1900 wide | JPG |
| Team headshots | 256 × 256, square | PNG (transparent) or JPG |
| Partner logos (white) | 132 tall | PNG (transparent) |
| News logos | 60 tall | PNG (transparent) |
| Social share image | 1200 × 630 | JPG |

To resize: on a Mac, open the image in **Preview** → **Tools** → **Adjust Size**. On Windows, use **Photos** → **⋯** → **Resize image**. [squoosh.app](https://squoosh.app) is a free website that does both and shows the file size.

## Check it went live

1. Click the **Actions** tab at the top of the repository.
2. Your change is at the top of the list:
   - 🟡 **yellow dot**: still updating, wait about 2 minutes.
   - ✅ **green check**: live. Refresh the website to see it.
   - ❌ **red X**: **the website was not changed.** Something failed a check (often an image over 400 KB, a broken image link, or a survey button with the wrong link). Click it to see which check failed, or email Abhay.

## Undo a change

Every change is saved in the history, so nothing is lost. Email Abhay and say which change to undo.
