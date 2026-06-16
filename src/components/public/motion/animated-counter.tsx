"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

function parseStatValue(value: string) {
  const match = value.match(/^([^0-9]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { prefix: "", number: 0, suffix: value, decimals: 0 };
  }

  const raw = match[2].replace(/,/g, "");
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;

  return {
    prefix: match[1],
    number: parseFloat(raw),
    suffix: match[3],
    decimals,
  };
}

function formatNumber(value: number, decimals: number) {
  if (decimals > 0) {
    return value.toFixed(decimals);
  }

  return Math.round(value).toLocaleString("en-IN");
}

export function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const shouldReduceMotion = useReducedMotion();
  const parsed = useMemo(() => parseStatValue(value), [value]);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplay(value);
      return;
    }

    if (!isInView) return;

    const controls = animate(0, parsed.number, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplay(`${parsed.prefix}${formatNumber(latest, parsed.decimals)}${parsed.suffix}`);
      },
    });

    return () => controls.stop();
  }, [isInView, parsed, shouldReduceMotion, value]);

  return <span ref={ref}>{display}</span>;
}
