import { SectionTitle } from '../ui/SectionTitle'
import { TagPill } from '../ui/TagPill'

type Tag = {
  name: string
  count: number
}

type TagsCardProps = {
  tags: Tag[]
}

export function TagsCard({ tags }: TagsCardProps) {
  return (
    <section className="mt-10 border-t border-[var(--border)] pt-8">
      <SectionTitle>Tags</SectionTitle>

      {tags.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">まだタグがありません。</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <TagPill
              key={tag.name}
              name={tag.name}
              count={tag.count}
              to="tag"
              size="md"
            />
          ))}
        </div>
      )}
    </section>
  )
}
