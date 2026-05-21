import { Link } from "@tanstack/react-router";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Articles", to: "/articles" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
] as const;

export function Header() {
  return (
    <header>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link
          to="/"
          className="bg-gradient-to-r from-[#6FA8DC] via-[#9DB9F2] to-[#E8B7D8] bg-clip-text text-xl font-bold tracking-[0.1em] text-transparent drop-shadow-[0_4px_16px_rgba(127,183,232,0.24)] transition hover:opacity-70"
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
        </nav>
      </div>
    </header>
  );
}
