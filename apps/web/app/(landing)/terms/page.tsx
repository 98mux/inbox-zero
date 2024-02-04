import { Metadata } from "next";
import { TermsContent } from "@/app/(landing)/terms/content";

export const metadata: Metadata = {
  title: "Terms of Service - My Email Hero",
  description: "Terms of Service - My Email Hero",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <TermsContent />;
}
