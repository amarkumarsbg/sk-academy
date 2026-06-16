"use client";

import { useEffect, useState } from "react";
import { AddItemButton, CmsPageShell, Field, ImageUploadField, ListItemCard, SectionCard, TextAreaField } from "@/components/admin/cms-form-fields";
import { createId, useSiteContent } from "@/context/site-content-provider";
import type { HeroSlide, HomepageContent, StatItem } from "@/types/site-content";

export default function CmsHomepagePage() {
  const { content, updateContent } = useSiteContent();
  const [slides, setSlides] = useState<HeroSlide[]>(content.heroSlides);
  const [stats, setStats] = useState<StatItem[]>(content.stats);
  const [homepage, setHomepage] = useState<HomepageContent>(content.homepage);

  useEffect(() => {
    setSlides(content.heroSlides);
    setStats(content.stats);
    setHomepage(content.homepage);
  }, [content]);

  const save = () => updateContent((prev) => ({ ...prev, heroSlides: slides, stats, homepage }));

  return (
    <CmsPageShell title="Homepage CMS" onSave={save}>
      <SectionCard title="Hero Slides">
        {slides.map((slide, i) => (
          <ListItemCard key={slide.id} title={`Slide ${i + 1}`} onRemove={() => setSlides(slides.filter((s) => s.id !== slide.id))}>
            <ImageUploadField label="Image" value={slide.image} onChange={(v) => setSlides(slides.map((s) => (s.id === slide.id ? { ...s, image: v } : s)))} />
            <Field label="Title" value={slide.title} onChange={(v) => setSlides(slides.map((s) => (s.id === slide.id ? { ...s, title: v } : s)))} />
            <Field label="Subtitle" value={slide.subtitle} onChange={(v) => setSlides(slides.map((s) => (s.id === slide.id ? { ...s, subtitle: v } : s)))} />
            <Field label="Button Text" value={slide.cta} onChange={(v) => setSlides(slides.map((s) => (s.id === slide.id ? { ...s, cta: v } : s)))} />
            <Field label="Button Link" value={slide.ctaHref} onChange={(v) => setSlides(slides.map((s) => (s.id === slide.id ? { ...s, ctaHref: v } : s)))} />
            <Field label="Secondary Button Text" value={slide.secondaryCta ?? ""} onChange={(v) => setSlides(slides.map((s) => (s.id === slide.id ? { ...s, secondaryCta: v || undefined } : s)))} />
            <Field label="Secondary Button Link" value={slide.secondaryCtaHref ?? ""} onChange={(v) => setSlides(slides.map((s) => (s.id === slide.id ? { ...s, secondaryCtaHref: v || undefined } : s)))} />
          </ListItemCard>
        ))}
        <AddItemButton label="Add Slide" onClick={() => setSlides([...slides, { id: createId(), image: "/logo.png", title: "New Slide", subtitle: "", cta: "Learn More", ctaHref: "/" }])} />
      </SectionCard>

      <SectionCard title="Stats">
        {stats.map((stat, i) => (
          <ListItemCard key={i} title={`Stat ${i + 1}`} onRemove={() => setStats(stats.filter((_, idx) => idx !== i))}>
            <Field label="Value" value={stat.value} onChange={(v) => setStats(stats.map((s, idx) => (idx === i ? { ...s, value: v } : s)))} />
            <Field label="Label" value={stat.label} onChange={(v) => setStats(stats.map((s, idx) => (idx === i ? { ...s, label: v } : s)))} />
          </ListItemCard>
        ))}
        <AddItemButton label="Add Stat" onClick={() => setStats([...stats, { value: "0", label: "New Stat" }])} />
      </SectionCard>

      <SectionCard title="Welcome Section">
        <TextAreaField label="Intro Extra Text" value={homepage.introExtra} onChange={(v) => setHomepage({ ...homepage, introExtra: v })} />
      </SectionCard>

      <SectionCard title="Why Choose Us">
        <Field label="Title" value={homepage.whyChooseTitle} onChange={(v) => setHomepage({ ...homepage, whyChooseTitle: v })} />
        <TextAreaField label="Description" value={homepage.whyChooseDescription} onChange={(v) => setHomepage({ ...homepage, whyChooseDescription: v })} />
        {homepage.features.map((feature, i) => (
          <ListItemCard key={i} title={`Feature ${i + 1}`} onRemove={() => setHomepage({ ...homepage, features: homepage.features.filter((_, idx) => idx !== i) })}>
            <Field label="Title" value={feature.title} onChange={(v) => setHomepage({ ...homepage, features: homepage.features.map((f, idx) => (idx === i ? { ...f, title: v } : f)) })} />
            <TextAreaField label="Description" value={feature.description} onChange={(v) => setHomepage({ ...homepage, features: homepage.features.map((f, idx) => (idx === i ? { ...f, description: v } : f)) })} />
          </ListItemCard>
        ))}
        <AddItemButton label="Add Feature" onClick={() => setHomepage({ ...homepage, features: [...homepage.features, { title: "New Feature", description: "" }] })} />
      </SectionCard>

      <SectionCard title="Section Headings">
        <Field label="News Title" value={homepage.newsSectionTitle} onChange={(v) => setHomepage({ ...homepage, newsSectionTitle: v })} />
        <Field label="News Description" value={homepage.newsSectionDescription} onChange={(v) => setHomepage({ ...homepage, newsSectionDescription: v })} />
        <Field label="Events Title" value={homepage.eventsSectionTitle} onChange={(v) => setHomepage({ ...homepage, eventsSectionTitle: v })} />
        <Field label="Events Description" value={homepage.eventsSectionDescription} onChange={(v) => setHomepage({ ...homepage, eventsSectionDescription: v })} />
      </SectionCard>

      <SectionCard title="Principal's Message">
        <ImageUploadField
          label="Principal Photo"
          value={homepage.principalImage}
          onChange={(v) => setHomepage({ ...homepage, principalImage: v })}
        />
        <Field label="Name" value={homepage.principalName} onChange={(v) => setHomepage({ ...homepage, principalName: v })} />
        <Field label="Title" value={homepage.principalTitle} onChange={(v) => setHomepage({ ...homepage, principalTitle: v })} />
        <TextAreaField label="Message" value={homepage.principalMessage} onChange={(v) => setHomepage({ ...homepage, principalMessage: v })} />
      </SectionCard>

      <SectionCard title="Call to Action">
        <Field label="Title" value={homepage.ctaTitle} onChange={(v) => setHomepage({ ...homepage, ctaTitle: v })} />
        <TextAreaField label="Description" value={homepage.ctaDescription} onChange={(v) => setHomepage({ ...homepage, ctaDescription: v })} />
        <Field label="Button Text" value={homepage.ctaButton} onChange={(v) => setHomepage({ ...homepage, ctaButton: v })} />
      </SectionCard>
    </CmsPageShell>
  );
}
