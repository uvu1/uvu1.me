import { createFileRoute } from '@tanstack/react-router'
import { PageLayout } from '../components/layout/PageLayout'
import { PinnedSection } from '../components/home/PinnedSection'
import { ArchivesSection } from '../components/home/ArchivesSection'
import { ProfileCard } from '../components/home/ProfileCard'
import { TagsCard } from '../components/home/TagsCard'
import {
  getAllTags,
  getArchiveArticles,
  getPinnedArticles,
} from '../lib/articles'
import { siteConfig } from '../config/site'
import { createSeo } from '../lib/seo'

export const Route = createFileRoute('/')({
  head: () => {
    return createSeo({
      title: siteConfig.name,
      description: 'uvu1.me',
      path: '/',
    })
  },
  component: HomePage,
})

function HomePage() {
  const pinnedArticles = getPinnedArticles()
  const archiveArticles = getArchiveArticles()
  const tags = getAllTags()

  return (
    <PageLayout maxWidth="lg">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="glass-card rounded-[2rem] p-5 space-y-10 sm:p-8">
          <PinnedSection articles={pinnedArticles} />
          <ArchivesSection articles={archiveArticles} />
        </section>
        <aside className="glass-card rounded-[2rem] p-5 sm:p-8">
          <ProfileCard />
          <TagsCard tags={tags} />
        </aside>
      </div>
    </PageLayout>
  )
}
