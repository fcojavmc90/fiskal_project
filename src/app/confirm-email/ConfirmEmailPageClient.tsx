"use client";

import React, { useEffect, useState } from "react";
import { confirmSignUp, fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ConfirmEmailPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fromQuery = searchParams.get("email") || "";
    const fromStorage = localStorage.getItem("pendingEmail") || "";
    setEmail(fromQuery || fromStorage);
  }, [searchParams]);

  useEffect(() => {
    const guard = async () => {
      try {
        const user = await getCurrentUser();
        const attr = await fetchUserAttributes();
        const roleRaw = attr["custom:role"];
        const role = roleRaw === "PRO" ? "PRO" : "CLIENT";
        if (user) {
          router.replace(role === "PRO" ? "/expert-dashboard" : "/dashboard-client");
        }
      } catch {
        // No autenticado, se queda en confirmación
      }
    };
    guard();
  }, [router]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      alert("Correo confirmado. Ya puedes iniciar sesión.");
      router.push("/");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fk-page">
      <form onSubmit={handleConfirm} className="fk-card" style={{ maxWidth: "420px" }}>
        <h2 className="fk-title">Confirmar Correo</h2>
        <label className="fk-label">Correo</label>
        <input
          className="fk-input"
          type="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="fk-label">Código</label>
        <input
          className="fk-input"
          type="text"
          placeholder="123456"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit" disabled={loading} className="fk-btn">
          {loading ? "Confirmando..." : "Confirmar"}
        </button>
        <div className="fk-link-row">
          <Link className="fk-link" href="/">
            Ir al login
          </Link>
        </div>
      </form>
    </div>
  );
}
