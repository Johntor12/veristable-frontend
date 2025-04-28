'use client';

import Image from "next/image";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

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
  sections?: Section[];
};

const realEstateData = {
    sections: [
      {
        heading: "Popular",
        caption: "Discover the most in-demand Real World Assets in the market — highly trusted and widely adopted by users.",
        cards: [
          { badge: "Audited", title: "Real Estate", description: "Long-term value from physical properties.", by: "companyA" },
          { badge: "Audited", title: "Carbon Credits", description: "Earn from verified climate projects", by: "companyB" },
          { badge: "Audited", title: "Commodities", description: "Trade real assets like gold and oil", by: "companyC" },
        ],
      },
      {
        heading: "Trending This Week",
        caption: "Check out what's gaining attention this week — assets that are attracting the most user activity",
        cards: [
          { badge: "Audited", title: "Real Estate", description: "Long-term value from physical properties.", by: "companyA" },
          { badge: "Audited", title: "Carbon Credits", description: "Earn from verified climate projects", by: "companyB" },
          { badge: "Audited", title: "Commodities", description: "Trade real assets like gold and oil", by: "companyC" },
        ],
      },
      {
        heading: "Recommendation",
        caption: "Curated assets tailored to your profile and market trends. Discover smart picks to grow and diversify your portfolio.",
        cards: [
          { badge: "Audited", title: "Real Estate", description: "Long-term value from physical properties.", by: "companyA" },
          { badge: "Audited", title: "Carbon Credits", description: "Earn from verified climate projects", by: "companyB" },
          { badge: "Audited", title: "Commodities", description: "Trade real assets like gold and oil", by: "companyC" },
        ],
      },
    ]
}

const HeroRWA = ({ sections = realEstateData.sections }: HeroProps) => {
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
    router.push(`/deploy/${assetType.replace(/\s/g, '')}`);
  };  

  return (
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-16">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-16">

                <div className="max-w-5xl w-full">
                    <h1 className="text-[2.638vw] text-[#420092] font-bold mb-4">
                        MyRWA           
                    </h1>
                    <p className="text-[#535862] text-[1.25vw] mb-6 max-w-none">
                    Your control center for tokenized assets. View deployed RWA projects, follow minting progress, and manage your on-chain assets all in one place.            </p>
                    <div className="relative w-[59%]">
                    <input
                        type="text"
                        placeholder="Search your RWA project..."
                        className="w-full border border-[#B086E2] rounded-full px-3.5 py-2 text-[#535862] text-[0.83vw] outline-none"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={handleSearch}
                    >
                        <Image src="/icons/OutlineSearch.png" alt="search" width={18} height={18} />
                    </button>
                    </div>
                </div>

                <div className="lg:-translate-x-[5.5vw] lg:-translate-y-[1vw]">
                    <Image
                    src="/images/MyRWA_Dummy_Hero_Image.png"
                    alt="Dummy Hero"
                    width={600}
                    height={537.84}
                    />
                </div>
            </div>
        </div>
)}

export default HeroRWA;