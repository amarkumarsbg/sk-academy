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

export async function submitContact(data: { name: string; email: string; message: string }) {
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
}) {
  return apiFetch<{ success: boolean }>("/admission-inquiries", {
    method: "POST",
    body: JSON.stringify(data),
  });
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
