"use client";

import { Suspense } from "react";
import { AdminPageLoading } from "@/components/admin/admin-loading";
import AdminLoginForm from "./login-form";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
          <AdminPageLoading label="Loading..." />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
