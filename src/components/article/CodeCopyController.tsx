"use client";

import { useEffect } from "react";

export function CodeCopyController() {
  useEffect(() => {
    async function onClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof HTMLElement)) return;

      const button = target.closest<HTMLButtonElement>(".code-copy-button");

      if (!button) return;

      const code = button.dataset.code ?? "";

      try {
        await navigator.clipboard.writeText(code);

        const original = button.textContent;
        button.textContent = "Copied";

        window.setTimeout(() => {
          button.textContent = original || "Copy";
        }, 1200);
      } catch {
        button.textContent = "Failed";

        window.setTimeout(() => {
          button.textContent = "Copy";
        }, 1200);
      }
    }

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
