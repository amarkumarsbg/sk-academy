"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AddItemButton,
  CmsAccordionSection,
  CmsPageShell,
  Field,
  ImageUploadField,
  ListItemCard,
  TextAreaField,
} from "@/components/admin/cms-form-fields";
import { createId, useSiteContent } from "@/context/site-content-provider";
import { useCmsPageDraft } from "@/hooks/use-cms-draft";
import type { HeroSlide, HomepageContent, StatItem } from "@/types/site-content";

export default function CmsHomepagePage() {
  const { content, updateContent, saving } = useSiteContent();
  const [slides, setSlides] = useState<HeroSlide[]>(content.heroSlides);
  const [stats, setStats] = useState<StatItem[]>(content.stats);
  const [homepage, setHomepage] = useState<HomepageContent>(content.homepage);

  useEffect(() => {
    setSlides(content.heroSlides);
    setStats(content.stats);
    setHomepage(content.homepage);
  }, [content]);

  const savedSnapshot = useMemo(
    () => ({ slides: content.heroSlides, stats: content.stats, homepage: content.homepage }),
    [content]
  );
  const draftSnapshot = useMemo(() => ({ slides, stats, homepage }), [slides, stats, homepage]);
  const resetDraft = useCallback(() => {
    setSlides(content.heroSlides);
    setStats(content.stats);
    setHomepage(content.homepage);
  }, [content]);
  const { isDirty, onCancel } = useCmsPageDraft(savedSnapshot, draftSnapshot, resetDraft);

  const save = () => updateContent((prev) => ({ ...prev, heroSlides: slides, stats, homepage }));

  return (
    <CmsPageShell
      title="Homepage CMS"
      onSave={save}
      saving={saving}
      isDirty={isDirty}
      onCancel={onCancel}
      storageKey="cms-homepage"
      previewHref="/"
    >
      <CmsAccordionSection title="Hero Slides" description="Banner carousel on the homepage" defaultOpen>
        {slides.map((slide, i) => (
          <ListItemCard
            key={slide.id}
            title={`Slide ${i + 1}`}
            deleteLabel={`Are you sure you want to delete slide ${i + 1}?`}
            onRemove={() => setSlides(slides.filter((s) => s.id !== slide.id))}
          >
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
      </CmsAccordionSection>

      <CmsAccordionSection title="Stats" description="Numbers shown on the homepage">
        {stats.map((stat, i) => (
          <ListItemCard key={i} title={`Stat ${i + 1}`} deleteLabel={`Delete stat ${i + 1}?`} onRemove={() => setStats(stats.filter((_, idx) => idx !== i))}>
            <Field label="Value" value={stat.value} onChange={(v) => setStats(stats.map((s, idx) => (idx === i ? { ...s, value: v } : s)))} />
            <Field label="Label" value={stat.label} onChange={(v) => setStats(stats.map((s, idx) => (idx === i ? { ...s, label: v } : s)))} />
          </ListItemCard>
        ))}
        <AddItemButton label="Add Stat" onClick={() => setStats([...stats, { value: "0", label: "New Stat" }])} />
      </CmsAccordionSection>

      <CmsAccordionSection title="Welcome Section">
        <TextAreaField label="Intro Extra Text" value={homepage.introExtra} onChange={(v) => setHomepage({ ...homepage, introExtra: v })} maxLength={500} />
      </CmsAccordionSection>

      <CmsAccordionSection title="Features" description="Why Choose Us section">
        <Field label="Section Title" value={homepage.whyChooseTitle} onChange={(v) => setHomepage({ ...homepage, whyChooseTitle: v })} />
        <TextAreaField label="Section Description" value={homepage.whyChooseDescription} onChange={(v) => setHomepage({ ...homepage, whyChooseDescription: v })} maxLength={300} />
        {homepage.features.map((feature, i) => (
          <ListItemCard key={i} title={`Feature ${i + 1}`} onRemove={() => setHomepage({ ...homepage, features: homepage.features.filter((_, idx) => idx !== i) })}>
            <Field label="Title" value={feature.title} onChange={(v) => setHomepage({ ...homepage, features: homepage.features.map((f, idx) => (idx === i ? { ...f, title: v } : f)) })} />
            <TextAreaField label="Description" value={feature.description} onChange={(v) => setHomepage({ ...homepage, features: homepage.features.map((f, idx) => (idx === i ? { ...f, description: v } : f)) })} maxLength={200} />
          </ListItemCard>
        ))}
        <AddItemButton label="Add Feature" onClick={() => setHomepage({ ...homepage, features: [...homepage.features, { title: "New Feature", description: "" }] })} />
      </CmsAccordionSection>

      <CmsAccordionSection title="Section Headings">
        <Field label="News Title" value={homepage.newsSectionTitle} onChange={(v) => setHomepage({ ...homepage, newsSectionTitle: v })} />
        <Field label="News Description" value={homepage.newsSectionDescription} onChange={(v) => setHomepage({ ...homepage, newsSectionDescription: v })} />
        <Field label="Events Title" value={homepage.eventsSectionTitle} onChange={(v) => setHomepage({ ...homepage, eventsSectionTitle: v })} />
        <Field label="Events Description" value={homepage.eventsSectionDescription} onChange={(v) => setHomepage({ ...homepage, eventsSectionDescription: v })} />
      </CmsAccordionSection>

      <CmsAccordionSection title="Principal's Message">
        <ImageUploadField label="Principal Photo" value={homepage.principalImage} onChange={(v) => setHomepage({ ...homepage, principalImage: v })} />
        <Field label="Name" value={homepage.principalName} onChange={(v) => setHomepage({ ...homepage, principalName: v })} />
        <Field label="Title" value={homepage.principalTitle} onChange={(v) => setHomepage({ ...homepage, principalTitle: v })} />
        <TextAreaField label="Message" value={homepage.principalMessage} onChange={(v) => setHomepage({ ...homepage, principalMessage: v })} maxLength={600} />
      </CmsAccordionSection>

      <CmsAccordionSection title="Call To Action">
        <Field label="Title" value={homepage.ctaTitle} onChange={(v) => setHomepage({ ...homepage, ctaTitle: v })} />
        <TextAreaField label="Description" value={homepage.ctaDescription} onChange={(v) => setHomepage({ ...homepage, ctaDescription: v })} maxLength={300} />
        <Field label="Button Text" value={homepage.ctaButton} onChange={(v) => setHomepage({ ...homepage, ctaButton: v })} />
      </CmsAccordionSection>
    </CmsPageShell>
  );
}
