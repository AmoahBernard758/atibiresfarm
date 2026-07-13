# Amingo Design & Photography — Portfolio Site

A static, front-end-only portfolio website for a graphic design & photography studio: hero, about, filterable photography gallery with lightbox, filterable graphic design portfolio with before/after comparison and case-study modals, services/pricing, a client-side booking form, weekly schedule, testimonial carousel, animated stats, blog grid with search/filter, and a contact section.

## Stack

Plain HTML + Tailwind CSS (precompiled, not the CDN script) + vanilla JS. No build tooling required to run it — just open `index.html` or serve the folder statically.

## Structure

- `index.html` — all page markup/content
- `css/style.css` — custom animations, glassmorphism, masonry, etc. (things Tailwind utilities don't cover)
- `css/tailwind-input.css` / `tailwind.config.js` — Tailwind source; only needed if you change classes and want to rebuild `css/tailwind.css`
- `css/tailwind.css` — precompiled, minified Tailwind output actually loaded by the page
- `js/main.js` — all interactivity (nav, reveal animations, counters, filters, lightbox, before/after slider, testimonial carousel, booking form, blog search, theme toggle)

## Rebuilding Tailwind CSS

If you add new utility classes to `index.html` or `js/main.js`, rebuild the compiled stylesheet:

```bash
npx tailwindcss@3 -i css/tailwind-input.css -o css/tailwind.css --minify
```

## What's real vs. placeholder

- All animations, filters, the lightbox, the before/after slider, the testimonial carousel, counters, and the theme toggle are fully functional.
- The **booking form** and **contact form** validate and show an on-page confirmation, but do not currently send anywhere — wire the `<form>` `action`/JS fetch call to a service like Formspree, or a real backend, to receive submissions.
- Photography and design portfolio images are gradient/icon placeholders (no real photo assets were provided) — swap the `.ph-img` divs for real `<img>`s.
- The Google Map embed, WhatsApp number, phone/email, and social links use placeholder values — update them with the real studio details.
- No backend: no database, admin dashboard, authentication, payments, or calendar sync. That would be a separate follow-up build.
