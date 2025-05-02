"use client";

// import Image from "next/image";
// import Button from "@/components/Button";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ProjectRecent from "@/components/MyRWA/ProjectRecent";
import AllTeams from "@/components/MyRWA/AllTeams";
import HeroRWA from "@/components/MyRWA/Hero";
import AfterDeploy from "@/components/MyRWA/AfterDeploy";
import HeroDashboard from "@/components/dashboard/HeroDashboard";
import ReservesChart from "@/components/dashboard/ReserveChart";
import TotalAssetsSection from "@/components/dashboard/TotalAssetsSection";
import HeroDashboard from "@/components/dashboard/HeroDashboard";
import ReservesChart from "@/components/dashboard/ReserveChart";
import TotalAssetsSection from "@/components/dashboard/TotalAssetsSection";

// Tipe untuk Card dan Section
type Card = {
  badge: string;
  title: string;
  description: string;
  by: string;
};

type Section = {
  heading: string;
  caption: string;
  cards: Card[];
};

type HeroProps = {
  sections: Section[];
};

const realEstateData = {
  sections: [
    {
      heading: "Popular",
      caption:
        "Discover the most in-demand Real World Assets in the market — highly trusted and widely adopted by users.",
      cards: [
        {
          badge: "Audited",
          title: "Real Estate",
          description: "Long-term value from physical properties.",
          by: "companyA",
        },
        {
          badge: "Audited",
          title: "Carbon Credits",
          description: "Earn from verified climate projects",
          by: "companyB",
        },
        {
          badge: "Audited",
          title: "Commodities",
          description: "Trade real assets like gold and oil",
          by: "companyC",
        },
      ],
    },
    {
      heading: "Trending This Week",
      caption:
        "Check out what's gaining attention this week — assets that are attracting the most user activity",
      cards: [
        {
          badge: "Audited",
          title: "Real Estate",
          description: "Long-term value from physical properties.",
          by: "companyA",
        },
        {
          badge: "Audited",
          title: "Carbon Credits",
          description: "Earn from verified climate projects",
          by: "companyB",
        },
        {
          badge: "Audited",
          title: "Commodities",
          description: "Trade real assets like gold and oil",
          by: "companyC",
        },
      ],
    },
    {
      heading: "Recommendation",
      caption:
        "Curated assets tailored to your profile and market trends. Discover smart picks to grow and diversify your portfolio.",
      cards: [
        {
          badge: "Audited",
          title: "Real Estate",
          description: "Long-term value from physical properties.",
          by: "companyA",
        },
        {
          badge: "Audited",
          title: "Carbon Credits",
          description: "Earn from verified climate projects",
          by: "companyB",
        },
        {
          badge: "Audited",
          title: "Commodities",
          description: "Trade real assets like gold and oil",
          by: "companyC",
        },
      ],
    },
  ],
};

const MyRWA = ({ sections }: HeroProps) => {
  const router = useRouter();
  // State untuk input search
  const [searchKeyword, setSearchKeyword] = useState("");

  // Filter sections berdasarkan searchKeyword
  const filteredSections = useMemo(() => {
    const keyword = searchKeyword.toLowerCase();
    return sections?.map((section) => ({
      ...section,
      cards: section.cards.filter(
        (card) =>
          card.title.toLowerCase().includes(keyword) ||
          card.description.toLowerCase().includes(keyword) ||
          card.by.toLowerCase().includes(keyword)
      ),
    }));
  }, [searchKeyword]);

  // Fungsi searching
  const handleSearch = () => {
    console.log("Searching:", searchKeyword);
  };

  // Function to handle "Deploy" button click
  const handleDeploy = (assetType: string) => {
    router.push(`/deploy/${assetType.replace(/\s/g, "")}`);
  };

  return (
    <div className="min-h-screen bg-white pt-[6vw] px-4 lg:px-0 font-jakarta ml-[1vw]">
      <section className="w-[78.264vw] mx-auto py-12 flex flex-col gap-[5vw]">
        {/* Bagian Atas */}
        <HeroRWA />

        <ProjectRecent />
        <ProjectRecent
          titleSection="Project Recently Added"
          descSection="The latest RWA projects you've onboarded — ready to verify, tokenize, and go live"
        />
        <AllTeams />
        <AfterDeploy contractAddress="0x123" />
        <HeroDashboard />
        <TotalAssetsSection />
        <ReservesChart />
      </section>
    </div>
  );
};

export default MyRWA;
