import { getCollection } from "astro:content";


export async function getPublishedPosts() {
  return (
    await getCollection(
      "blog",
      ({ data }) => !data.draft
    )
  ).sort(
    (a, b) =>
      b.data.published.getTime() -
      a.data.published.getTime()
  );
}


export async function getSeriesPosts(
  seriesId: string
) {
  const posts =
    await getPublishedPosts();

  return posts
    .filter(
      (post) =>
        post.data.series?.id ===
        seriesId
    )
    .sort(
      (a, b) =>
        (a.data.series?.order ?? 0) -
        (b.data.series?.order ?? 0)
    );
}