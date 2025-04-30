"use client";

import Image from "next/image";
import Button from "@/components/Button";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProjectRecent from "@/components/MyRWA/ProjectRecent";
import AllTeams from "@/components/MyRWA/AllTeams";
import HeroRWA from "@/components/MyRWA/Hero";
import AfterDeploy from "@/components/MyRWA/AfterDeploy";
import { createClient } from "@supabase/supabase-js";

// Supabase Client Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Tipe untuk Card dan Section (untuk AfterDeploy)
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

// Tipe untuk RWACardProps (untuk ProjectRecent)
type RWACardProps = {
  team: string;
  title: string;
  image: string; // Ubah dari StaticImageData ke string untuk URL dari Supabase
  description: string;
};

const MyRWA = () => {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [rwaData, setRwaData] = useState<RWACardProps[]>([]); // State untuk ProjectRecent

  // Ambil data dari Supabase saat komponen dimuat
  useEffect(() => {
    const fetchRealEstateData = async () => {
      try {
        const { data, error } = await supabase.from("real_estate").select("*");
        if (error) {
          console.error("Error fetching real estate data:", error);
          return;
        }

        // Format data untuk AfterDeploy (sections)
        const realEstateCards: Card[] = data.map((item: any) => ({
          badge: "Audited",
          title: item.name,
          description: item.description || "No description available",
          by: item.owner.slice(0, 6) + "..." + item.owner.slice(-4),
        }));

        const dynamicSections: Section[] = [
          {
            heading: "Popular",
            caption:
              "Discover the most in-demand Real World Assets in the market — highly trusted and widely adopted by users.",
            cards: realEstateCards,
          },
          {
            heading: "Trending This Week",
            caption:
              "Check out what's gaining attention this week — assets that are attracting the most user activity",
            cards: realEstateCards,
          },
          {
            heading: "Recommendation",
            caption:
              "Curated assets tailored to your profile and market trends. Discover smart picks to grow and diversify your portfolio.",
            cards: realEstateCards,
          },
        ];

        setSections(dynamicSections);

        // Format data untuk ProjectRecent
        const projectRecentData: RWACardProps[] = data.map((item: any) => ({
          team:
            "Owner: " + item.owner.slice(0, 6) + "..." + item.owner.slice(-4), // Misal, team dari owner
          title: item.name,
          image: item.image?.[0] || "/path/to/fallback-image.png", // Gunakan gambar pertama atau fallback
          description: item.description || "No description available",
        }));

        setRwaData(projectRecentData);
      } catch (error) {
        console.error("Error in fetchRealEstateData:", error);
      }
    };

    fetchRealEstateData();
  }, []);

  // Filter sections berdasarkan searchKeyword (untuk AfterDeploy)
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
  }, [searchKeyword, sections]);

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
      <section className="w-[90%] mx-auto py-12 flex flex-col gap-[5vw]">
        {/* Bagian Atas */}
        <HeroRWA />
        <ProjectRecent
          titleSection="Project Recently Added"
          descSection="The latest RWA projects you've onboarded — ready to verify, tokenize, and go live"
          data={rwaData} // Kirim data dari Supabase
        />
        <AllTeams />
        <AfterDeploy sections={filteredSections} />
      </section>
    </div>
  );
};

export default MyRWA;
