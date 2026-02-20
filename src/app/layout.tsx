import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Conceivable Command Center",
  description: "AI Agent OS for Women's Health",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
