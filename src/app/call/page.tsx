import React, { Suspense } from "react";
import CallPageClient from "./CallPageClient";

export default function CallPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px" }}>Cargando llamada...</div>}>
      <CallPageClient />
    </Suspense>
  );
}
