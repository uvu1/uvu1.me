import { createFileRoute } from '@tanstack/react-router'
import { FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { FiCode, FiHeart, FiMapPin, FiTool } from 'react-icons/fi'
import { SiMisskey } from 'react-icons/si'
import { PageLayout } from '../components/layout/PageLayout'
import { SectionTitle } from '../components/ui/SectionTitle'
import { TagPill } from '../components/ui/TagPill'
import { siteConfig } from '../config/site'
import { createSeo } from '../lib/seo'

export const Route = createFileRoute('/about')({
  head: () => {
    return createSeo({
      title: `About | ${siteConfig.name}`,
      description: 'uvu1.meのプロフィールです。',
      path: '/about',
      type: 'website',
    })
  },
  component: AboutPage,
})

const profileItems = [
  {
    icon: FiTool,
    label: 'Tools',
    value: 'Rust, TypeScript, Vim',
  },
  {
    icon: FiHeart,
    label: 'Interest',
    value: 'Infra, CLI, Security',
  },
  {
    icon: FiMapPin,
    label: 'Location',
    value: 'Japan',
  },
]

const skills = ['Rust', 'TypeScript', 'Python', 'C++', 'neovim', 'Kubernetes']

const timelineItems = [
  {
    year: '2019',
    title: 'Start',
    description: 'プログラミングを初めてDiscordBotをリリース',
  },
  {
    year: '2021',
    title: 'Developing Yui',
    description: 'DiscordBot Yuiを開発。100サーバー以上で利用される。',
  },
  {
    year: '2023',
    title: 'Working with ESCL',
    description: 'ESCLにてスクリム内部の集計アプリを開発。',
  },
  {
    year: '2025',
    title: 'Learning',
    description:
      'セキュリティやインフラについて自宅サーバーを運用しながら学ぶ。',
  },
  {
    year: '2026',
    title: 'Seccamp',
    description: 'セキュリティ・キャンプ 2026 専門Bに参加。',
  },
  {
    year: 'Now',
    title: 'Working',
    description: 'Kubernetes、認証認可を中心に学習中。',
  },
]

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
]

function AboutPage() {
  return (
    <PageLayout maxWidth="lg">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <ProfileCard />
          <InfoCard />
        </aside>

        <main className="rounded-[2rem] border border-white/70 bg-[var(--card-bg)]/70 p-8 shadow-[0_18px_60px_rgba(127,183,232,0.14)] backdrop-blur-xl">
          <section>
            <p className="text-sm font-semibold text-[var(--accent-strong)]">
              About Me
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--text)]">
              Biography
              <span className="ml-2 bg-gradient-to-r from-[#F2B8D8] via-[#D6C7FF] to-[#9DCCF5] bg-clip-text text-2xl leading-none text-transparent">
                ✧
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-8 text-[var(--muted)]">
              技術のこと、作ったもの、考えたことから日常の何でも無いことまでいろいろなことを記録する予定です。
              <br />
            </p>
          </section>

          <section className="mt-12">
            <SectionTitle>Timeline</SectionTitle>
            <Timeline />
          </section>
        </main>
      </div>
    </PageLayout>
  )
}

function ProfileCard() {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-[var(--card-bg)]/70 p-7 shadow-[0_18px_60px_rgba(127,183,232,0.12)] backdrop-blur-xl">
      <div className="flex flex-col items-center text-center">
        <img
          src="/icon.png"
          alt="uvu1 icon"
          className="size-28 rounded-full border border-[var(--accent-strong)]/20 object-cover shadow-[0_12px_30px_rgba(127,183,232,0.18)]"
        />

        <h2 className="mt-5 bg-gradient-to-r from-[#7FB7E8] via-[#A7BDF4] to-[#F2B8D8] bg-clip-text text-xl font-bold tracking-wide text-transparent">
          ?Sw()m%kLc$VfD!!
        </h2>

        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          自認フルスタックエンジニア。
          <br />
          CLIとインフラが大好きです。
        </p>

        <div className="mt-6 flex items-center gap-3">
          {socialItems.map((item) => {
            const Icon = item.icon

            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                className="grid size-10 place-items-center rounded-full border border-[var(--accent-strong)]/25 bg-[var(--card-bg)]/60 text-[var(--accent-strong)] transition hover:border-[var(--accent-strong)] hover:bg-[var(--blue-50)]/70"
              >
                <Icon className="size-4" />
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function InfoCard() {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-[var(--card-bg)]/62 p-6 shadow-[0_18px_60px_rgba(127,183,232,0.1)] backdrop-blur-xl">
      <div className="space-y-5">
        {profileItems.map((item) => {
          const Icon = item.icon

          return (
            <div key={item.label} className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--blue-50)] text-[var(--accent-strong)]">
                <Icon className="size-4" />
              </span>

              <div>
                <p className="text-xs font-bold text-[var(--accent-strong)]">
                  {item.label}
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--text)]">
                  {item.value}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 border-t border-[var(--border)] pt-6">
        <p className="mb-3 text-xs font-bold text-[var(--accent-strong)]">
          Skills
        </p>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <TagPill key={skill} name={skill} size="sm" />
          ))}
        </div>
      </div>
    </section>
  )
}

function Timeline() {
  return (
    <div className="relative mt-8">
      <div className="absolute left-[0.55rem] top-2 bottom-2 w-px bg-[var(--accent-strong)]/35" />

      <div className="space-y-8">
        {timelineItems.map((item, index) => {
          const isLatest = index === timelineItems.length - 1

          return (
            <div
              key={item.year}
              className="relative grid gap-5 pl-10 sm:grid-cols-[5rem_minmax(0,1fr)]"
            >
              <span
                className={[
                  'absolute left-0 top-1.5 size-5 rounded-full border-2 border-[var(--accent-strong)]',
                  isLatest
                    ? 'bg-[var(--accent-strong)]'
                    : 'bg-[var(--card-bg)]',
                ].join(' ')}
              />

              <time className="text-sm font-bold text-[var(--accent-strong)]">
                {item.year}
              </time>

              <div className="rounded-[1.5rem] border border-[var(--accent-strong)]/20 bg-[var(--card-bg)]/50 p-5 transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--blue-50)]/50">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--blue-50)] text-[var(--accent-strong)]">
                    <FiCode className="size-4" />
                  </span>

                  <div>
                    <h3 className="text-base font-bold text-[var(--text)]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-7 text-[var(--muted)]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
