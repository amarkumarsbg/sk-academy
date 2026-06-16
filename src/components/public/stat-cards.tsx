"use client";

import { GraduationCap, TrendingUp, Trophy, Users } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedCounter } from "@/components/public/motion/animated-counter";
import type { StatItem } from "@/types/site-content";

const iconMap = {
  students: GraduationCap,
  teachers: Users,
  years: Trophy,
  success: TrendingUp,
};

export function StatCards({ stats }: { stats: StatItem[] }) {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon ? iconMap[stat.icon] : GraduationCap;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35, margin: "-40px" }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-foreground/5"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 + 0.15 }}
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent"
            >
              <Icon className="h-6 w-6" />
            </motion.div>
            <p className="text-3xl font-bold text-primary">
              <AnimatedCounter value={stat.value} />
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
