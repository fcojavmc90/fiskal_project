"use client";
import './globals.css';
import { LanguageProvider } from './context/LanguageContext';
import React from 'react';
import { ensureAmplifyConfigured } from '../lib/amplifyClient';
import Navbar from '../components/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  ensureAmplifyConfigured();
  return (
    <html lang="es">
      <body>
        <LanguageProvider>
          <Navbar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
