import { createFileRoute } from '@tanstack/react-router'
import { Header } from "../components/layout/Header"
import { Footer } from "../components/layout/Footer"

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_360px]">
        <section className="min-h-[680px] rounded-[1.75rem] border border-[var(--border)] bg-white/72 p-8 shadow-[0_16px_50px_rgba(127,183,232,0.12)] backdrop-blur-xl">
          <h2 className="text-xl font-bold text-[var(--accent-strong)]">
            # Pinned
          </h2>
        </section>

        <aside className="rounded-[1.75rem] border border-[var(--border)] bg-white/62 p-8 shadow-[0_16px_50px_rgba(127,183,232,0.10)] backdrop-blur-xl">
          <h2 className="text-xl font-bold text-[var(--accent-strong)]">
            # Profile
          </h2>
        </aside>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-10">
        <Footer />
      </div>
    </main>
  );
}
