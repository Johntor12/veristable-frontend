"use client";

import Image from "next/image";
import Button from "@/components/Button"; // Assuming "@/components/Button" now exports the shadcn Button
import Link from "next/link"; // Import Link for navigation if needed
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react"; // Import ChevronLeft icon

type HeroProps = {
  title: string;
  subtitle: string;
  contractInfo: string;
  companyName: string;
  companyLogo: string;
  publishDate: string;
  auditReportLink: string;
  licenses: string;
  mintedAssets: string;
  heroImage: string;
};

const Hero = ({
  title,
  subtitle,
  contractInfo,
  companyName,
  companyLogo,
  publishDate,
  auditReportLink,
  licenses,
  mintedAssets,
  heroImage,
}: HeroProps) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white pt-[6vw] px-4 lg:px-0 font-jakarta">
      <div className="w-[90%] mx-auto py-12">
        {/* Bagian 1: Back */}
        <Button
          variant="ghost" // Use ghost variant for a minimal button
          size="sm" // Use small size
          onClick={() => router.back()}
          className="flex items-center gap-[0.83vw] mb-[4.5vw]"
        >
          <ChevronLeft size={16} /> {/* Use Lucide icon */}
          <p className="text-[1.11vw] text-[#000000]">Back</p>
        </Button>

        {/* Bagian 2: Deploy Header */}
        <div className="flex justify-between items-start mb-[4vw]">
          <div className="max-w-[40vw]">
            <h1 className="text-[#420092] text-[2.64vw] font-bold mb-[1vw]">
              {title}
            </h1>
            <p className="text-[#535862] text-[1.25vw] whitespace-nowrap">
              {subtitle}
            </p>
          </div>
          <div className="lg:-translate-x-[5vw] lg:-translate-y-[6.4vw]">
            <Image
              src={heroImage}
              alt="Symbol"
              width={761}
              height={450}
              className="w-[26.9vw] h-auto"
            />
          </div>
        </div>

        {/* Bagian 3: Card Utama */}
        <Card className="-mt-[4.3vw] w-[85.33vw] h-[55.14vw] p-[2vw] flex flex-col gap-[2vw]">
          <CardHeader className="flex flex-row justify-between items-start p-0">
            <div className="flex items-center gap-[3vw]">
              <Image
                src="/icons/realestate.png"
                alt={title}
                width={70}
                height={70}
                className="-translate-x-[-1vw]"
              />
              <div>
                <CardTitle className="text-[1.53vw] text-[#5200B7] font-semibold">
                  {title}
                </CardTitle>
                <CardDescription className="text-[0.97vw] text-[#535862]">
                  Long-term value from physical assets.
                </CardDescription>
              </div>
            </div>
            <div className="relative">
              <Button
                size="sm" // Use shadcn size
                className="py-[0.63vw] px-[3.33vw] text-[1.11vw] -translate-x-[1.8vw] translate-y-[1vw]" // Apply custom classes via className
                onClick={() =>
                  router.push(`/deploy${title.toLowerCase().replace(" ", "")}`)
                }
              >
                Deploy now
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex gap-[2vw] p-0">
            {/* Card 1: Contract Information */}
            <Card className="w-[51.1vw] h-[43.82vw] p-[1.4vw] flex flex-col">
              <CardHeader className="p-0 mb-[1vw]">
                <CardTitle className="text-[#000000] text-[1.25vw] font-semibold">
                  Contract Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-justify text-[#000] font-jakarta font-normal text-[0.97vw] leading-[1.6]">
                <p>{contractInfo}</p>
              </CardContent>
            </Card>

            {/* Card 2 dan 3 */}
            <div className="flex flex-col gap-[1.5vw]">
              {/* Published by */}
              <Card className="w-[33.74vw] h-[18.4vw] p-[1.2vw] flex flex-col">
                <CardHeader className="p-0 mb-[1vw]">
                  <CardTitle className="text-[#000000] text-[1.25vw] font-semibold">
                    Published by
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex items-center gap-[1vw] mb-[1.2vw]">
                    <Image
                      src={companyLogo}
                      alt="Company"
                      width={40}
                      height={40}
                    />
                    <p className="text-[1.11vw] text-[#000000]">
                      {companyName}
                    </p>
                  </div>
                  <div className="flex flex-col gap-[0.8vw] translate-y-[1vw]">
                    <Button
                      variant="outline" // Use outline variant
                      size="sm" // Use shadcn size
                      className="w-[26.9vw] h-[2.5vw] text-[0.9vw] border-[#CFB3F1] border rounded-md flex items-center justify-center" // Apply custom classes via className
                    >
                      View all contract
                    </Button>
                    <Button
                      variant="default" // Use default variant
                      size="sm" // Use shadcn size
                      className="w-[26.9vw] h-[2.5vw] text-[0.9vw] bg-[#420092] text-white border-none rounded-md flex items-center justify-center" // Apply custom classes via className
                    >
                      Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Details Card */}
              <Card className="w-[33.74vw] h-[24vw] p-[1.2vw] flex flex-col">
                <CardHeader className="p-0 mb-[1.7vw]">
                  <CardTitle className="text-[#000000] text-[1.25vw] font-semibold">
                    Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {[
                    {
                      icon: "/icons/publishdate.png",
                      title: "Publish Date",
                      caption: publishDate,
                    },
                    {
                      icon: "/icons/auditreport.png",
                      title: "Audit Report",
                      caption: auditReportLink,
                    },
                    {
                      icon: "/icons/licenses.png",
                      title: "Licenses",
                      caption: licenses,
                    },
                    {
                      icon: "/icons/mintedassets.png",
                      title: "Minted Assets",
                      caption: mintedAssets,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-[0.8vw] mb-[1.5vw]"
                    >
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={45}
                        height={45}
                      />
                      <div className="flex flex-col">
                        <p className="text-[0.97vw] text-[#000000] font-medium">
                          {item.title}
                        </p>
                        <p className="text-[0.83vw] text-[#535862]">
                          {item.caption}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Hero;
