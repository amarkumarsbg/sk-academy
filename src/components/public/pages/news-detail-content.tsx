"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ContentImage } from "@/components/public/content-image";
import { PageHero } from "@/components/public/page-hero";
import { PageSection } from "@/components/public/page-section";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { useSiteContent } from "@/context/site-content-provider";
import { formatDateLong } from "@/lib/format-date";

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

  return (
    <>
      <PageHero title={article.title} description={formatDateLong(article.date)} />
      <PageSection containerClassName="max-w-3xl">
        <Link href="/news" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to News
        </Link>
        <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl">
          <ContentImage src={article.image} alt={article.title} fill className="object-cover" />
        </div>
        <Badge className="mb-4">{article.category}</Badge>
        <div
          className="prose prose-sm max-w-none text-muted-foreground [&_a]:text-primary [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: article.excerpt }}
        />
      </PageSection>
    </>
  );
}
