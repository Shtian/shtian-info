import { getCollection } from "astro:content";

export async function GET() {
  const projects = await getCollection("projects");
  const pages = ["", "/projects"];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map(
          (page) => `
        <url>
          <loc>https://shtian.info${page}</loc>
          <changefreq>monthly</changefreq>
        </url>
      `,
        )
        .join("")}
      ${projects
        .map(
          (project) => `
        <url>
          <loc>https://shtian.info/projects/${project.id}</loc>
          <lastmod>${project.data.date.toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
        </url>
      `,
        )
        .join("")}
    </urlset>`,
    {
      headers: {
        "Content-Type": "application/xml",
      },
    },
  );
}
