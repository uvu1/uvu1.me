type ArticleBodyProps = {
  html: string;
};

export function ArticleBody({ html }: ArticleBodyProps) {
  return (
    <div
      className="article-body mt-12 text-[var(--text)]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
