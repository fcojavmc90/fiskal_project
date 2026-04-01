"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfessionalsRecommendedRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/professionals");
  }, [router]);

  return null;
}
