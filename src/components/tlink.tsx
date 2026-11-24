"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useTransitionNav } from "./transition-provider";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  /** Grow this element into the next page instead of the default card transition. */
  morph?: { background: string; image?: string };
};

export function TLink({ href, morph, onClick, onMouseEnter, children, ...rest }: Props) {
  const { navigate, prefetch } = useTransitionNav();
  const external = /^https?:\/\//.test(href) || href.startsWith("mailto:");

  function handle(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (external || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    navigate(href, morph ? { rect, ...morph } : undefined);
  }

  return (
    <a
      href={href}
      onClick={handle}
      onMouseEnter={(e) => {
        onMouseEnter?.(e);
        if (!external) prefetch(href);
      }}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
