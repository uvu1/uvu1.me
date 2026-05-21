export function BackgroundDecor() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffffff_0%,#f7faff_48%,#fbf5ff_100%)]" />

      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#FCECF4]/70 blur-3xl" />
      <div className="absolute left-1/4 top-10 h-80 w-80 rounded-full bg-[#D9ECFF]/70 blur-3xl" />
      <div className="absolute right-[-6rem] top-24 h-96 w-96 rounded-full bg-[#DCE7FF]/70 blur-3xl" />
      <div className="absolute bottom-[-8rem] left-20 h-96 w-96 rounded-full bg-[#E6F2FF]/70 blur-3xl" />
      <div className="absolute bottom-10 right-24 h-80 w-80 rounded-full bg-[#F6E6F8]/60 blur-3xl" />

      <Cloud className="left-[4%] top-[16%] scale-110 opacity-70" />
      <Cloud className="right-[6%] top-[20%] scale-95 opacity-60" />
      <Cloud className="left-[10%] bottom-[10%] scale-125 opacity-55" />
      <Cloud className="right-[12%] bottom-[14%] scale-110 opacity-50" />

      <div className="absolute -bottom-24 left-[-8%] h-56 w-[42rem] rounded-full bg-[var(--card-bg)]/50 blur-2xl" />
      <div className="absolute -bottom-28 right-[-10%] h-64 w-[46rem] rounded-full bg-[#E6F2FF]/55 blur-2xl" />
      <div className="absolute bottom-4 left-[28%] h-40 w-[34rem] rounded-full bg-[#FCECF4]/35 blur-3xl" />

      <Sparkle className="left-[12%] top-[34%]" />
      <Sparkle className="left-[76%] top-[16%] scale-75" />
      <Sparkle className="left-[88%] top-[48%] scale-90" />
      <Sparkle className="left-[30%] bottom-[22%] scale-75" />

      <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(#9DCCF5_1px,transparent_1px)] [background-size:28px_28px]" />
    </div>
  )
}

function Cloud({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="relative h-40 w-80">
        <div className="absolute bottom-4 left-8 h-24 w-40 rounded-full bg-[var(--card-bg)]/65" />
        <div className="absolute bottom-10 left-28 h-28 w-28 rounded-full bg-[var(--card-bg)]/70" />
        <div className="absolute bottom-6 left-48 h-20 w-28 rounded-full bg-[var(--card-bg)]/60" />
        <div className="absolute bottom-2 left-0 h-20 w-72 rounded-full bg-[#E6F2FF]/55 blur-sm" />
      </div>
    </div>
  )
}

function Sparkle({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute text-2xl text-[#A7BDF4]/70 drop-shadow-[0_0_12px_rgba(167,189,244,0.5)] ${className}`}
    >
      ✧
    </div>
  )
}
