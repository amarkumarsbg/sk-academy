import { Award, BookOpen, Cpu, Dumbbell, GraduationCap, Users } from "lucide-react";
import { SectionHeading } from "@/components/public/section-heading";
import { PageSection } from "@/components/public/page-section";

const highlights = [
  { icon: GraduationCap, title: "Established 2011", description: "Over a decade of trusted education in Kahalgaon." },
  { icon: Award, title: "CBSE Affiliated", description: "Recognized curriculum from primary to senior secondary." },
  { icon: Cpu, title: "Smart Classrooms", description: "Digital boards and interactive learning in every class." },
  { icon: BookOpen, title: "Science Labs", description: "Well-equipped labs for hands-on scientific learning." },
  { icon: Dumbbell, title: "Sports Facilities", description: "Grounds and coaching for cricket, athletics, and more." },
  { icon: Users, title: "Experienced Faculty", description: "Dedicated teachers guiding students at every step." },
];

export function SchoolHighlights() {
  return (
    <PageSection variant="muted">
      <SectionHeading
        title="Why Families Choose SK Academy"
        description="A modern CBSE school built on academic rigor, values, and holistic development."
        centered
        className="mb-8"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="card-interactive flex h-full flex-col rounded-2xl bg-white p-5"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" aria-hidden />
              </div>
              <h3 className="font-semibold text-primary">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          );
        })}
      </div>
    </PageSection>
  );
}
