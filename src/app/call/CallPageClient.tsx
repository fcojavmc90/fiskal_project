"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import ChimeCall from "../../components/ChimeCall";

export default function CallPageClient() {
  const params = useSearchParams();
  const appt = params.get("appt") || "";
  const tokenParam = params.get("token") || "";
  const role = (params.get("role") as "client" | "pro") || "client";

  return (
    <div style={{ background: "#001a2c", minHeight: "100vh", padding: "40px", color: "white" }}>
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#003a57",
          padding: "30px",
          borderRadius: "15px",
          border: "1px solid #00e5ff",
        }}
      >
        <ChimeCall appointmentId={appt} role={role} token={tokenParam} />
      </div>
    </div>
  );
}
