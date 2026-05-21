import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "../components/layout/PageLayout";
import { PinnedSection } from "../components/home/PinnedSection";
import { ArchivesSection } from "../components/home/ArchivesSection";
import { ProfileCard } from "../components/home/ProfileCard";
import { TagsCard } from "../components/home/TagsCard";
import {
  getAllTags,
  getArchiveArticles,
  getPinnedArticles,
} from "../lib/articles";
import { siteConfig } from "../config/site";

export const Route = createFileRoute("/")({
  head: () => {
    const title = `${siteConfig.name}`;
    const description = "uvu1.me ";
    const url = `${siteConfig.url}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:image", content: `${siteConfig.url}/ogp.png` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: `${siteConfig.url}/ogp.png` },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: HomePage,
});

function HomePage() {
  const pinnedArticles = getPinnedArticles();
  const archiveArticles = getArchiveArticles();
  const tags = getAllTags();

  return (
    <PageLayout maxWidth="lg">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[2rem] bg-[var(--card-bg)]/72 p-8 shadow-[0_16px_50px_rgba(127,183,232,0.12)] backdrop-blur-xl space-y-10">
          <PinnedSection articles={pinnedArticles} />
          <ArchivesSection articles={archiveArticles} />
        </section>
        <aside className="rounded-[2rem] bg-[var(--card-bg)]/62 p-8 shadow-[0_16px_50px_rgba(127,183,232,0.10)] backdrop-blur-xl">
          <ProfileCard />
          <TagsCard tags={tags} />
        </aside>
      </div>
    </PageLayout>
  );
}
