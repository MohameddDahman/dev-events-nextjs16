<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the DevEvent Next.js App Router project. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the Next.js 15.3+ `instrumentation-client` pattern. Enables automatic exception capture and sets up the reverse proxy ingestion path.
- **`next.config.ts`**: Added reverse proxy rewrites for `/ingest` and `/ingest/static` paths, routing PostHog requests through the Next.js server to improve reliability and reduce tracking-blocker interference. Also set `skipTrailingSlashRedirect: true`.
- **`components/ExploreBtn.tsx`**: Added `posthog.capture("explore_events_clicked")` in the existing `onClick` handler. This tracks when users click the hero CTA button — the top of the discovery funnel.
- **`components/EventCard.tsx`**: Added `"use client"` directive and `posthog.capture("event_card_clicked", { title, slug, location, date })` on the Link `onClick`. Captures which specific event a user clicked, with rich properties for segmentation.
- **`.env.local`**: Created with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables (covered by `.gitignore`).

| Event | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicked the 'Explore Events' button on the homepage hero section, indicating intent to browse events | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked on an event card to view event details, capturing which event was selected (properties: `title`, `slug`, `location`, `date`) | `components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/339233/dashboard/1352124)
- **Insight**: [Event engagement trend](https://us.posthog.com/project/339233/insights/M8itakoy) — Daily trend of both custom events
- **Insight**: [Homepage to event detail conversion funnel](https://us.posthog.com/project/339233/insights/VkLJf9PG) — 3-step funnel: pageview → explore clicked → event card clicked
- **Insight**: [Most clicked events](https://us.posthog.com/project/339233/insights/kk2XE9RK) — Bar chart of event card clicks broken down by event slug
- **Insight**: [Daily active users](https://us.posthog.com/project/339233/insights/zL1ZFePi) — Unique daily visitors over 30 days
- **Insight**: [Explore button click rate](https://us.posthog.com/project/339233/insights/fsCmpAEI) — Weekly comparison of explore clicks vs. pageviews to measure CTA effectiveness

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
