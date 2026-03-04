import { getUserProfileByOwner } from "./graphqlClient";
import { UserRole } from "../API";

export type Role = "PRO" | "CLIENT";

export type PendingProfile = {
  role: Role;
  firstName?: string;
  lastName?: string;
  email?: string;
  description?: string;
};

const PENDING_PROFILE_KEY = "fiskal_pending_profile";

export function normalizeRole(raw?: string | null): Role | null {
  if (!raw) return null;
  const upper = raw.toUpperCase();
  if (upper === "PRO") return "PRO";
  if (upper === "CLIENT") return "CLIENT";
  return null;
}

export function savePendingProfile(profile: PendingProfile) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PENDING_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore storage errors
  }
}

export function loadPendingProfile(): PendingProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PENDING_PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingProfile;
    if (!parsed?.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingProfile() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PENDING_PROFILE_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function roleFromUserProfile(profile: { role?: UserRole | null } | null): Role | null {
  if (!profile?.role) return null;
  return profile.role === UserRole.PRO ? "PRO" : "CLIENT";
}

export async function resolveRole(owner: string, attrRole?: string | null): Promise<Role> {
  const fromAttr = normalizeRole(attrRole);
  if (fromAttr) return fromAttr;
  if (owner) {
    const profile = await getUserProfileByOwner(owner);
    const fromProfile = roleFromUserProfile(profile);
    if (fromProfile) return fromProfile;
  }
  const pending = loadPendingProfile();
  if (pending?.role) return pending.role;
  return "CLIENT";
}
