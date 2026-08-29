# optimizedinvision — website

A static site for an SEO / Meta Ads / Google Business Profile / Web Dev / Design agency.
Pure HTML/CSS/JS — no build step, so it deploys straight to GitHub Pages.

## Structure
```
optimizedinvision/
├── index.html          → all page content
├── css/style.css        → design tokens + all styling
├── js/main.js            → 3D hero (three.js), scroll reveals, counters, tilt cards, testimonial carousel
├── assets/
│   ├── logo-mark.svg      → icon-only logo (favicon, social avatars)
│   └── logo-lockup.svg    → full horizontal logo (letterhead, print, socials)
└── README.md
```

## Deploy to GitHub Pages
1. Create a new GitHub repo (e.g. `optimizedinvision`) and push these files to the root of the `main` branch.
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)`. Save.
4. Your site goes live at `https://<your-username>.github.io/optimizedinvision/` within a minute or two.

If you'd rather serve it from a custom domain, add a `CNAME` file in the root containing your domain, and point your DNS `A`/`CNAME` records at GitHub Pages per [GitHub's docs](https://docs.github.com/pages).

## Things to swap in before you launch
- **Team photos** — replace the `BA` / `HS` initials in the `avatar-slot` divs (search `TEAM` in `index.html`) with real `<img>` headshots.
- **Testimonials** — the four quotes are placeholders written to show the layout; swap in real client quotes (`testimonials` section).
- **Contact info** — update the email, phone, and address placeholders in the `contact` section and footer.
- **Contact form** — it's static (`onsubmit="return false;"`). Wire it to [Formspree](https://formspree.io), Netlify Forms, or your own backend to actually receive submissions.
- **Social links** — the `#` hrefs on Instagram/LinkedIn/Facebook icons need your real profile URLs.
- **Colors/fonts** — everything is driven by CSS custom properties at the top of `css/style.css` (`:root`), so palette or type changes only need editing in one place.

## Notes on the build
- The hero's 3D wireframe scene uses [three.js](https://threejs.org/) loaded from a CDN — no npm install needed.
- The rotating "aperture" mark is the logo motif, used as the animated hero graphic, the nav mark, and the favicon, tying the whole identity together.
- Respects `prefers-reduced-motion` — animations are disabled for users who request it.
- Fully responsive down to small mobile widths, with a slide-out nav below 900px.
