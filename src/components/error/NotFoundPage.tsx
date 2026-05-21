import { Link } from "@tanstack/react-router";
import { FiArrowLeft, FiHome, FiSearch } from "react-icons/fi";

export function NotFoundPage() {
  return (
    <main className="grid min-h-[calc(100vh-12rem)] place-items-center px-6 py-16">
      <section className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-8 text-center shadow-[0_18px_60px_rgba(127,183,232,0.14)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-[#D9ECFF]/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-44 rounded-full bg-[#FCECF4]/70 blur-3xl" />

        <div className="relative">
          <p className="bg-gradient-to-r from-[#7FB7E8] via-[#A7BDF4] to-[#F2B8D8] bg-clip-text text-7xl font-black tracking-tight text-transparent">
            404
          </p>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-[var(--text)]">
            Page Not Found
            <span className="ml-2 bg-gradient-to-r from-[#F2B8D8] via-[#D6C7FF] to-[#9DCCF5] bg-clip-text text-xl leading-none text-transparent">
              ✧
            </span>
          </h1>

          <p className="mt-4 text-sm leading-8 text-[var(--muted)]">
            探しているページは見つかりませんでした。
            <br />
            URLが間違っているか、ページが移動・削除された可能性があります。
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-strong)]/30 bg-white/65 px-5 py-3 text-sm font-bold text-[var(--accent-strong)] transition hover:border-[var(--accent-strong)] hover:bg-[var(--blue-50)]/70"
            >
              <FiHome className="size-4" />
              Homeへ戻る
            </Link>

            <Link
              to="/articles"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-strong)]/20 bg-white/45 px-5 py-3 text-sm font-bold text-[var(--text)] transition hover:border-[var(--accent-strong)]/45 hover:bg-white/75 hover:text-[var(--accent-strong)]"
            >
              <FiSearch className="size-4" />
              Articlesを見る
            </Link>
          </div>

          <button
            type="button"
            onClick={() => history.back()}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--accent-strong)]"
          >
            <FiArrowLeft className="size-4" />
            前のページに戻る
          </button>
        </div>
      </section>
    </main>
  );
}
