'use client';

import Hero from "../../components/explorerwa/Hero";

export default function DeployPage() {
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
  };

  return (
    <main>
      <Hero {...realEstateData} />
    </main>
  );
}
