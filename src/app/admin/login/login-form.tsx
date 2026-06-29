"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminButtonSpinner } from "@/components/admin/admin-loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SchoolLogo } from "@/components/public/school-logo";
import { login } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { useAdminHref, usePublicSiteUrl } from "@/hooks/use-admin-host";
import { siteConfig } from "@/lib/config";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forgotPasswordPath = useAdminHref("/admin/forgot-password");
  const publicSiteUrl = usePublicSiteUrl();
  const dashboardPath = useAdminHref("/admin");
  const next = searchParams.get("next") ?? dashboardPath;

  const isProduction = process.env.NODE_ENV === "production";

  const [email, setEmail] = useState(isProduction ? "" : "admin@skacademy.edu");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

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
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@skacademy.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <AdminButtonSpinner label="Signing in..." /> : "Sign In"}
            </Button>
          </form>
          {!isProduction && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Dev only: use seeded admin credentials after running <code>npm run seed</code>
            </p>
          )}
          <div className="mt-4 text-center">
            <Link href={forgotPasswordPath} className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="mt-2 text-center">
            <Link href={publicSiteUrl} className="text-sm text-primary hover:underline">
              ← Back to website
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
