# Calico Websites

Three pages, no frameworks, no build step:

- `index.html` is the front page: a wide split hero (cat, name, tagline, Apply
  button on the left, a phone stencil showing mckaylablanca.com on the right),
  then How it works, Previous work, and the footer.
- `apply.html` is the application form, reached from the Apply buttons.
- `example.html` is a sample creator link-in-bio page with placeholder
  content. Every card on it leads to `/apply`. It is `noindex`, and nothing
  links to it at the moment.
- `404.html` is served by Vercel for any missing path.
- `styles.css` is shared by all of them. `app.js` handles the form, the year,
  and the scroll fade-in; it no-ops on any page without a form.

The apply and example pages follow mckaylablanca.com: one centred column,
full-bleed on phones, a rounded card floating on green from 560px up, with her
link-row system (62px pills, icon + label + sub + meta), her card radius, her
hover lift, and her `--i` reveal stagger. The home page overrides that with
`body.home` for its wide layout, going two-column from 900px. Type follows
fourmeasure.com: Jost for display, Inter for the small print.

The form asks three pill questions: what they want, how soon, and an estimated
budget. All three are radio buttons styled as tappable pills, with real inputs
underneath, so they work with a keyboard and a screen reader and land in the
Formspree email as `what`, `when` and `budget`. To change the budget ranges,
edit the `<label>` text and the matching `value=""` on each input in the
marked block in `apply.html`.

On a successful send the form hides itself and the thank-you panel takes its
place. On a failure the form stays put and shows an error under the button:
Formspree's own reason if it rejected the submission, otherwise a "check your
connection" message.

## Edit this first

| What | Where |
| --- | --- |
| **Footer email and Instagram** | the marked `footer-contact` block in every `.html` file |
| Formspree endpoint | `CONFIG.form.endpoint` in `app.js` **and** the form `action` in `apply.html` |
| Reply subject line | `CONFIG.form.subject` in `app.js` |
| Form status messages | `CONFIG.form.messages` in `app.js` |
| Work cards | plain HTML in `index.html`. Copy the marked `<a class="work-card">` block |

Section copy lives in the HTML so it ships for SEO and works with JavaScript
off.

## The form

The form is connected to Formspree (`https://formspree.io/f/xvkgryrv`). With
JS on, it submits over `fetch` and stays on the page, with messages in the live
region under the button. With JS off, the browser posts to the form's `action`
and Formspree shows its own thank-you page. That is why the endpoint lives in
two places; keep them in step.

If `CONFIG.form.endpoint` is ever cleared or not a Formspree URL, the form
intercepts the submit and says it isn't switched on, rather than posting into
a dead URL.

Formspree is allowed in the CSP (`form-action` and `connect-src`). If you
switch to a different form service, add its origin to both in `vercel.json`.

## Brand

- **The calico**: one `<symbol id="calico">` in the defs block at the top of
  each page's `<body>`, re-used everywhere via `<use href="#calico">`: the hero,
  the Apply row, the example thumbnails, the submit button, the thank-you
  panel, and the three in the footer. It is a plain outline in `currentColor`,
  so set `color` on any instance to recolour it. The symbol is copied into each
  page, so change it in all of them.
- Hovering the example page's hero cat, the Apply row, the submit button or
  the middle footer cat runs the `wiggle` animation (off under reduced motion,
  and on touch for the first three).
- **Colors**: every value is a CSS variable in `:root` at the top of
  `styles.css`. Surfaces: `--accent` and `--shell` `#DAF1E7` (the page and the
  column), `--field` `#A7DCC2` (the green behind the floating card from 560px).
  Greens: `--primary` `#1D7C50`, `--primary-strong` `#196B48`,
  `--primary-soft` `#59C08C`. All text clears WCAG AA: white on `--primary` is
  5.18:1, link green on the column is 5.47:1, `--text-muted` on the column is
  5.03:1. Swap the hues and re-check contrast before shipping.
- `favicon.svg` and `apple-touch-icon.png` are the cat on a green tile.

## Images

- `images/mckayla-228.jpg`: the Previous work thumbnail, a 228 x 304 crop from
  the top of a mckaylablanca.com screenshot. The frame shows 3:4 from the top,
  so crop to that and keep it small.
- `images/mckayla-full.jpg`: the full-length screenshot that scrolls inside
  the home page phone stencil. It is a screenshot, not a live iframe, because
  mckaylablanca.com refuses to be framed by other sites. Capture a full-page
  screenshot at a 390px-wide phone viewport at 2x (so 780px wide), after
  scrolling to the bottom once so lazy images and fade-ins have loaded. To
  show a different site, swap this image, its `width`/`height`/`alt`, and the
  pill's `href` in `index.html`.
- `images/og-image.jpg`: 1200 x 630 social share card. Regenerate it if the
  brand changes.

Images are cached for a week (`vercel.json`). **When you replace one, give it
a new filename** and update the reference, or returning visitors may see the
old one for up to a week.

## Moving to a custom domain

Every absolute URL (canonical, `og:`, `twitter:`, the sitemap) uses
`https://calico-website.vercel.app`. Social crawlers don't run JavaScript, so
these have to be literal. Once the domain is attached, run this once from the
project folder (works in Git Bash, Linux and macOS):

```sh
sed -i.bak 's#https://calico-website.vercel.app#https://yourdomain.com#g' *.html *.txt *.xml && rm *.bak
```

## Local preview

```sh
npx serve .        # quick; maps /apply to apply.html like Vercel does
npx vercel dev     # exact production behaviour, including the headers
```

Use one of these rather than opening the files directly or using
`python -m http.server`. The links are clean URLs (`/apply`, `/example`) and
assets are referenced from the site root, so a plain file server 404s on them.

## Deploy

```sh
npm i -g vercel     # once
vercel              # preview
vercel --prod       # production
```

Or push the folder to GitHub and import it on vercel.com. Vercel serves it as a
static site with no framework preset.

## Security notes

- The form posts to Formspree, so no inbox address is needed in the form. The
  honeypot field (`_gotcha`) catches the dumber bots.
- `vercel.json` sets a CSP with `script-src 'self'`. **No inline `<script>` will
  run**. Any JS you add must go in a file. Inline `<style>` is still allowed.
- The CSP allows Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`). If
  you self-host the fonts later, drop those two entries.
- `frame-ancestors 'self'` and `X-Frame-Options: SAMEORIGIN` stop other sites
  from framing any page. Your own pages may still frame each other.
- HSTS is set without `includeSubDomains` or `preload`. Add those only once the
  custom domain is settled and every subdomain serves HTTPS; preloading is hard
  to undo.
- All external links carry `rel="noopener noreferrer"`.
