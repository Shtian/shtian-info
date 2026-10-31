import type { APIRoute } from "astro";
import { POSTHOG_PERSONAL_API_KEY, POSTHOG_PROJECT_ID } from "astro:env/server";

export const prerender = false;

// Unique people who viewed a page on the live site. Filtering on the host
// keeps local and preview traffic out of the count.
const QUERY = `
  SELECT count(DISTINCT person_id)
  FROM events
  WHERE event = '$pageview'
    AND properties.$host = 'www.shtian.info'
`;

const json = (body: unknown, status: number, cacheControl: string) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": cacheControl,
    },
  });

export const GET: APIRoute = async () => {
  if (!POSTHOG_PROJECT_ID || !POSTHOG_PERSONAL_API_KEY) {
    if (import.meta.env.DEV) {
      console.warn("[visitors] PostHog env vars missing, serving a mock count");
      return json({ count: 12847 }, 200, "no-store");
    }
    return json({ error: "Visitor count is not configured" }, 503, "no-store");
  }

  const res = await fetch(
    `https://eu.posthog.com/api/projects/${POSTHOG_PROJECT_ID}/query/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${POSTHOG_PERSONAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: { kind: "HogQLQuery", query: QUERY },
        name: "shtian.info visitor count",
      }),
    }
  );

  if (!res.ok) {
    console.error(
      `[visitors] PostHog query failed: ${res.status} ${await res.text()}`
    );
    // A short cache so a PostHog outage doesn't turn into a query per page view.
    return json(
      { error: "Could not load the visitor count" },
      502,
      "public, s-maxage=60"
    );
  }

  const data: { results: [[number]] } = await res.json();
  // Vercel's CDN serves the cached count for an hour, then refreshes it in the background.
  return json(
    { count: data.results[0][0] },
    200,
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
};
