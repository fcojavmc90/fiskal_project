import React, { Suspense } from "react";
import ClientBookingPageClient from "./ClientBookingPageClient";

export default function ClientBookingPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px" }}>Cargando agenda...</div>}>
      <ClientBookingPageClient />
    </Suspense>
  );
}
