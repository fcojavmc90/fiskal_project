"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import { createProfessionalProfile, getProfessionalProfileByOwner } from "../../../lib/graphqlClient";
import { ProType } from "../../../API";
import { isAuthBypassed } from "../../../lib/authBypass";

export default function ProOnboardingPage() {
  const router = useRouter();
  const [sub, setSub] = useState("");
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [proType, setProType] = useState<ProType>(ProType.TAX);

  useEffect(() => {
    const guard = async () => {
      try {
        if (isAuthBypassed()) {
          setSub("demo-pro");
          setLoading(false);
          return;
        }
        const user = await getCurrentUser();
        const attr = await fetchUserAttributes();
        const role = (attr["custom:role"] || "").toUpperCase();
        if (role !== "PRO") {
          router.replace("/dashboard-client");
          return;
        }
        const owner = attr.sub ?? user.userId ?? "";
        setSub(owner);
        const existing = await getProfessionalProfileByOwner(owner);
        if (existing?.id) {
          router.replace("/expert-dashboard");
          return;
        }
      } catch {
        router.replace("/");
        return;
      } finally {
        setLoading(false);
      }
    };
    guard();
  }, [router]);

  const submit = async () => {
    if (!displayName.trim() || !sub) return;
    if (isAuthBypassed()) {
      alert("Modo demo: no se guardan cambios.");
      router.push("/expert-dashboard");
      return;
    }
    try {
      await createProfessionalProfile({
        owner: sub,
        proType,
        displayName: displayName.trim(),
        bio: bio.trim(),
        ratingAvg: 0,
        ratingCount: 0,
        isActive: true,
      });
      router.push("/expert-dashboard");
    } catch (err: any) {
      alert("Error guardando perfil: " + err.message);
    }
  };

  return (
    <div style={{ background: "#001a2c", minHeight: "100vh", padding: "40px", color: "white" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", background: "#003a57", padding: "30px", borderRadius: "15px", border: "1px solid #00e5ff" }}>
        <h1 style={{ color: "#00e5ff" }}>Onboarding Profesional</h1>
        {loading && <p>Cargando...</p>}
        {!loading && (
          <>
            <label style={{ display: "block", marginTop: "16px" }}>Nombre a mostrar</label>
            <input
              type="text"
              placeholder="Ej: Ana G."
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              style={inputStyle}
            />

            <label style={{ display: "block", marginTop: "16px" }}>Tipo de profesional</label>
            <select value={proType} onChange={e => setProType(e.target.value as ProType)} style={inputStyle}>
              <option value={ProType.TAX}>Tax</option>
              <option value={ProType.LEGAL}>Legal</option>
              <option value={ProType.OTHER}>Otro</option>
            </select>

            <label style={{ display: "block", marginTop: "16px" }}>Bio corta</label>
            <textarea
              placeholder="Ej: Especialista en defensa ante IRS y resolución de avisos."
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={4}
              style={inputStyle}
            />

            <button onClick={submit} style={primaryBtn}>
              Guardar y continuar
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const inputStyle = { width: "100%", padding: "12px", background: "#001a2c", border: "1px solid #00e5ff", color: "white", marginTop: "12px", borderRadius: "6px" } as const;
const primaryBtn = { background: "#00e5ff", color: "#001a2c", padding: "15px", width: "100%", fontWeight: "bold", borderRadius: "6px", border: "none", cursor: "pointer", marginTop: "20px" } as const;
