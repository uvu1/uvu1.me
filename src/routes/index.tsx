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

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const pinnedArticles = getPinnedArticles();
  const archiveArticles = getArchiveArticles();
  const tags = getAllTags();

  return (
    <PageLayout maxWidth="lg">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="bg-white/72 p-8 shadow-[0_16px_50px_rgba(127,183,232,0.12)] backdrop-blur-xl">
          <PinnedSection articles={pinnedArticles} />
          <ArchivesSection articles={archiveArticles} />
        </section>

        <aside className="bg-white/62 p-8 shadow-[0_16px_50px_rgba(127,183,232,0.10)] backdrop-blur-xl">
          <ProfileCard />
          <TagsCard tags={tags} />
        </aside>
      </div>
    </PageLayout>
  );
}
