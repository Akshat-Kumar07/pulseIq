import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "PulseIQ — AI-Powered Cardiovascular Risk Assessment",
  description:
    "Advanced machine learning-powered cardiovascular risk assessment with real-time insights and personalized recommendations. Understand your heart health with clinical precision.",
  keywords: [
    "cardiovascular risk",
    "heart disease prediction",
    "AI health assessment",
    "cardiac risk calculator",
    "heart health AI",
  ],
  openGraph: {
    title: "PulseIQ — AI-Powered Cardiovascular Risk Assessment",
    description:
      "Understand your cardiovascular risk with AI-powered clinical analysis and personalized recommendations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="noise-overlay">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(13, 20, 36, 0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#f0f4ff",
              backdropFilter: "blur(20px)",
            },
          }}
        />
      </body>
    </html>
  );
}
