"use client";

import Image, { StaticImageData } from "next/image";
import DummyHouse from "../../assets/MyRWA/Dummy_Image_RWA.png";

import Button from "../Button";

export type RWACardProps = {
  team: string;
  title: string;
  image: StaticImageData;
  description: string;
};

export type ProjectRecentProps = {
  titleSection?: string;
  descSection?: string;
  data?: RWACardProps[];
};

const RWACard = ({ team, title, image = DummyHouse, description }: RWACardProps) => {
  return (
    <div className="flex flex-col rounded-[0.694vw] border-1 border-[#D5D7DA] w-[25vw] aspect-[360/283]">
       <div className="relative w-full aspect-[360/136]">
        <Image
          src={image}
          alt="Dummy House.png"
          fill
          className="object-cover rounded-t-[0.694vw]"
        />
      </div>
      <div className="flex flex-col justify-between p-4 gap-[0.883vw]">
        <div className="flex flex-col gap-[0.139vw] font-jakarta">
          <h4 className="flex justify-items-center text-[0.863vw] leading-[1.25vw] text-[#420092] font-medium">
            {team}
          </h4>
          <p className="font-jakarta text-[1.25vw] font-bold text-black">{title}</p>
          <p className="text-[0.972vw] leading-[1.458vw] font-normal font-jakarta text-[#535862]">
            {description}
          </p>
        </div>
        <div className="flex justify-end">
          <div className="w-[7.708vw] aspect-[111/30]">
            <Button variant={"secondary"} text={"View"} fullW={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectRecent = ({
  titleSection = "Project Recently Viewed",
  descSection = "Your last touched RWA projects — instantly accessible for smooth on-chain flow.",
  data,
}: ProjectRecentProps) => {
  const rwaData = data ?? [
    {
      team: "Hanis Team",
      title: "Fresh Villa Bali",
      image : DummyHouse,
      description: "Near from Kuta Beach, very comfortable",
    },
    {
      team: "Alpha Group",
      title: "Jakarta Smart Tower",
      image : DummyHouse,
      description: "High-tech office building in central Jakarta",
    },
    {
      team: "Sunrise Dev",
      title: "Sunset Villa Lombok",
      image : DummyHouse,
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
        {rwaData.map((item, index) => (
          <RWACard
            key={index}
            team={item.team}
            title={item.title}
            image={item.image}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectRecent;
