import { SectionTitle } from "../ui/SectionTitle";

export function ProfileCard() {
  return (
    <section>
      <SectionTitle>Profile</SectionTitle>

      <div className="flex flex-col items-center text-center">
        <img
          src="/icon.png"
          alt="uvu1 icon"
          className="size-28 rounded-full border border-[var(--border)] object-cover shadow-[0_12px_32px_rgba(127,183,232,0.18)]"
        />

        <h3 className="mt-4 text-lg font-semibold text-[var(--accent-strong)]">
          ?Sw()m%kLc$VfD!!
        </h3>

        <p className="mt-4 text-sm leading-7 text-[var(--text)]">
          💕Rust and Vim⋆。˚✩
        </p>
      </div>
    </section>
  );
}
