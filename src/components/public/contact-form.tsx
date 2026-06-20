"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { submitContact } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { AdminButtonSpinner } from "@/components/admin/admin-loading";
import { TurnstileWidget } from "@/components/public/turnstile-widget";

type FormState = "idle" | "success" | "error";

type FormValues = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.message.trim()) {
    errors.message = "Please enter your message.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Message should be at least 10 characters.";
  }

  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<FormValues>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [state, setState] = useState<FormState>("idle");
  const [submitting, setSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setState("error");
      return;
    }

    setSubmitting(true);
    try {
      await submitContact({ ...values, captchaToken: captchaToken ?? undefined });
      setState("success");
    } catch (err) {
      setErrors({
        message: err instanceof ApiError ? err.message : "Failed to send message. Please try again.",
      });
      setState("error");
    } finally {
      setSubmitting(false);
    }
  };

  if (state === "success") {
    return (
      <Card className="card-interactive border-accent/30 bg-accent/5">
        <CardContent className="py-8 text-center">
          <p className="text-lg font-semibold text-primary">Message sent successfully!</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Thank you for contacting SK Academy. We will respond to your inquiry shortly.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => {
              setValues({ name: "", email: "", message: "" });
              setState("idle");
            }}
          >
            Send another message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-interactive">
      <CardContent className="pt-6">
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="contact-name">Name</Label>
            <Input
              id="contact-name"
              value={values.name}
              onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={values.email}
              onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea
              id="contact-message"
              rows={4}
              value={values.message}
              onChange={(e) => setValues((prev) => ({ ...prev, message: e.target.value }))}
              placeholder="How can we help you?"
              aria-invalid={Boolean(errors.message)}
            />
            {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
          </div>

          {state === "error" && Object.keys(errors).length > 0 && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              Please fix the errors above and try again.
            </p>
          )}

          <TurnstileWidget onToken={setCaptchaToken} />

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <AdminButtonSpinner label="Sending..." /> : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
