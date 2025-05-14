"use client";

import Image from "next/image";
import Button from "../Button"; // Assuming this is the refactored shadcn Button
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Import shadcn Card components
import { cn } from "@/lib/utils"; // Import cn

export type RWACardProps = {
  team: string;
  title: string;
  image: string;
  description: string;
  address: string; // Tambahkan address untuk navigasi
};

export type ProjectRecentProps = {
  titleSection?: string;
  descSection?: string;
  data?: RWACardProps[]; // Use RWACProps type
};

const RWACard = ({
  team,
  title,
  image,
  description,
  address,
}: RWACardProps) => {
  const router = useRouter();

  // Fungsi untuk navigasi ke /myrwa/[address]
  const handleViewClick = () => {
    router.push(`/myrwa/${address}`);
  };

  return (
    <Card className="flex flex-col rounded-[0.694vw] border-1 border-[#D5D7DA] w-[25vw] aspect-[360/283]">
      {" "}
      {/* Use shadcn Card */}
      <div className="relative w-full aspect-[360/136]">
        <Image
          src={image}
          alt="RWA Image"
          fill
          className="object-cover rounded-t-[0.694vw]"
          onError={() => console.error(`Failed to load image: ${image}`)}
        />
      </div>
      <CardContent className="flex flex-col justify-between p-4 gap-[0.883vw]">
        {" "}
        {/* Use CardContent */}
        <div className="flex flex-col gap-[0.139vw] font-jakarta">
          <CardDescription className="flex justify-items-center text-[0.863vw] leading-[1.25vw] text-[#420092] font-medium">
            {" "}
            {/* Use CardDescription */}
            {team}
          </CardDescription>
          <CardTitle className="font-jakarta text-[1.25vw] font-bold text-black">
            {" "}
            {/* Use CardTitle */}
            {title}
          </CardTitle>
          <p className="text-[0.972vw] leading-[1.458vw] font-normal font-jakarta text-[#535862]">
            {description}
          </p>
        </div>
        <div className="flex justify-end">
          <div className="w-[7.708vw] aspect-[111/30]">
            <Button
              variant={"outline"} // Use shadcn outline variant
              size={"sm"} // Use shadcn sm size
              fullW={true}
              onClick={handleViewClick} // Tambahkan onClick untuk navigasi
            >
              View {/* Use children instead of text prop */}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectRecent = ({
  titleSection = "Project Recently Viewed",
  descSection = "Your last touched RWA projects — instantly accessible for smooth on-chain flow.",
  data,
}: ProjectRecentProps) => {
  // Gunakan data dari prop, fallback ke data statis jika tidak ada
  const rwaData = data?.length
    ? data
    : [
        {
          team: "Hanis Team",
          title: "Fresh Villa Bali",
          image: "/assets/MyRWA/Dummy_Image_RWA.png",
          description: "Near from Kuta Beach, very comfortable",
          address: "0x0000000000000000000000000000000000000000",
        },
        {
          team: "Alpha Group",
          title: "Jakarta Smart Tower",
          image: "/assets/MyRWA/Dummy_Image_RWA.png",
          description: "High-tech office building in central Jakarta",
          address: "0x0000000000000000000000000000000000000000",
        },
        {
          team: "Sunrise Dev",
          title: "Sunset Villa Lombok",
          image: "/assets/MyRWA/Dummy_Image_RWA.png",
          description: "Beachfront villa with stunning view",
          address: "0x0000000000000000000000000000000000000000",
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
            address={item.address}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectRecent;
