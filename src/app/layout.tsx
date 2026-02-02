import './globals.css'
import { Inter } from 'next/font/google'
import AmplifyConfigComponent from '@/components/AmplifyConfig'
import { LanguageProvider } from '@/context/LanguageContext'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0 }}>
        <LanguageProvider>
          <AmplifyConfigComponent />
          <Navbar />
          <main>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  )
}
