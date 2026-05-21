import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "../components/layout/PageLayout";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects | uvu1.me" },
      {
        name: "description",
        content: "uvu1.me の制作物一覧です。",
      },
      { property: "og:title", content: "Projects | uvu1.me" },
      {
        property: "og:description",
        content: "uvu1.me の制作物一覧です。",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ProjectsPage,
});

const projects = [
  {
    title: "uvu1.me v2",
    category: "Web",
    description:
      "TanStack Start / Bun / Tailwind CSS で作っているブログサイト。",
    href: "https://uvu1.me",
  },
  {
    title: "Homelab Notes",
    category: "Homelab",
    description:
      "ネットワークや自宅サーバー構成のメモ、検証内容をまとめるプロジェクト。",
    href: "#",
  },
  {
    title: "Article Thumbnail Generator",
    category: "Tooling",
    description:
      "Markdown frontmatter から記事サムネイルをビルド時に自動生成する仕組み。",
    href: "#",
  },
];

function ProjectsPage() {
  return (
    <PageLayout maxWidth="md">
      <Link
        to="/"
        className="text-sm font-medium text-[var(--accent-strong)] transition hover:opacity-70"
      >
        ← Home
      </Link>

      <section className="mt-8">
        <p className="text-sm font-medium text-[var(--muted)]">
          Works / Experiments
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">
          Projects
        </h1>

        <p className="mt-4 leading-8 text-[var(--muted)]">
          作ったもの、試したもの、実験したものをまとめるページです。
        </p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <a
            key={project.title}
            href={project.href}
            target={project.href.startsWith("http") ? "_blank" : undefined}
            rel={project.href.startsWith("http") ? "noreferrer" : undefined}
            className="group bg-white/60 p-5 transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--blue-50)]/60"
          >
            <p className="text-xs font-medium text-[var(--muted)]">
              {project.category}
            </p>

            <h2 className="mt-2 text-lg font-semibold text-[var(--text)] transition group-hover:text-[var(--accent-strong)]">
              {project.title}
            </h2>

            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              {project.description}
            </p>

            <p className="mt-4 text-sm font-medium text-[var(--accent-strong)]">
              View Project →
            </p>
          </a>
        ))}
      </section>
    </PageLayout>
  );
}
