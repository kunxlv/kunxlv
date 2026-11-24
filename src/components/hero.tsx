"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { MouseEvent } from "react";

const words = ["Distributed", "systems", "that", "stay", "up."];

export function Hero() {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const x = useSpring(useTransform(mx, [0, 1], ["-10%", "10%"]), { stiffness: 60, damping: 20 });
  const y = useSpring(useTransform(my, [0, 1], ["-10%", "10%"]), { stiffness: 60, damping: 20 });

  function onMove(e: MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  return (
    <section
      onMouseMove={onMove}
      className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden px-6 md:px-16"
    >
      <motion.div
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,59,47,0.28),transparent_60%)] blur-3xl"
      />
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-mono text-sm uppercase tracking-[0.3em] text-muted"
      >
        Kunal Vaidya · Senior Backend Engineer · Dublin
      </motion.p>
      <h1 className="mt-6 max-w-5xl text-5xl font-semibold leading-[1.02] tracking-tight md:text-8xl">
        {words.map((w, i) => (
          <span key={w} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
            <motion.span
              className={`inline-block ${i === words.length - 1 ? "text-accent" : ""}`}
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="mt-8 max-w-xl text-lg text-muted"
      >
        Microservices, event-driven pipelines and LLM integrations. Full portfolio coming soon.
      </motion.p>
      <motion.a
        href="https://github.com/kunxlv"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm transition-colors hover:border-accent hover:text-accent"
      >
        GitHub ↗
      </motion.a>
    </section>
  );
}
