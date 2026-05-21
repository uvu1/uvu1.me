import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
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
    <main className="min-h-screen">
      <Header />

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_360px]">
        <section className="bg-white/72 p-8 shadow-[0_16px_50px_rgba(127,183,232,0.12)] backdrop-blur-xl">
          <PinnedSection articles={pinnedArticles} />
          <ArchivesSection articles={archiveArticles} />
        </section>

        <aside className="bg-white/62 p-8 shadow-[0_16px_50px_rgba(127,183,232,0.10)] backdrop-blur-xl">
          <ProfileCard />
          <TagsCard tags={tags} />
        </aside>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-10">
        <Footer />
      </div>
    </main>
  );
}
