import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "Shiki 式 Shot 撮 - %s",
    default: "Shiki 式 Shot 撮",
  },
  description:
    "Shiki 式 Shot 撮 is a sleek Progressive Web App for creating and sharing stunning code snapshots. Powered by Shiki syntax highlighting, it combines simplicity and elegance to showcase your code like never before.",
  applicationName: "Shiki 式 Shot 撮",
  authors: [
    {
      name: "Dipesh B C",
      url: "https://www.dipeshbc.com",
    },
  ],
  keywords: [
    "Shiki 式 Shot 撮",
    "Code Snapshots",
    "Syntax Highlighting",
    "PWA",
    "Shiki",
    "Code Styling",
    "Dipesh B C",
  ],
  creator: "Dipesh B C",
  robots: "index, follow",
  // alternates: {
  //   canonical: "https://www.dipeshbc.com",
  // },
  openGraph: {
    type: "website",
    // url: "https://www.dipeshbc.com",
    title: "Shiki 式 Shot 撮",
    description:
      "Shiki 式 Shot 撮 is a sleek Progressive Web App for creating and sharing stunning code snapshots. Powered by Shiki syntax highlighting, it combines simplicity and elegance to showcase your code like never before.",
    siteName: "Shiki 式 Shot 撮",
    images: [
      {
        url: "/app-screenshots/shiki-shot-preview.webp",
        width: 1200,
        height: 630,
        alt: "Preview of Shiki 式 Shot 撮 code snapshot.",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shiki 式 Shot 撮",
    description:
      "Shiki 式 Shot 撮 is a sleek Progressive Web App for creating and sharing stunning code snapshots. Powered by Shiki syntax highlighting, it combines simplicity and elegance to showcase your code like never before.",
    images: [
      {
        url: "/app-screenshots/shiki-shot-preview.webp",
        width: 1200,
        height: 630,
        alt: "Preview of Shiki 式 Shot 撮 code snapshot.",
      },
    ],
  },
};

export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/windows11/Square44x44Logo.targetsize-96.png"
          sizes="96x96"
        />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Shiki 式 Shot 撮" />
        <meta name="theme-color" content="" />
      </head>

      <body className={`${inter.className} overflow-y-scroll antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          enableSystem
        >
          <main className="container mx-auto max-w-screen-lg px-6 md:px-16">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
