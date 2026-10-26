import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/common/Toast";

export const metadata: Metadata = {
  title: "TrustRent — Real Estate & Rental Agreement Platform",
  description: "Next-generation tenancy manager, verified property listings, and digital caution fee protection in Nigeria.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
