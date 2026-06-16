import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDay, formatMonthShort, formatYear } from "@/lib/format-date";
import type { EventItem } from "@/types/site-content";
import { Calendar, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const typeStyles: Record<string, string> = {
  Meeting: "bg-primary/10 text-primary",
  Cultural: "bg-accent/15 text-accent-foreground",
  Academic: "bg-blue-100 text-blue-800",
  Workshop: "bg-violet-100 text-violet-800",
  Sports: "bg-emerald-100 text-emerald-800",
};

type EventCardProps = {
  event: EventItem;
  className?: string;
};

export function EventCard({ event, className }: EventCardProps) {
  return (
    <Card className={cn("card-interactive h-full", className)}>
      <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center">
        <div
          className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-primary-foreground"
          aria-hidden
        >
          <span className="text-xs font-medium uppercase">{formatMonthShort(event.date)}</span>
          <span className="text-2xl font-bold leading-none">{formatDay(event.date)}</span>
          <span className="text-xs">{formatYear(event.date)}</span>
        </div>
        <div className="min-w-0 flex-1">
          <Badge className={cn("mb-2", typeStyles[event.type] ?? "bg-secondary text-secondary-foreground")}>
            {event.type}
          </Badge>
          <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-accent" aria-hidden />
              {event.time}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-accent" aria-hidden />
              {event.location}
            </p>
          </div>
        </div>
        <Calendar className="hidden h-8 w-8 shrink-0 text-primary/20 sm:block" aria-hidden />
      </CardContent>
    </Card>
  );
}
