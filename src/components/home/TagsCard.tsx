import { Link } from "@tanstack/react-router";

type Tag = {
  name: string;
  count: number;
};

type TagsCardProps = {
  tags: Tag[];
};

export function TagsCard({ tags }: TagsCardProps) {
  return (
    <section className="mt-10 border-t border-[var(--border)] pt-8">
      <h2 className="mb-6 text-xl font-bold tracking-wide text-[var(--accent-strong)]">
        # tags
      </h2>

      {tags.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">
          まだタグがありません。
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link
              key={tag.name}
              to="/tags/$tag"
              params={{ tag: tag.name }}
              className="border border-[var(--border)] bg-white/60 px-4 py-2 text-sm text-[var(--accent-strong)] transition duration-200 hover:bg-[var(--blue-50)]/70 hover:text-[var(--text)]"
            >
              #{tag.name}
              <span className="ml-2 text-xs text-[var(--muted)]">
                {tag.count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
