import { apiFetch } from "./client";
import type { SiteContent } from "@/types/site-content";

export async function fetchSiteContent(): Promise<SiteContent> {
  return apiFetch<SiteContent>("/site-content");
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  return apiFetch<SiteContent>("/site-content", {
    method: "PUT",
    body: JSON.stringify(content),
  });
}

export async function login(email: string, password: string) {
  return apiFetch<{ user: { id: string; email: string; name: string; role: string } }>(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) }
  );
}

export async function logout() {
  return apiFetch<{ success: boolean }>("/auth/logout", { method: "POST" });
}

export async function getMe() {
  return apiFetch<{ user: { id: string; email: string; name: string; role: string } }>(
    "/auth/me"
  );
}

export async function forgotPassword(email: string) {
  return apiFetch<{ success: boolean; message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, password: string) {
  return apiFetch<{ success: boolean }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export async function submitContact(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  captchaToken?: string;
}) {
  return apiFetch<{ success: boolean }>("/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitAdmissionInquiry(data: {
  name: string;
  phone: string;
  email: string;
  grade: string;
  captchaToken?: string;
}) {
  return apiFetch<{ success: boolean }>("/admission-inquiries", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export type InboxStatus = "new" | "read" | "resolved";

export interface ContactMessageRecord {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: InboxStatus;
  notes?: string;
  createdAt: string;
}

export interface AdmissionInquiryRecord {
  _id: string;
  name: string;
  phone: string;
  email: string;
  grade: string;
  status: InboxStatus;
  notes?: string;
  createdAt: string;
}

export async function fetchContactMessages() {
  return apiFetch<ContactMessageRecord[]>("/contact");
}

export async function fetchAdmissionInquiries() {
  return apiFetch<AdmissionInquiryRecord[]>("/admission-inquiries");
}

export async function updateContactMessage(id: string, data: { status: InboxStatus; notes?: string }) {
  return apiFetch<ContactMessageRecord>(`/contact/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function updateAdmissionInquiry(id: string, data: { status: InboxStatus; notes?: string }) {
  return apiFetch<AdmissionInquiryRecord>(`/admission-inquiries/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function fetchInboxCounts() {
  return apiFetch<{ contactNew: number; inquiryNew: number; total: number }>("/inbox/counts");
}

export interface DashboardSummary {
  stats: {
    students: number;
    activeStudents: number;
    teachers: number;
    contactNew: number;
    contactTotal: number;
    pendingAdmissions: number;
  };
  pendingAdmissions: Array<{
    id: string;
    applicant: string;
    grade: string;
    date: string;
    status: string;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    type: string;
  }>;
  contactMessages: ContactMessageRecord[];
}

export async function fetchDashboard() {
  return apiFetch<DashboardSummary>("/dashboard");
}

export interface StaffUser {
  _id: string;
  email: string;
  name: string;
  role: "admin" | "staff";
  createdAt: string;
}

export async function fetchStaffUsers() {
  return apiFetch<StaffUser[]>("/users");
}

export async function createStaffUser(data: {
  email: string;
  name: string;
  password: string;
  role: "admin" | "staff";
}) {
  return apiFetch<StaffUser>("/users", { method: "POST", body: JSON.stringify(data) });
}

export async function deleteStaffUser(id: string) {
  return apiFetch<{ success: boolean }>(`/users/${id}`, { method: "DELETE" });
}

export interface AuditLogRecord {
  _id: string;
  action: string;
  userId: string;
  userName: string;
  resource: string;
  summary: string;
  createdAt: string;
}

export async function fetchAuditLog() {
  return apiFetch<AuditLogRecord[]>("/audit-log");
}

export function fetchResource<T>(resource: string) {
  return apiFetch<T[]>(`/${resource}`);
}

export function createResource<T>(resource: string, data: T) {
  return apiFetch<T>(`/${resource}`, { method: "POST", body: JSON.stringify(data) });
}

export function updateResource<T>(resource: string, id: string, data: T) {
  return apiFetch<T>(`/${resource}/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteResource(resource: string, id: string) {
  return apiFetch<{ success: boolean }>(`/${resource}/${id}`, { method: "DELETE" });
}

export async function uploadDocument(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload/document", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? "Upload failed");
  }

  const data = (await res.json()) as { url: string };
  return data.url;
}
