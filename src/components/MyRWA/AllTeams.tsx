import TeamCard from "./TeamCard";

export type TeamCardProps = {
  team: string;
  createdAt: string;
  description: string;
};

export type ProjectRecentProps = {
  titleSection?: string;
  descSection?: string;
  data?: TeamCardProps[];
};

const AllTeams = ({
  titleSection = "All Teams",
  descSection = "From DAOs to collectives — view all RWA projects you're building, owning, or verifying with your teams.",
  data,
}: ProjectRecentProps) => {
  const teamData = data ?? [
    {
      team: "Hanis Team",
      createdAt: "Created 22/04/2025",
      description: "Near from Kuta Beach, very comfortable",
    },
    {
      team: "Alpha Group",
      createdAt: "Created 22/04/2025",
      description: "High-tech office building in central Jakarta",
    },
    {
      team: "Sunrise Dev",
      createdAt: "Created 22/04/2025",
      description: "Beachfront villa with stunning view",
    },
  ];
  return (
    <div className="flex flex-col gap-[1.33vw]">
      <div className="flex flex-col font-jakarta">
        <h3 className="text-[#420092] font-bold text-[1.806vw]">
          {titleSection}
        </h3>
        <p className="text-[0.972vw] text-[#535862]">{descSection}</p>
      </div>
      <div className="flex flex-row gap-4">
        {teamData.map((item, index) => (
          <TeamCard
            key={index}
            team={item.team}
            createdAt={item.createdAt}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};

export default AllTeams;
