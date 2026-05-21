import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

type PageLayoutProps = {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
};

const maxWidthClass = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[88rem]",
  full: "max-w-none",
};

export function PageLayout({
  children,
  maxWidth = "lg",
}: PageLayoutProps) {
  return (
    <main className="min-h-screen">
      <Header />

      <div className={`mx-auto w-full ${maxWidthClass[maxWidth]} px-6 py-8`}>
        {children}
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-10">
        <Footer />
      </div>
    </main>
  );
}
