# Calico Websites

Two pages, no frameworks, no build step:

- `index.html` is the front page: cat, name, tagline, Apply button, My work,
  How it works, footer. Deliberately short.
- `apply.html` is the application form, reached from either Apply button.
- `styles.css` is shared by both. `app.js` handles the form, the year, and the
  scroll fade-in; it no-ops on any page without a form.

Modelled on mckaylablanca.com: one centered column at every width, full-bleed
on phones, a rounded card floating on green from 560px up, with her link-row
system (62px pills, icon + label + sub + meta), her card radius, her hover lift,
and her `--i` reveal stagger. Type follows fourmeasure.com: Jost for display,
Inter for the small print.

The form asks three pill questions: what they want, how soon, and an estimated
budget. All three are radio buttons styled as tappable pills, with real inputs
underneath, so they work with a keyboard and a screen reader and land in the
Formspree email as `what`, `when` and `budget`.

The budget ranges are placeholders. Edit the `<label>` text and the matching
`value=""` on each input in the marked block in `apply.html`.

The two "what do you want / how soon" questions are radio buttons styled as
tappable pills, with real inputs underneath, so they work with a keyboard, with a
screen reader, and land in the Formspree email as `what` and `when`.

On a successful send the form hides itself and the thank-you panel takes its
place; on a failure the form stays put and shows an error under the button.

## Edit this first

Everything editable lives in the `CONFIG` object at the top of `app.js`:

| What | Where |
| --- | --- |
| **Formspree endpoint** | `CONFIG.form.endpoint` |
| Reply subject line | `CONFIG.form.subject` |
| Form status messages | `CONFIG.form.messages` |
| Work cards | plain HTML in `index.html`. Copy the marked `<a class="work-card">` block |

Section copy lives in `index.html` so it ships in the HTML for SEO and works
with JavaScript off.

## Connecting the form

1. Make a form at <https://formspree.io> and copy the endpoint
   (`https://formspree.io/f/xxxxxxxx`).
2. Paste it into `CONFIG.form.endpoint` in `app.js`, replacing
   `PASTE_FORMSPREE_ENDPOINT_HERE`.
3. Optionally paste it into the `<form action="…">` in `index.html` too. That
   attribute is only the fallback path for visitors with JavaScript disabled.

Until step 2 is done the form intercepts the submit and tells people it isn't
connected yet, rather than posting into a dead URL.

With JS on, it submits over `fetch` and stays on the page (success and error
messages go into the live region under the button). With JS off, the browser
posts normally and Formspree shows its own thank-you page.

Formspree is already allowed in the CSP (`form-action` and `connect-src`). If
you switch to a different form service, add its origin to both in
`vercel.json`.

## Brand

- **The calico**: one `<symbol id="calico">` in the defs block at the top of
  `<body>`, re-used everywhere via `<use href="#calico">`: the hero, the Apply
  row, each work card, the submit button, and the three in the footer.
  - The outline draws in `currentColor` (green from `--primary`).
  - The coat is three patch colours, `--patch-a`, `--patch-b`, `--patch-c`.
    Set them on any instance to give that cat a different coat; the footer trio
    does exactly this via `.cats .cat:nth-child(n)`.
  - `--coat-opacity: 0` drops the coat and leaves the outline, which is what the
    24-26px icons use. The patches turn to mush at that size.
  - Hovering the hero cat, the Apply row, or the submit button runs her
    `credit-wiggle` animation (disabled under reduced motion and on touch).
- **Colors**: every value is a CSS variable in `:root` at the top of the
  `<style>` block. The greens are `--primary` `#1D7C50`, `--primary-strong`
  `#196B48`, `--primary-soft` `#59C08C`, page field `--page-bg` `#DAF1E7`,
  column `--shell-bg` `#F8FBFA`. All of these clear WCAG AA. White on
  `--primary` is 5.18:1, link green on the column is 6.23:1. Swap the hues and
  re-check contrast before shipping.
- `favicon.svg` and `apple-touch-icon.png` are the cat on a green tile.

## Images

Replace the two generated placeholders in `images/`:

- `images/mckayla.png`: screenshot of mckaylablanca.com (any size; the phone frame crops 3:4 from the top)
- `images/og-image.jpg`: 1200x630 social share card (the current one is real, regenerate if the brand changes)

Also update the `https://calicowebsites.com` URLs in the `og:`/`canonical` tags
once the real domain is attached. Social previews need absolute URLs.

## Local preview

```sh
python3 -m http.server 3000
# then open http://localhost:3000
```

Use a server rather than opening the file directly. `app.js` and the images are
referenced from the site root (`/app.js`, `/images/…`).

## Deploy

```sh
npm i -g vercel     # once
vercel              # preview
vercel --prod       # production
```

Or push the folder to GitHub and import it on vercel.com. Vercel serves it as a
static site with no framework preset.

## Security notes

- The form posts to Formspree, so no inbox address is exposed anywhere in the
  page source. The honeypot field (`_gotcha`) catches the dumber bots.
- `vercel.json` sets a CSP with `script-src 'self'`. **No inline `<script>` will
  run**. Any JS you add must go in a file. Inline `<style>` is still allowed.
- The CSP allows Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`). If
  you self-host the fonts later, drop those two entries.
- All external links carry `rel="noopener noreferrer"`.
