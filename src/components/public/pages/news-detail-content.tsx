"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { ContentImage } from "@/components/public/content-image";
import { NewsCard } from "@/components/public/news-card";
import { PageSection } from "@/components/public/page-section";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { useSiteContent } from "@/context/site-content-provider";
import { formatDateLong, sortByDateDesc } from "@/lib/format-date";
import { stripHtml } from "@/lib/strip-html";

const categoryStyles: Record<string, string> = {
  Notice: "bg-primary text-primary-foreground",
  Announcement: "bg-primary/90 text-primary-foreground",
  Achievement: "bg-primary text-primary-foreground",
  Event: "bg-primary text-primary-foreground",
  "Admission Update": "bg-primary text-primary-foreground",
};

export function NewsDetailContent() {
  const params = useParams<{ id: string }>();
  const { content } = useSiteContent();
  const article = content.news.find((item) => item.id === params.id);

  if (!article || (article.status ?? "Published") !== "Published") {
    return (
      <PageSection containerClassName="max-w-3xl py-16 text-center">
        <h1 className="text-2xl font-semibold">Article not found</h1>
        <ButtonLink href="/news" className="mt-4">
          Back to News
        </ButtonLink>
      </PageSection>
    );
  }

  const articleBody = article.body?.trim() || `<p>${stripHtml(article.excerpt)}</p>`;
  const related = sortByDateDesc(
    content.news.filter(
      (item) => item.id !== article.id && (item.status ?? "Published") === "Published"
    )
  ).slice(0, 3);

  return (
    <>
      <section className="border-b bg-primary py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/news"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-primary-foreground/80 transition hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Link>
          <Badge className={categoryStyles[article.category] ?? "bg-white/15 text-white"}>
            {article.category}
          </Badge>
          <h1 className="mt-4 text-2xl font-bold leading-tight text-primary-foreground sm:text-3xl lg:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 flex items-center gap-2 text-sm text-primary-foreground/75">
            <Calendar className="h-4 w-4 shrink-0" aria-hidden />
            <time dateTime={article.date}>{formatDateLong(article.date)}</time>
          </p>
        </div>
      </section>

      <PageSection containerClassName="max-w-3xl">
        <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl shadow-lg ring-1 ring-foreground/5">
          <ContentImage
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>

        {article.excerpt && (
          <p className="mb-8 border-l-4 border-primary pl-4 text-lg font-medium leading-relaxed text-foreground">
            {stripHtml(article.excerpt)}
          </p>
        )}

        <article
          className="prose prose-base max-w-none text-muted-foreground prose-headings:text-primary prose-headings:font-semibold prose-p:leading-relaxed prose-a:text-primary prose-a:underline prose-strong:text-foreground sm:prose-lg"
          dangerouslySetInnerHTML={{ __html: articleBody }}
        />
      </PageSection>

      {related.length > 0 && (
        <PageSection variant="muted" containerClassName="max-w-7xl">
          <h2 className="mb-6 text-xl font-bold text-primary sm:text-2xl">More news</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </PageSection>
      )}
    </>
  );
}
