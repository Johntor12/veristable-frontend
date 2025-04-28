import Image from "next/image";
import Button from "../Button";

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

const TeamCard = ({ team, createdAt, description }: TeamCardProps) => {
  return (
    <div className="flex flex-col rounded-[0.694vw] border-1 border-[#D5D7DA] w-[25vw] aspect-[360/135] gap-[1.111svw]">
      <div className="flex flex-col justify-between p-4 gap-[1.111vw]">
        <div className="flex flex-col gap-[0.139vw] font-jakarta">
          <h4 className="flex justify-items-center text-[1.25vw] leading-[1.25vw] text-black font-bold">
            {team}
          </h4>
          <p className="text-[0.972vw] leading-[1.458vw] font-normal font-jakarta text-[#535862]">
            {description}
          </p>
        </div>
        <div className="flex justify-between">
            <p className="font-jakarta text-[0.833vw] text-black flex items-center">
            {createdAt}
            </p>
          <div className="w-[7.708vw] aspect-[111/30]">
            <Button variant={"secondary"} text={"View"} fullW={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

const AllTeams = ({
    titleSection = "All Teams",
    descSection = "From DAOs to collectives — view all RWA projects you're building, owning, or verifying with your teams.",
    data
} : ProjectRecentProps) => {
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
    )
};

export default AllTeams;