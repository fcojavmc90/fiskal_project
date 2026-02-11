"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MatchPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/professionals');
  }, [router]);
  return null;
}
