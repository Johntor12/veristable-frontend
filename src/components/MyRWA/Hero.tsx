"use client";

import Image from "next/image";

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
  searchKeyword?: string;
  setSearchKeyword?: (value: string) => void;
};

const HeroRWA = ({
  searchKeyword = "",
  setSearchKeyword = () => {},
}: HeroProps) => {
  // const router = useRouter();

  // Filter sections berdasarkan searchKeyword

  // Fungsi searching
  const handleSearch = () => {
    console.log("Searching:", searchKeyword);
  };

  // Function to handle "Deploy" button click
  // const handleDeploy = (assetType: string) => {
  //   router.push(`/deploy/${assetType.replace(/\s/g, "")}`);
  // };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-2">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-2">
        <div className="max-w-5xl w-full">
          <h1 className="text-[2.638vw] text-[#420092] font-bold mb-4">
            MyRWA
          </h1>
          <p className="text-[#535862] text-[1.25vw] mb-6 max-w-none">
            Your control center for tokenized assets. View deployed RWA
            projects, follow minting progress, and manage your on-chain assets
            all in one place.{" "}
          </p>
          <div className="relative w-[59%]">
            <input
              type="text"
              placeholder="Search your RWA project..."
              className="w-full border border-[#B086E2] rounded-full px-3.5 py-2 text-[#535862] text-[0.83vw] outline-none"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={handleSearch}
            >
              <Image
                src="/icons/OutlineSearch.png"
                alt="search"
                width={18}
                height={18}
              />
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

      {/* Render filteredSections */}
      {/* <div className="w-full max-w-6xl mx-auto mt-8">
        {filteredSections.map((section, index) => (
          <div key={index} className="mb-10">
            <h2 className="text-xl font-semibold text-[#420092] mb-1">
              {section.heading}
            </h2>
            <p className="text-sm text-gray-500 mb-4">{section.caption}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.cards.map((card, cardIdx) => (
                <div
                  key={cardIdx}
                  className="p-4 border border-gray-300 rounded-lg shadow-sm"
                >
                  <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    {card.badge}
                  </span>
                  <h3 className="text-lg font-bold mt-2">{card.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {card.description}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">by {card.by}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default HeroRWA;
