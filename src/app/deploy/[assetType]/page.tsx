'use client';

import Hero from "../../../components/deploy/Hero"; // Import komponen Hero untuk menampilkan konten
import { useParams } from 'next/navigation';  // Hook untuk mendapatkan parameter dinamis dari URL
import { useEffect, useState } from 'react';

export default function DeployPage() {
  const { assetType } = useParams();          // Mengambil assetType dari URL
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!assetType) return; // Pastikan assetType ada sebelum memproses data

    // Menentukan data berdasarkan assetType
    let d;
    if (assetType === 'RealEstate') {
      d = { 
        title: "Real Estate",
        subtitle: "Long-term value from physical assets.",
        contractInfo: "The Real Estate Token contract is an ERC20-compliant digital currency tailored for real estate applications.",
        companyName: "CompanyA",
        companyLogo: "/icons/company.png",
        publishDate: "Jan 00, 2025",
        auditReportLink: "View Audit Report",
        licenses: "MIT, Apache-2.0",
        mintedAssets: "999,999",
        heroImage: "/images/symbolDeploy.png"
      };
    } else if (assetType === 'CarbonCredits') {
      d = { 
        title: "Carbon Credit",
        subtitle: "Trade carbon credits to offset your carbon footprint.",
        contractInfo: "The Carbon Credit Token contract is an ERC20-compliant digital asset that represents carbon credits.",
        companyName: "GreenFuture Corp.",
        companyLogo: "/icons/company.png",
        publishDate: "Feb 15, 2025",
        auditReportLink: "View Carbon Audit",
        licenses: "CC BY-NC-SA 4.0",
        mintedAssets: "500,000",
        heroImage: "/images/symbolDeploy.png"
      };
    } else if (assetType === 'Commodities') {
      d = { 
        title: "Commodities",
        subtitle: "Trade real-world assets in digital form.",
        contractInfo: "The Commodities Token contract is an ERC20-compliant tokenization of physical commodities such as gold, oil, etc.",
        companyName: "Commodities Exchange Ltd.",
        companyLogo: "/icons/company.png",
        publishDate: "Mar 10, 2025",
        auditReportLink: "View Commodities Audit",
        licenses: "GPLv3",
        mintedAssets: "1,000,000",
        heroImage: "/images/symbolDeploy.png"
      };
    }
    setData(d); // Menyimpan data sesuai dengan assetType
  }, [assetType]);

  if (!data) return <p>Memuat…</p>; // Menampilkan loading saat data belum ada

  return (
    <main>
      <Hero {...data} /> {/* Menampilkan Hero dengan data yang sesuai */}
    </main>
  );
}
