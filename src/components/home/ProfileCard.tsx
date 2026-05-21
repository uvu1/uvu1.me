export function ProfileCard() {
  return (
    <section>
      <h2 className="mb-6 text-xl font-bold tracking-wide text-[var(--accent-strong)]">
        # Profile
      </h2>

      <div className="flex flex-col items-center text-center">
        <img
          src="/icon.png"
          alt="uvu1 icon"
          className="size-28 rounded-full border border-[var(--border)] object-cover shadow-[0_12px_32px_rgba(127,183,232,0.18)]"
        />

        <h3 className="mt-4 text-lg font-semibold text-[var(--accent-strong)]">
          uvu1
        </h3>

        <p className="mt-4 text-sm leading-7 text-[var(--text)]">
          こんにちは、uvu1です。
          <br />
          このブログでは、日々の学びや
          <br />
          考えたこと、作ったものを
          <br />
          ゆるく発信しています。
        </p>
      </div>
    </section>
  );
}
