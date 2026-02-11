import React, { Suspense } from "react";
import ConfirmEmailPageClient from "./ConfirmEmailPageClient";

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px" }}>Cargando...</div>}>
      <ConfirmEmailPageClient />
    </Suspense>
  );
}
