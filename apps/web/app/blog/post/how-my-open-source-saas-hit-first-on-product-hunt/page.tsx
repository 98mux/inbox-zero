import { Metadata } from "next";
import { Content } from "./content";
import { StructuredData } from "@/app/blog/post/StructuredData";

export const metadata: Metadata = {
  title: "How My Email Hero hit #1 on Product Hunt",
  description:
    "My Email Hero finished first place on Product Hunt. This is how we did it.",
  alternates: {
    canonical: "/blog/how-my-open-source-saas-hit-first-on-product-hunt",
  },
};

export default function Page() {
  return (
    <>
      <StructuredData
        headline="How My Email Hero hit #1 on Product Hunt"
        datePublished="2024-01-22T08:00:00+00:00"
        dateModified="2024-01-22T08:00:00+00:00"
        authorName="Elie Steinbock"
        authorUrl="https://elie.tech"
        image={[]}
      />
      <Content />
    </>
  );
}
