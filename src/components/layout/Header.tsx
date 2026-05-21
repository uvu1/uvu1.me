import { Link } from "@tanstack/react-router";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
] as const;

export function Header() {
  return (
    <header className="bg-white/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link
          to="/"
          className="text-xl font-bold tracking-[0.08em] text-[var(--accent-strong)] transition hover:opacity-70"
        >
          uvu1.me
        </Link>

        <nav className="flex items-center gap-8 text-sm font-medium text-[var(--text)]">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="transition hover:text-[var(--accent-strong)]"
            >
              {item.label}
            </Link>
          ))}

          <button
            type="button"
            aria-label="Toggle color theme"
            className="flex h-8 w-16 items-center justify-between rounded-full border border-[var(--border)] bg-white/70 px-2 shadow-sm backdrop-blur transition hover:border-[var(--accent)]"
          >
            <span className="size-4 rounded-full bg-[var(--pink-soft)] shadow-sm" />
            <span className="text-xs text-[var(--accent-strong)]">✦</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
