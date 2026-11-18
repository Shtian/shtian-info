# www.shtian.info

My portfolio and playground, made using Astro.

## Security headers

`vercel.json` sets a strict Content-Security-Policy (`script-src 'self'`). Keep all JavaScript in bundled `<script>` tags or files: `is:inline` scripts and inline handlers such as `onclick` are blocked. JSON-LD data blocks are fine. `astro.config.mjs` sets `assetsInlineLimit: 0` so Astro never inlines small scripts into the HTML.
