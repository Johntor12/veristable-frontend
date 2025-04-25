// src/app/deploy/page.tsx
'use client';

import Hero from '../../components/deploy/Hero'; // Correct relative path

export default function DeployPage() {
  const realEstateData = {
    title: "Real Estate",
    subtitle: "Long-term value from physical assets.",
    contractInfo:
      "The Real Estate Token contract is an ERC20-compliant digital currency tailored for real estate applications.",
    companyName: "CompanyA",
    companyLogo: "/icons/company.png",
    publishDate: "Jan 00, 2025",
    auditReportLink: "View Audit Report",
    licenses: "MIT, Apache-2.0",
    mintedAssets: "999,999",
    heroImage: "/images/symbolDeploy.png",
  };

  return (
    <main>
      <Hero {...realEstateData} />
    </main>
  );
}
