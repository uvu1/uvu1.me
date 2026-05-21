type ArticleThumbProps = {
  src: string;
  title: string;
  className?: string;
};

export function ArticleThumb({
  src,
  title,
  className = "",
}: ArticleThumbProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] ${className}`}
    >
      <img
        src={src}
        alt={`${title} のサムネイル`}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
