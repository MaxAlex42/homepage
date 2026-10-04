export interface ChangelogEntry {
  version: string;
  title: string;
  description: string;
  date: string;
}

export const changelog: ChangelogEntry[] = [
  {
    version: "0.0.4",
    title: "Projects System",
    description:
      "Added a complete projects system with Markdown-based project entries, filtering by technology and status, project statistics, individual project detail pages, repository and website links, and featured projects on the homepage.",
    date: "2026-10-04",
  },
  {
    version: "0.0.3",
    title: "Blog system",
    description:
      "Added Markdown blog posts, filtering, article pages and RSS support.",
    date: "2026-10-04",
  },
  {
    version: "0.0.2",
    title: "Three-column homepage",
    description:
      "Added the new homepage layout with dedicated left, main, and right columns.",
    date: "2026-07-11",
  },
];
