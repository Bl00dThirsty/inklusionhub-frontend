import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "../app/Components/providers/ThemeProvider";
import "./globals.css";
import DashboardHeader from '../app/Components/DashboardHeader';
import { Providers } from './providers';
import { Toaster } from 'sonner';


interface UserData {
  name: string;
  role: string;
  onboardingProgress: number;
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InklusionHub",
  description: "© 2025 InklusionHub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 
   
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
        <Providers>
            {children}
            <Toaster position="top-right" />
        </Providers>
      </ThemeProvider>
      </body>
    </html>
  );
}
