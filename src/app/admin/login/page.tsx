import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SchoolLogo } from "@/components/public/school-logo";
import { siteConfig } from "@/lib/config";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex justify-center">
            <SchoolLogo size="xl" href={null} priority />
          </div>
          <CardTitle>{siteConfig.name}</CardTitle>
          <CardDescription>{siteConfig.tagline} · Staff Portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@skacademy.edu" defaultValue="admin@skacademy.edu" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" defaultValue="demo1234" />
            </div>
            <ButtonLink href="/admin" className="w-full">
              Sign In (Demo)
            </ButtonLink>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Authentication will be added when the backend is built.
          </p>
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-primary hover:underline">
              ← Back to website
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
