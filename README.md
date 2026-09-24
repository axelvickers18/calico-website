# Calico Websites

Calico designs and builds personalized websites from a customer's own
photos, links and bio, and sets them up on the customer's personal domain.

No frameworks, no build step:

- `index.html` is the front page: hero (headline, both buttons, the three
  highlights, and a phone that scrolls through a real customer site), A site
  built for what you want (the goals customers pick from, then slices of that
  real site with what each part is for), Show brands your numbers (her stats
  and contact button), personal domain, How it works, What's included with
  pricing, FAQ, and a final call to action.
- `apply.html` is the request form ("Get your website"), reached from every
  "Get your website" button.
- `example.html` is a sample layout with placeholder content, labelled as a
  concept. The home page links to it as "See a sample layout (Concept)". It
  is `noindex`.
- `404.html` is served by Vercel for any missing path.
- `styles.css` is shared by all of them. `app.js` handles the form, the year,
  and the scroll fade-in; it no-ops on any page without a form.

The home page has its own full-width layout (`body.home`, sections centred by
`.wrap`, two columns from 900px). The apply, example and 404 pages use the
centred column: full-bleed on phones, a rounded card floating on green from
560px up. Type is Jost for display and Inter for body copy.

## Edit this first

| What | Where |
| --- | --- |
| **Pricing** | the marked `PRICING` block in `index.html`, the only place a price appears |
| **Contact email and social link** | not on the site yet. Add them to each page's footer (styles for a `footer-contact` row are ready in `styles.css`) |
| Formspree endpoint | `CONFIG.form.endpoint` in `app.js` **and** the form `action` in `apply.html` |
| Reply subject line | `CONFIG.form.subject` in `app.js` |
| Form status messages | `CONFIG.form.messages` in `app.js` |
| FAQ answers | the `<details>` blocks in the FAQ section of `index.html` |

Section copy lives in the HTML so it ships for SEO and works with JavaScript
off. Keep claims to what's actually agreed: no invented prices, deadlines,
renewal terms or integrations.

## The request form

Fields, as they arrive in the Formspree email: `name`, `email`, `social`
(Instagram or main social link), `what` (what the site is for), and the
optional `what_other` (the box that opens under "Something else"), `goal`, `preferred_domain`, `existing_domain`, `style` and `details`. The
first four are required. `what` is a set of radio buttons styled as tappable
pills, so it works with a keyboard and a screen reader. There is no photo
upload: the form tells people they can share photos after we reply.

On a successful send the form hides itself and the thank-you panel takes its
place. On a failure the form stays put and shows an error under the button:
Formspree's own reason if it rejected the submission, otherwise a "check your
connection" message.

## Formspree

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
  each page's `<body>`, re-used everywhere via `<use href="#calico">`: the
  header, the final call to action, the example page, the submit button, the
  thank-you panel, and the three in the footer. It is a plain outline in `currentColor`,
  so set `color` on any instance to recolour it. The symbol is copied into each
  page, so change it in all of them.
- Hovering the example page's hero cat, its Get your website row, the submit
  button or the middle footer cat runs the `wiggle` animation (off under
  reduced motion, and on touch for the first three).
- **Colors**: every value is a CSS variable in `:root` at the top of
  `styles.css`. Surfaces: `--accent` and `--shell` `#DAF1E7` (the page and the
  column), `--field` `#A7DCC2` (the green behind the floating card from 560px).
  Greens: `--primary` `#1D7C50`, `--primary-strong` `#196B48`,
  `--primary-soft` `#59C08C`. All text clears WCAG AA: white on `--primary` is
  5.18:1, link green on the column is 5.47:1, `--text-muted` on the column is
  5.03:1. Swap the hues and re-check contrast before shipping.
- `favicon.svg` and `apple-touch-icon.png` are the cat on a green tile.

## Images

- `images/mckayla-full.jpg`: the full-length screenshot that scrolls inside
  the home page phone stencil. It is a screenshot, not a live iframe, because
  mckaylablanca.com refuses to be framed by other sites. Capture a full-page
  screenshot at a 390px-wide phone viewport at 2x (so 780px wide), after
  scrolling to the bottom once so lazy images and fade-ins have loaded. To
  show a different site, swap this image, its `width`/`height`/`alt`, and the
  pill's `href` in `index.html`.
- The product section's slices reuse that same file, so they cost no extra
  download. Each `.slice` sets `--y` (where the window starts) and `--h` (how
  tall it is) in pixels of the page at 390px wide. If the screenshot changes,
  re-check those numbers.
- `images/og-image-v2.jpg`: 1200 x 630 social share card with the headline.
  Regenerate it if the headline or brand changes.

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
