import { Link } from '@tanstack/react-router'
import { FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { FiMail } from 'react-icons/fi'
import { SiMisskey } from 'react-icons/si'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Articles', to: '/articles' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
] as const

const socialItems = [
  {
    label: 'GitHub',
    href: 'https://github.com/uvu1',
    icon: FaGithub,
  },
  {
    label: 'X',
    href: 'https://x.com/kigou_',
    icon: FaXTwitter,
  },
  {
    label: 'Misskey',
    href: 'https://misskey.io/@kigou',
    icon: SiMisskey,
  },
  {
    label: 'Mail',
    href: 'mailto:me@uvu1.me',
    icon: FiMail,
  },
] as const

export function Footer() {
  return (
    <footer className="rounded-[2rem] border border-white/70 bg-[var(--card-bg)]/60 px-8 py-6 shadow-[0_18px_60px_rgba(127,183,232,0.12)] backdrop-blur-xl">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-6">
          <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-[var(--text)]">
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

          <div className="hidden h-7 w-px bg-[var(--border)] md:block" />

          <div className="flex items-center gap-3">
            {socialItems.map((item) => {
              const Icon = item.icon

              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                  aria-label={item.label}
                  className="grid size-9 place-items-center rounded-full border border-transparent text-[var(--accent-strong)] transition duration-200 hover:border-[var(--accent-strong)]/35 hover:bg-[var(--blue-50)]/70"
                >
                  <Icon className="size-4" />
                </a>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <p>© 2026 uvu1.me</p>

          <span className="bg-gradient-to-r from-[#F2B8D8] via-[#D6C7FF] to-[#9DCCF5] bg-clip-text text-xl leading-none text-transparent">
            ✧
          </span>
        </div>
      </div>
    </footer>
  )
}
