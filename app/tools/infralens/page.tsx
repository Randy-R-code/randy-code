import { HomeClient } from "@infralens-components/home-client";
import { OpenSource } from "@infralens-components/landing/open-source";
import { ResultsPreview } from "@infralens-components/landing/results-preview";
import { WhatItChecks } from "@infralens-components/landing/what-it-checks";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/infralens" },
};

export default function Home() {
  return (
    <HomeClient
      landingSections={
        <>
          <ResultsPreview />
          <WhatItChecks />
          <OpenSource />
        </>
      }
    />
  );
}
