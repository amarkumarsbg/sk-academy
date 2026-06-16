import type { Metadata } from "next";
import { HomePageContent } from "@/components/public/pages/home-page-content";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return <HomePageContent />;
}
