import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Magical Question... ❤️",
  description: "I have something important to ask you ❤️",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "A Magical Question ❤️",
  },
  openGraph: {
    title: "A Magical Question... ❤️",
    description: "I have something important to ask you ❤️",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffb7c5",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}