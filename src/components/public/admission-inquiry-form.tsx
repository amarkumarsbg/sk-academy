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

export function AdmissionInquiryForm() {
  const { content } = useSiteContent();
  const [submitted, setSubmitted] = useState(false);

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
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="student-name">Student Name</Label>
            <Input id="student-name" required placeholder="Enter student name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parent-name">Parent Name</Label>
            <Input id="parent-name" required placeholder="Enter parent name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input id="mobile" type="tel" required placeholder="+91 98765 43210" />
          </div>
          <div className="space-y-2">
            <Label>Class Applying For</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {["Nursery", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"].map(
                  (cls) => (
                    <SelectItem key={cls} value={cls}>
                      Class {cls}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Submit Inquiry
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Demo form — submissions will be saved when backend is connected.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
