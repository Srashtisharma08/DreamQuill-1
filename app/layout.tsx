import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/ui/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DreamQuill - Story Studio",
  description: "Craft bingeable, emotional stories and novels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="container mx-auto px-4 pb-16">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
