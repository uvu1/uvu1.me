import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { BackgroundDecor } from './BackgroundDecor'

type PageLayoutProps = {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const maxWidthClass = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[88rem]',
  full: 'max-w-none',
}

export function PageLayout({ children, maxWidth = 'lg' }: PageLayoutProps) {
  return (
    <main className="relative min-h-screen">
      <BackgroundDecor />

      <Header />

      <div
        className={[
          "page-transition-surface mx-auto w-full px-4 py-8 sm:px-6 lg:px-8",
          maxWidthClass[maxWidth],
        ].join(" ")}
      >
        {children}
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-10">
        <Footer />
      </div>
    </main>
  )
}
