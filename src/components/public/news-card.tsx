import { ContentImage } from "@/components/public/content-image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateLong } from "@/lib/format-date";
import type { NewsItem } from "@/types/site-content";
import { cn } from "@/lib/utils";

const categoryStyles: Record<string, string> = {
  Notice: "bg-primary text-primary-foreground",
  Announcement: "bg-accent text-accent-foreground",
  Achievement: "bg-emerald-600 text-white",
  Event: "bg-blue-600 text-white",
  "Admission Update": "bg-violet-600 text-white",
};

type NewsCardProps = {
  item: NewsItem;
  className?: string;
};

export function NewsCard({ item, className }: NewsCardProps) {
  return (
    <Card className={cn("card-interactive flex h-full flex-col overflow-hidden pt-0", className)}>
      <div className="relative aspect-[16/9]">
        <ContentImage
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </div>
      <CardHeader className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={categoryStyles[item.category] ?? ""}>{item.category}</Badge>
          <time className="text-xs text-muted-foreground" dateTime={item.date}>
            {formatDateLong(item.date)}
          </time>
        </div>
        <CardTitle className="text-lg leading-snug sm:text-xl">{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
      </CardContent>
    </Card>
  );
}
