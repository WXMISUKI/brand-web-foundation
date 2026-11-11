"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

const COLLAPSE_THRESHOLD = 24;

export function SiteHeaderScroll({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setCollapsed(window.scrollY > COLLAPSE_THRESHOLD);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    update();
    setReady(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <header className={`header${collapsed ? " header--scrolled" : ""}`} data-scroll-state={collapsed ? "collapsed" : "expanded"} data-scroll-ready={ready ? "true" : undefined}>{children}</header>;
}
