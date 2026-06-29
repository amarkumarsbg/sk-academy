"use client";

import { useEffect } from "react";

/**
 * Ensures mobile browsers can scroll the admin portal when nested overflow
 * layouts fail (common on iOS Safari).
 */
export function AdminScrollUnlock() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlHeight = html.style.height;
    const prevBodyHeight = body.style.height;

    const unlock = () => {
      if (window.matchMedia("(max-width: 767px)").matches) {
        html.style.overflow = "auto";
        html.style.height = "auto";
        body.style.overflow = "auto";
        body.style.height = "auto";
      }
    };

    unlock();
    window.addEventListener("resize", unlock);

    return () => {
      window.removeEventListener("resize", unlock);
      html.style.overflow = prevHtmlOverflow;
      html.style.height = prevHtmlHeight;
      body.style.overflow = prevBodyOverflow;
      body.style.height = prevBodyHeight;
    };
  }, []);

  return null;
}
