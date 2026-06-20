"use client";

import { useSiteContent } from "@/context/site-content-provider";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { submitAdmissionInquiry } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { AdminButtonSpinner } from "@/components/admin/admin-loading";
import { TurnstileWidget } from "@/components/public/turnstile-widget";

export function AdmissionInquiryForm() {
  const { content } = useSiteContent();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [studentName, setStudentName] = useState("");
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [grade, setGrade] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await submitAdmissionInquiry({
        name: `${studentName} (Parent: ${parentName})`,
        phone,
        email: email || content.settings.admissionsEmail,
        grade,
        captchaToken: captchaToken ?? undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to submit inquiry");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Card className="card-interactive border-accent/30 bg-accent/5">
        <CardContent className="py-8 text-center">
          <p className="text-lg font-semibold text-primary">Thank you for your inquiry!</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Our admissions team will contact you shortly at {content.settings.phone}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="inquiry-form" className="card-interactive">
      <CardHeader>
        <CardTitle>Quick Admission Inquiry</CardTitle>
        <p className="text-sm text-muted-foreground">
          Fill in your details and we&apos;ll get back to you within 24 hours.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="student-name">Student Name</Label>
            <Input id="student-name" required placeholder="Enter student name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parent-name">Parent Name</Label>
            <Input id="parent-name" required placeholder="Enter parent name" value={parentName} onChange={(e) => setParentName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inquiry-email">Email</Label>
            <Input id="inquiry-email" type="email" required placeholder="parent@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input id="mobile" type="tel" required placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Class Applying For</Label>
            <Select required value={grade} onValueChange={(v) => setGrade(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {["Nursery", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"].map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    Class {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <TurnstileWidget onToken={setCaptchaToken} />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <AdminButtonSpinner label="Submitting..." /> : "Submit Inquiry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
