type SectionTitleProps = {
  children: string
  sparkle?: boolean
}

export function SectionTitle({ children, sparkle = true }: SectionTitleProps) {
  return (
    <h2 className="mb-6 flex items-center gap-2 text-xl font-bold tracking-wide">
      <span className="bg-gradient-to-r from-[#7FB7E8] via-[#A7BDF4] to-[#F2B8D8] bg-clip-text text-2xl leading-none text-transparent">
        #
      </span>

      <span className="text-[var(--accent-strong)]">{children}</span>

      {sparkle && (
        <span className="ml-0.5 bg-gradient-to-r from-[#F2B8D8] via-[#D6C7FF] to-[#9DCCF5] bg-clip-text text-xl leading-none text-transparent">
          ✧
        </span>
      )}
    </h2>
  )
}
