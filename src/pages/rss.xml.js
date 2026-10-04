import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = (await getCollection("blog", ({ data }) => {
    return !data.draft;
  })).sort(
    (a, b) =>
      b.data.published.getTime() -
      a.data.published.getTime()
  );

  return rss({
    title: "MaxAlex42 Blog",
    description: "Notes, projects and experiments.",
    site: context.site,

    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.abstract,
      pubDate: post.data.published,
      link: `/blog/${post.id}`,
    })),
  });
}