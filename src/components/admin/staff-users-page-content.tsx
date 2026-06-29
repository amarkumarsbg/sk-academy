"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { AdminPageLoading } from "@/components/admin/admin-loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  createStaffUser,
  deleteStaffUser,
  fetchStaffUsers,
  type StaffUser,
} from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { Trash2 } from "lucide-react";
import Link from "next/link";

export function StaffUsersPageContent() {
  const { user } = useCurrentUser();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "staff" as "admin" | "staff" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await fetchStaffUsers());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin") void load();
    else setLoading(false);
  }, [user, load]);

  if (user && user.role !== "admin") {
    return (
      <>
        <AdminHeader title="Staff Users" />
        <div className="p-6 text-sm text-muted-foreground">Only administrators can manage staff accounts.</div>
      </>
    );
  }

  const createUser = async () => {
    setError("");
    try {
      await createStaffUser(form);
      setOpen(false);
      setForm({ name: "", email: "", password: "", role: "staff" });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create user");
    }
  };

  return (
    <>
      <AdminHeader title="Staff Users" subtitle="Manage admin portal access" />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-sm text-muted-foreground">Create accounts for school staff who need CMS or portal access.</p>
          <Button className="w-full shrink-0 sm:w-auto" onClick={() => setOpen(true)}>
            Add User
          </Button>
        </div>
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
        {loading ? (
          <AdminPageLoading label="Loading users..." />
        ) : (
          <div className="space-y-3">
            {users.map((staff) => (
              <div key={staff._id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
                <div>
                  <p className="font-medium">{staff.name}</p>
                  <p className="text-sm text-muted-foreground">{staff.email}</p>
                  <p className="text-xs capitalize text-muted-foreground">{staff.role}</p>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={staff._id === user?.id}
                  onClick={async () => {
                    if (confirm(`Delete user ${staff.email}?`)) {
                      await deleteStaffUser(staff._id);
                      await load();
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <p className="mt-6 text-sm text-muted-foreground">
          <Link href="/admin/forgot-password" className="text-primary hover:underline">
            Forgot password?
          </Link>
        </p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Staff User</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Password</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: (v ?? "staff") as "admin" | "staff" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => void createUser()}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
