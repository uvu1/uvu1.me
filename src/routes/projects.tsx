import { createFileRoute } from "@tanstack/react-router";
import { FiExternalLink, } from "react-icons/fi";
import { PageLayout } from "../components/layout/PageLayout";
import { SectionTitle } from "../components/ui/SectionTitle";
import { getAllProjects } from "../lib/projects";
import type { Project, ProjectStatus } from "../lib/projects";
import { siteConfig } from "../config/site";
import { createSeo } from "../lib/seo";

export const Route = createFileRoute("/projects")({
  head: () => {
    return createSeo({
      title: `Projects | ${siteConfig.name}`,
      description: `uvu1.me で公開しているプロジェクトの一覧です。`,
      path: "/projects"
    })
  },
  component: ProjectsPage,
});

function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <PageLayout maxWidth="lg">
      <main className="rounded-[2rem] border border-white/70 bg-[var(--card-bg)]/70 p-8 shadow-[0_18px_60px_rgba(127,183,232,0.14)] backdrop-blur-xl">
        <section>
          <SectionTitle>Projects</SectionTitle>

          <p className="max-w-2xl text-sm leading-8 text-[var(--muted)]">
            作ったもの・試したもの・育てているものを並べています。
          </p>
        </section>

        <section className="mt-8">
          <TerminalProjectList projects={projects} />
        </section>
      </main>
    </PageLayout>
  );
}

function TerminalProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[#182536]/80 bg-[#101827] shadow-[0_20px_70px_rgba(16,24,39,0.24)]">
      <div className="flex items-center justify-between border-b border-white/10 bg-[var(--card-bg)]/[0.03] px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#F2B8D8]" />
          <span className="size-3 rounded-full bg-[#F8E3A1]" />
          <span className="size-3 rounded-full bg-[#9DCCF5]" />
        </div>

        <p className="font-mono text-xs text-white/45">~/projects</p>
      </div>

      <div className="px-5 py-5 font-mono text-sm">
        <p className="text-[#9DCCF5]">
          <span className="text-white/45">$</span> ls ~/projects
        </p>

        <div className="mt-5 divide-y divide-white/10">
          {projects.map((project) => (
            <TerminalProjectItem key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TerminalProjectItem({ project }: { project: Project }) {
  return (
    <article className="group py-5 first:pt-0 last:pb-0">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#7EE0B5]">&gt;</span>

            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-base font-bold text-[#9DCCF5] transition hover:text-[#B7DDFF] hover:underline hover:underline-offset-4"
              >
                {project.title}
              </a>
            ) : (
              <h2 className="font-mono text-base font-bold text-[#9DCCF5]">
                {project.title}
              </h2>
            )}

            {project.featured && (
              <span className="rounded-full border border-[#F2B8D8]/35 bg-[#FCECF4]/10 px-2 py-0.5 text-[0.65rem] font-bold text-[#F2B8D8]">
                featured
              </span>
            )}
          </div>

          {project.description && (
            <p className="mt-1 max-w-2xl whitespace-pre-wrap text-xs leading-6 text-white/55">
              {project.description}
            </p>
          )}

          {project.stack.length > 0 && (
            <p className="mt-3 text-xs text-white/45">
              <span className="text-white/30">stack:</span>{" "}
              <span className="text-white/70">
                {project.stack.join(" / ")}
              </span>
            </p>
          )}
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <StatusBadge status={project.status} />
          <div className="flex items-center gap-2">

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} link`}
                className="grid size-8 place-items-center rounded-full border border-white/10 text-white/55 transition hover:border-[#9DCCF5]/50 hover:bg-[#9DCCF5]/10 hover:text-[#9DCCF5]"
              >
                <FiExternalLink className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const statusClass = {
    running: "border-[#7EE0B5]/40 bg-[#7EE0B5]/10 text-[#7EE0B5]",
    planning: "border-[#F2B8D8]/40 bg-[#F2B8D8]/10 text-[#F2B8D8]",
    archived: "border-white/20 bg-[var(--card-bg)]/5 text-white/45",
  } satisfies Record<ProjectStatus, string>;

  return (
    <span
      className={[
        "rounded-full border px-2.5 py-1 text-[0.68rem] font-bold",
        statusClass[status],
      ].join(" ")}
    >
      status: {status}
    </span>
  );
}
