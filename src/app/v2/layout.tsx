import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homepage Concept v2",
  robots: { index: false, follow: false },
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return children;
}
