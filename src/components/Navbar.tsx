"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchUserAttributes, getCurrentUser, signOut } from "aws-amplify/auth";
import { usePathname, useRouter } from "next/navigation";
import { isAuthBypassed } from "../lib/authBypass";
import { ensureAmplifyConfigured } from "../lib/amplifyClient";

type NavUser = {
  name: string;
  role?: "PRO" | "CLIENT";
};

export default function Navbar() {
  ensureAmplifyConfigured();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<NavUser | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (isAuthBypassed()) {
        if (mounted) setUser({ name: "Demo", role: "CLIENT" });
        return;
      }
      try {
        const current = await getCurrentUser();
        const attr = await fetchUserAttributes();
        const roleRaw = attr["custom:role"] === "PRO" ? "PRO" : "CLIENT";
        const first = attr.given_name ?? attr["custom:firstName"] ?? "";
        const last = attr.family_name ?? attr["custom:lastName"] ?? "";
        const email = attr.email ?? "";
        const name =
          (first || last) ? `${first} ${last}`.trim() :
          (email || current.username || current.userId);
        if (mounted) setUser({ name, role: roleRaw });
      } catch {
        if (mounted) setUser(null);
      }
    };
    load();
    return () => { mounted = false; };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      if (!isAuthBypassed()) {
        await signOut();
      } else if (typeof window !== "undefined") {
        localStorage.removeItem("fk_auth_bypass");
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      document.cookie = "fk_role=; Max-Age=0; path=/";
      document.cookie = "fk_has_survey=; Max-Age=0; path=/";
      document.cookie = "fk_paid_initial=; Max-Age=0; path=/";
      setUser(null);
      router.replace("/");
      router.refresh();
    }
  };

  const dashboardHref = user?.role === "PRO" ? "/expert-dashboard" : "/dashboard-client";

  return (
    <nav className="fk-nav">
      <div className="fk-nav-inner">
        <div className="fk-brand" />
        <div className="fk-nav-links">
          {user ? (
            <>
              <Link href={dashboardHref}>Dashboard</Link>
              {user.role === "CLIENT" && <Link href="/survey">Encuesta</Link>}
              {user.role === "CLIENT" && <Link href="/professionals">Profesionales</Link>}
              <span className="fk-user">{user.name}</span>
              <button className="fk-logout" onClick={handleLogout}>Salir</button>
            </>
          ) : (
            <>
              <Link href="/">Ingresar</Link>
              <Link href="/register">Crear cuenta</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
