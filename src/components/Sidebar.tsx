"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

type SidebarProps = {
  dashboardHref: string;
};

export default function Sidebar({ dashboardHref }: SidebarProps) {
  return (
    <aside
      style={{
        width: '240px',
        minWidth: '240px',
        background: '#001a2c',
        borderRight: '1px solid #003a57',
        padding: '20px 16px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        alignSelf: 'flex-start',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
        <Image
          src="/fiskal-logo.png"
          alt="Fiskal Solutions"
          width={160}
          height={48}
          style={{
            width: '160px',
            height: 'auto',
            objectFit: 'contain',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.6)',
            borderRadius: '12px',
            padding: '6px 8px',
            boxShadow: '0 0 12px rgba(255,255,255,0.15)',
          }}
          priority
        />
      </div>
      <nav style={{ display: 'grid', gap: '10px' }}>
        <Link
          href={dashboardHref}
          style={{
            background: '#00e5ff',
            color: '#001a2c',
            padding: '10px 12px',
            borderRadius: '8px',
            fontWeight: 'bold',
            textDecoration: 'none',
            textAlign: 'center',
          }}
        >
          Inicio
        </Link>
        <Link
          href="/about"
          style={{
            background: '#003a57',
            color: '#9adfff',
            padding: '10px 12px',
            borderRadius: '8px',
            fontWeight: 'bold',
            textDecoration: 'none',
            textAlign: 'center',
            border: '1px solid #00e5ff',
          }}
        >
          Quiénes somos
        </Link>
      </nav>
    </aside>
  );
}
