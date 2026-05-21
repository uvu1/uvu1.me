import { Link } from "@tanstack/react-router";

type TagPillProps = {
  name: string;
  count?: number;
  to?: "tag" | "none";
  size?: "sm" | "md";
  className?: string;
};

const sizeClass = {
  sm: {
    root: "px-3 py-1 text-xs",
    hash: "text-base",
    count: "text-[0.65rem]",
  },
  md: {
    root: "px-3.5 py-1.5 text-sm",
    hash: "text-lg",
    count: "text-xs",
  },
};

function TagPillInner({
  name,
  count,
  size = "md",
}: Pick<TagPillProps, "name" | "count" | "size">) {
  const s = sizeClass[size];

  return (
    <>
      <span
        className={[
          "mr-0.5 font-sans font-bold leading-none text-[var(--accent-strong)]",
          s.hash,
        ].join(" ")}
      >
        #
      </span>

      <span className="text-[var(--text)]">{name}</span>

      {typeof count === "number" && (
        <span className={["ml-2 text-[var(--muted)]", s.count].join(" ")}>
          {count}
        </span>
      )}
    </>
  );
}

export function TagPill({
  name,
  count,
  to = "none",
  size = "md",
  className = "",
}: TagPillProps) {
  const s = sizeClass[size];

  const baseClassName = [
    "inline-flex items-center rounded-full border border-[var(--accent-strong)]/45 bg-[var(--card-bg)]/50 transition duration-200",
    "hover:border-[var(--accent-strong)] hover:bg-[var(--blue-50)]/70",
    s.root,
    className,
  ].join(" ");

  if (to === "tag") {
    return (
      <Link
        to="/tags/$tag"
        params={{ tag: name }}
        className={baseClassName}
      >
        <TagPillInner name={name} count={count} size={size} />
      </Link>
    );
  }

  return (
    <span className={baseClassName}>
      <TagPillInner name={name} count={count} size={size} />
    </span>
  );
}
