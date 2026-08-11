import { HomeClient } from "@infralens-components/home-client";
import { HowResults } from "@infralens-components/landing/how-results";
import { OpenSource } from "@infralens-components/landing/open-source";
import { ResultsPreview } from "@infralens-components/landing/results-preview";
import { WhatItChecks } from "@infralens-components/landing/what-it-checks";

export default function Home() {
  return (
    <HomeClient
      landingSections={
        <>
          <ResultsPreview />
          <WhatItChecks />
          <HowResults />
          <OpenSource />
        </>
      }
    />
  );
}
