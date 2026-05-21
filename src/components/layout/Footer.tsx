import { Link } from "@tanstack/react-router";

function FooterLogo() {
  return (
    <div className="grid size-14 place-items-center rounded-full border border-[var(--border)] bg-white/70 shadow-[0_10px_30px_rgba(127,183,232,0.18)]">
      <span className="text-2xl text-[var(--accent-strong)]">✽</span>
    </div>
  );
}

function SocialLink({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      className="grid size-9 place-items-center rounded-full text-[var(--accent-strong)] transition hover:bg-[var(--blue-50)]"
    >
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="flex items-center justify-between rounded-[1.75rem] border border-[var(--border)] bg-white/76 px-8 py-6 shadow-[0_16px_50px_rgba(127,183,232,0.16)] backdrop-blur-xl">
      <div className="flex items-center gap-8">
        <FooterLogo />

        <nav className="flex items-center gap-7 text-sm font-medium text-[var(--text)]">
          <Link to="/" className="transition hover:text-[var(--accent-strong)]">
            Home 
          </Link>
          <Link to="/about" className="transition hover:text-[var(--accent-strong)]">
            About 
          </Link>
          <Link to="/projects" className="transition hover:text-[var(--accent-strong)]">
            Projects
          </Link>
        </nav>

        <div className="h-8 w-px bg-[var(--border)]" />

        <div className="flex items-center gap-3">
          <SocialLink label="Instagram">
            <span className="text-lg">◎</span>
          </SocialLink>

          <SocialLink label="X">
            <span className="text-lg">𝕏</span>
          </SocialLink>

          <SocialLink label="GitHub">
            <span className="text-lg">⌘</span>
          </SocialLink>

          <SocialLink label="Mail">
            <span className="text-lg">✉</span>
          </SocialLink>
        </div>
      </div>

      <p className="text-sm text-[var(--muted)]">© 2026 uvu1.me</p>
    </footer>
  );
}
