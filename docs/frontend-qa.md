# Wave 6 — Zone 10: production frontend and polish checklist

Merge this zone after Lead's CI/docker smoke and Daniel's production backend.
Backend production configuration and CI remain owned by zones 1 and 2.

## Production frontend

The Docker image runs `npm ci` and `npm run build` in a Node build stage,
then serves only `dist` with Nginx on port 3000. Compose uses this image
without source/node_modules mounts. Nested SPA routes fall back to index.html;
missing generated assets return 404. Hashed assets are cached for one year;
index.html is revalidated so deployments can load fresh asset references.

Vite settings are compiled into the bundle. Set `VITE_BASE_URL` in the root
Compose `.env` (or shell) to the browser-accessible backend origin before
`docker compose build frontend`. For example, use `https://api.example.com`
in production; the local default is `http://127.0.0.1:8000`. Rebuild after
changing it; runtime container environment variables cannot change the bundle.
The backend must allow the frontend origin through its CORS configuration.
For local hot reload, run `npm ci` and `npm run dev` inside `frontend`.

## Checklist for each page owner's PR

Copy this checklist into the PR to `dev`. Record route, viewport, language,
result, and any remaining issue; unchecked items require an explicit follow-up.

- [ ] At 375px and desktop, no horizontal page scroll, clipped text, overlapping
  controls, or unusable navigation. Check Header, mobile menu, Footer, and 404.
- [ ] Meaningful images have useful alt text; decorative images use empty alt.
- [ ] Keyboard navigation reaches all controls with visible focus. Mobile menu
  opens/closes by keyboard and communicates its state to assistive technology.
- [ ] Text contrast is at least 4.5:1 (3:1 for large text); controls and focus
  indicators have sufficient contrast. Use tokens from `src/index.css`.
- [ ] No new hard-coded hex colors outside the variables in `src/index.css`.
- [ ] Loading, network error, retry, and empty API states use the shared visual
  conventions and translated copy. Verify each by throttling/blocking requests
  and testing empty data, then restore the normal API.
- [ ] Forms have labels, announced errors, and usable focus after submission
  (zone 9). Guest comments remain hidden until approved.
- [ ] Check `en`, `am`, and `ru`, including long labels and menu wrapping.
- [ ] Page title matches the route; meta description is present. Verify direct
  navigation and refresh on nested routes in the production container.
- [ ] Offscreen media loads lazily where appropriate. Record bundle warnings;
  route code-splitting belongs to zone 7.
- [ ] `npm run build` succeeds. Attach output and manual check results to the PR.

Route coverage: `/`, `/about-us`, `/course-category`, `/course-category/:id`,
`/courses/:id`, `/events` (redirect), `/events/completed`, `/events/upcoming`,
`/events/happening`, `/events/:tab/:id`, `/contacts`, and an unknown path.
Use existing API IDs for detail pages. Page owners in zones 4–9 verify their
own routes; Lead performs the final whole-site pass.

## Explicit follow-up debt

- Route-specific titles/descriptions and their translations remain a follow-up
  for page owners/SEO review. This PR supplies the shared index.html defaults.
- Dynamic document `lang` belongs to zone 3; bundle splitting belongs to zone 7.
- Full production stack, browser checks at 375px/desktop, and Figma sign-off
  require the running backend and Lead's final QA. This checklist is not a
  claim that those manual checks have passed.
