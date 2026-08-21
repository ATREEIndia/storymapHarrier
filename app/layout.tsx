import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Following Gangai",
  description: "A Montagu's Harrier migration story",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://js.arcgis.com/4.29/esri/themes/dark/main.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        {/* Load ArcGIS SDK before React hydrates */}
        <Script
          src="https://js.arcgis.com/4.29/"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}