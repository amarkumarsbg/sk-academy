"use client";

import { ContentImage } from "@/components/public/content-image";
import { PageHero } from "@/components/public/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSiteContent } from "@/context/site-content-provider";
import { formatDateLong } from "@/lib/format-date";

export function NewsPageContent() {
  const { content } = useSiteContent();
  const { news, notices, pageHeroes } = content;
  const publishedNotices = notices.filter((n) => n.status === "Published");

  return (
    <>
      <PageHero title={pageHeroes.news.title} description={pageHeroes.news.description} />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {publishedNotices.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-4 text-xl font-semibold">Notices</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {publishedNotices.map((notice) => (
                  <Card key={notice.id}>
                    <CardContent className="pt-6">
                      <Badge className="mb-2">Notice</Badge>
                      <h3 className="font-semibold">{notice.title}</h3>
                      <p className="text-sm text-muted-foreground">{formatDateLong(notice.date)} · {notice.audience}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          <div className="grid gap-8 sm:grid-cols-2">
            {news.map((item) => (
              <Card key={item.id} className="overflow-hidden pt-0">
                <div className="relative aspect-[16/9]">
                  <ContentImage src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge>{item.category}</Badge>
                    <time className="text-xs text-muted-foreground">{formatDateLong(item.date)}</time>
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
