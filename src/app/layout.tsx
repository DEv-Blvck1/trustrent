import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "TrustRent — Rental Agreement & Payment Manager",
  description: "Manage your rental agreements, track rent payments and resolve disputes in Nigeria",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
