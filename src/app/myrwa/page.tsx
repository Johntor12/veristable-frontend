"use client";

import { useState, useEffect } from "react";
import ProjectRecent from "@/components/MyRWA/ProjectRecent";
import AllTeams from "@/components/MyRWA/AllTeams";
import HeroRWA from "@/components/MyRWA/Hero";
import { createClient } from "@supabase/supabase-js";

// Supabase Client Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Tipe untuk data dari Supabase
type RealEstateItem = {
  id: number;
  name: string;
  description?: string;
  owner: string;
  image?: string[];
  address: string;
};

// Tipe untuk ProjectRecent
type RWACardProps = {
  team: string;
  title: string;
  image: string;
  description: string;
  address: string;
};

const MyRWA = () => {
  const [rwaData, setRwaData] = useState<RWACardProps[]>([]);

  useEffect(() => {
    const fetchRealEstateData = async () => {
      try {
        const { data, error } = await supabase.from("real_estate").select("*");

        if (error || !data) {
          console.error("Error fetching real estate data:", error);
          return;
        }

        const projectRecentData: RWACardProps[] = data.map(
          (item: RealEstateItem) => ({
            team: `Owner: ${item.owner.slice(0, 6)}...${item.owner.slice(-4)}`,
            title: item.name,
            image: item.image?.[0] || "/images/hero-myrwa-image.png",
            description: item.description || "No description available",
            address: item.address,
          })
        );

        setRwaData(projectRecentData);
      } catch (error) {
        console.error("Error in fetchRealEstateData:", error);
      }
    };

    fetchRealEstateData();
  }, []);

  return (
    <div className="min-h-screen bg-white pt-[6vw] px-4 lg:px-0 font-jakarta">
      <section className="w-[90%] mx-auto py-12 flex flex-col gap-[2vw]">
        <HeroRWA />
        <ProjectRecent
          titleSection="Project Recently Added"
          descSection="The latest RWA projects you've onboarded — ready to verify, tokenize, and go live"
          data={rwaData}
        />
        <AllTeams />
      </section>
    </div>
  );
};

export default MyRWA;
