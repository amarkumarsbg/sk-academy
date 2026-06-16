"use client";

import { useState } from "react";
import { NewsCard } from "@/components/public/news-card";
import { PageCta } from "@/components/public/page-cta";
import { PageHero } from "@/components/public/page-hero";
import { PageSection } from "@/components/public/page-section";
import { SectionHeading } from "@/components/public/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSiteContent } from "@/context/site-content-provider";
import { formatDateLong } from "@/lib/format-date";
import type { NewsCategory } from "@/types/site-content";

const NEWS_CATEGORIES: Array<NewsCategory | "All"> = [
  "All",
  "Notice",
  "Announcement",
  "Achievement",
  "Event",
  "Admission Update",
];

export function NewsPageContent() {
  const { content } = useSiteContent();
  const { news, notices, pageHeroes } = content;
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const publishedNotices = notices.filter((n) => n.status === "Published");

  const filteredNews =
    activeCategory === "All" ? news : news.filter((item) => item.category === activeCategory);

  return (
    <>
      <PageHero title={pageHeroes.news.title} description={pageHeroes.news.description} />
      <PageSection>
        {publishedNotices.length > 0 && (
          <div className="mb-8">
            <SectionHeading title="Official Notices" className="mb-4" />
            <div className="grid gap-4 sm:grid-cols-2">
              {publishedNotices.map((notice) => (
                <Card key={notice.id} className="card-interactive h-full">
                  <CardContent className="pt-6">
                    <Badge className="mb-2">Notice</Badge>
                    <h3 className="font-semibold">{notice.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDateLong(notice.date)} · {notice.audience}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <SectionHeading title="Latest News" description="Updates from across the SK Academy community." className="mb-4" />
        <div className="mb-6 flex flex-wrap gap-2">
          {NEWS_CATEGORIES.map((category) => (
            <Button
              key={category}
              type="button"
              size="sm"
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </PageSection>
      <PageCta />
    </>
  );
}
