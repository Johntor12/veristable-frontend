'use client';

import Image from "next/image";
import Button from "@/components/Button";
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
  sections: Section[];
};

const Hero = ({ sections }: HeroProps) => {
  const router = useRouter();
  // State untuk input search
  const [searchKeyword, setSearchKeyword] = useState("");

  // Filter sections berdasarkan searchKeyword
  const filteredSections = useMemo(() => {
    const keyword = searchKeyword.toLowerCase();
    return sections.map((section) => ({
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
    <div className="min-h-screen bg-white pt-[6vw] px-4 lg:px-0 font-jakarta ml-[1vw]">
      <div className="w-[90%] mx-auto py-12">
        {/* Bagian Atas */}
        <section className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-16">
          <div className="max-w-5xl w-full">
            <h1 className="text-[2.638vw] text-[#420092] font-bold mb-4">
              Explore Real-World Assets (RWAs)
            </h1>
            <p className="text-[#535862] text-[1.25vw] mb-6 max-w-none">
              Discover real-world assets effortlessly. Use the search feature to explore a wide range <br /> of available RWAs.
            </p>
            <div className="relative w-[59%]">
              <input
                type="text"
                placeholder="Search RWA..."
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
              src="/images/symbolExploreRWA.png"
              alt="Explore Icon"
              width={600}
              height={537.84}
            />
          </div>
        </section>

        {/* Bagian Bawah */}
        {filteredSections.map((section, idx) => (
          <section key={idx} className="mb-24">
            <h2 className="text-[1.806vw] text-[#5200B7] font-bold mb-2">
              {section.heading}
            </h2>
            <p className="text-[#535862] text-[0.972vw] mb-6 max-w-3xl">
              {section.caption}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.cards.length > 0 ? (
                section.cards.map((card: Card, i: number) => (
                  <div
                    key={i}
                    className="w-[28.2vw] h-[11.875vw] border border-[#E5E5E5] rounded-lg p-4 flex flex-col justify-between relative"
                  >
                    <div>
                      <p className="text-[#039855] text-[0.833vw] font-medium mb-2">
                        {card.badge}
                      </p>
                      <h3 className="text-black text-[1.25vw] font-bold mb-1">
                        {card.title}
                      </h3>
                      <p className="text-[#535862] text-[0.972vw] mb-4">
                        {card.description}
                      </p>
                      <p className="text-black text-[0.833vw] mt-[2.8vw] ml-[0.3vw]">
                        by. {card.by}
                      </p>
                    </div>
                    <div className="absolute right-4 bottom-4 w-[9vw]">
                      <Button
                        text="Deploy"
                        variant="secondary"
                        size="custom"
                        customClass="w-full py-[0.4vw] text-[0.9vw] border-[0.5px]"
                        onClick={() => handleDeploy(card.title)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[1vw] text-[#999]">No results found.</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Hero;
