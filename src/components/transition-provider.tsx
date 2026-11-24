"use client";

import { createContext, Suspense, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

export type Morph = { rect: DOMRect; background: string; image?: string };
type Ctx = { navigate: (href: string, morph?: Morph) => void; prefetch: (href: string) => void };

const TransitionContext = createContext<Ctx | null>(null);
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
// Two animation frames, with a timer fallback: hidden tabs pause rAF, which would otherwise freeze the overlay.
const frame = () =>
  new Promise<void>((r) => {
    const t = setTimeout(r, 60);
    requestAnimationFrame(() => requestAnimationFrame(() => { clearTimeout(t); r(); }));
  });

function snapshot(): HTMLElement | null {
  const page = document.querySelector<HTMLElement>("[data-kv-page]");
  if (!page) return null;
  const clone = page.cloneNode(true) as HTMLElement;
  clone.removeAttribute("data-kv-page");
  clone.setAttribute("aria-hidden", "true");
  Object.assign(clone.style, { position: "absolute", left: "0", width: "100%", top: `${-window.scrollY}px`, pointerEvents: "none" });
  return clone;
}

function el(styles: Partial<CSSStyleDeclaration>): HTMLDivElement {
  const d = document.createElement("div");
  Object.assign(d.style, styles);
  return d;
}

function enterTitles(late: boolean) {
  const root = document.documentElement;
  root.classList.remove("kv-entering", "kv-entering-late");
  void root.offsetWidth;
  root.classList.add("kv-entering");
  if (late) root.classList.add("kv-entering-late");
  setTimeout(() => root.classList.remove("kv-entering", "kv-entering-late"), 1600);
}

export function TransitionProvider({ children, chrome }: { children: ReactNode; chrome?: ReactNode }) {
  const router = useRouter();
  const busy = useRef(false);
  const arrived = useRef<((path: string) => void) | null>(null);

  const go = useCallback(
    (href: string) =>
      new Promise<void>((resolve) => {
        const target = href.split("#")[0].split("?")[0];
        arrived.current = (p) => {
          if (p === target) {
            arrived.current = null;
            resolve();
          }
        };
        router.push(href, { scroll: false });
        setTimeout(resolve, 2500);
      }),
    [router],
  );

  const navigate = useCallback(
    async (href: string, morph?: Morph) => {
      const target = href.split("#")[0];
      if (busy.current || target === window.location.pathname) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        router.push(href);
        return;
      }
      busy.current = true;
      try {
        if (morph) {
          const { rect } = morph;
          const W = window.innerWidth;
          const H = window.innerHeight;
          const overlay = el({ position: "fixed", inset: "0", zIndex: "900", pointerEvents: "auto" });
          overlay.dataset.kvOverlay = "";
          const grow = el({
            position: "absolute", inset: "0", backgroundColor: morph.background,
            backgroundImage: morph.image ? `url(${morph.image})` : "", backgroundSize: "cover", backgroundPosition: "center",
            clipPath: `inset(${rect.top}px ${W - rect.right}px ${H - rect.bottom}px ${rect.left}px round 6px)`,
          });
          overlay.appendChild(grow);
          document.body.appendChild(overlay);
          await frame();
          grow.style.transition = `clip-path 800ms ${EASE}, opacity 300ms ease`;
          grow.style.clipPath = "inset(0px 0px 0px 0px round 0px)";
          await wait(820);
          await go(href);
          window.scrollTo(0, 0);
          await frame();
          enterTitles(false);
          grow.style.opacity = "0";
          await wait(320);
          overlay.remove();
        } else {
          const stage = el({ position: "fixed", inset: "0", zIndex: "900", background: "#000", pointerEvents: "auto" });
          stage.dataset.kvOverlay = "";
          const card = el({ position: "absolute", inset: "0", overflow: "hidden", background: "#fff", transformOrigin: "50% 50%" });
          const ghost = snapshot();
          if (ghost) card.appendChild(ghost);
          stage.appendChild(card);
          document.body.appendChild(stage);
          await frame();
          card.style.transition = `transform 520ms ${EASE}, border-radius 520ms ${EASE}`;
          card.style.transform = "scale(0.86)";
          card.style.borderRadius = "24px";
          await wait(540);
          await go(href);
          window.scrollTo(0, 0);
          await frame();
          enterTitles(true);
          const sheet = el({ position: "absolute", inset: "0", overflow: "hidden", transform: "translateY(100%)", background: "#fff" });
          const next = snapshot();
          if (next) sheet.appendChild(next);
          card.appendChild(sheet);
          await frame();
          sheet.style.transition = `transform 640ms ${EASE}`;
          sheet.style.transform = "translateY(0)";
          await wait(660);
          card.style.transform = "scale(1)";
          card.style.borderRadius = "0px";
          await wait(560);
          stage.remove();
        }
      } finally {
        document.querySelectorAll("[data-kv-overlay]").forEach((n) => n.remove());
        busy.current = false;
      }
    },
    [go, router],
  );

  const prefetch = useCallback((href: string) => router.prefetch(href), [router]);

  return (
    <TransitionContext.Provider value={{ navigate, prefetch }}>
      <div data-kv-page>{children}</div>
      {chrome}
      <Suspense fallback={null}>
        <PathWatcher onChange={(p) => arrived.current?.(p)} />
      </Suspense>
    </TransitionContext.Provider>
  );
}

export function useTransitionNav() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransitionNav must be used inside TransitionProvider");
  return ctx;
}

function PathWatcher({ onChange }: { onChange: (path: string) => void }) {
  const pathname = usePathname();
  useEffect(() => {
    onChange(pathname);
  }, [pathname, onChange]);
  return null;
}
