import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "../components/layout/PageLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | uvu1.me" },
      {
        name: "description",
        content: "uvu1.me のプロフィール・リンクページです。",
      },
      { property: "og:title", content: "About | uvu1.me" },
      {
        property: "og:description",
        content: "uvu1.me のプロフィール・リンクページです。",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageLayout maxWidth="sm">
      <Link
        to="/"
        className="text-sm font-medium text-[var(--accent-strong)] transition hover:opacity-70"
      >
        ← Home
      </Link>

      <section className="mt-8">
        <p className="text-sm font-medium text-[var(--muted)]">
          Profile / Links
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">
          About
        </h1>

        <p className="mt-4 leading-8 text-[var(--muted)]">
          uvu1 のプロフィール、連絡先、SNSリンクをまとめるページです。
        </p>
      </section>

      <section className="mt-10 border-t border-[var(--border)] pt-8">
        <h2 className="text-xl font-semibold text-[var(--text)]">
          Profile
        </h2>

        <div className="mt-6 flex items-center gap-5">
          <img
            src="/icon.png"
            alt="uvu1 icon"
            className="size-24 border border-[var(--border)] object-cover"
          />

          <div>
            <h3 className="text-lg font-semibold text-[var(--accent-strong)]">
              uvu1
            </h3>

            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              日々の学び、考えたこと、作ったものをゆるく発信しています。
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 border-t border-[var(--border)] pt-8">
        <h2 className="text-xl font-semibold text-[var(--text)]">
          Links
        </h2>

        <div className="mt-6 space-y-3">
          <a
            href="https://github.com/uvu1"
            target="_blank"
            rel="noreferrer"
            className="block bg-transparent px-5 py-4 transition hover:bg-[var(--blue-50)]/60"
          >
            GitHub →
          </a>

          <a
            href="https://x.com/"
            target="_blank"
            rel="noreferrer"
            className="block bg-transparent px-5 py-4 transition hover:bg-[var(--blue-50)]/60"
          >
            X →
          </a>

          <a
            href="mailto:hello@example.com"
            className="block bg-transparent px-5 py-4 transition hover:bg-[var(--blue-50)]/60"
          >
            Mail →
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
