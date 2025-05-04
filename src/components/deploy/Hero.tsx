"use client";

import Image from "next/image";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

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
        <div
          className="flex items-center gap-[0.83vw] mb-[4.5vw] cursor-pointer"
          onClick={() => router.back()}
        >
          <Image src="/icons/back.png" alt="Back" width={14} height={14} />
          <p className="text-[1.11vw] text-[#000000]">Back</p>
        </div>

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
        <div className="-mt-[4.3vw] w-[85.33vw] h-[55.14vw] border border-[#D5D7DA] rounded-xl p-[2vw] flex flex-col gap-[2vw]">
          {/* Header Card */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-[3vw]">
              <Image
                src="/icons/realestate.png"
                alt={title}
                width={70}
                height={70}
                className="-translate-x-[-1vw]"
              />
              <div>
                <h2 className="text-[1.53vw] text-[#5200B7] font-semibold">
                  {title}
                </h2>
                <p className="text-[0.97vw] text-[#535862]">
                  Long-term value from physical assets.
                </p>
              </div>
            </div>
            <div className="relative">
              <Button
                text="Deploy now"
                size="custom"
                customClass="py-[0.63vw] px-[3.33vw] text-[1.11vw] -translate-x-[1.8vw] translate-y-[1vw]"
                onClick={() =>
                  router.push(`/deploy${title.toLowerCase().replace(" ", "")}`)
                }
              />
            </div>
          </div>

          <div className="flex gap-[2vw]">
            {/* Card 1: Contract Information */}
            <div className="w-[51.1vw] h-[43.82vw] border border-[#E0E0E0] p-[1.4vw] rounded-lg">
              <div className="max-w-[55vw] mx-auto px-[2vw] pt-[1vw] pb-[2vw] text-[#000] font-jakarta font-normal text-[0.97vw] leading-[1.6]">
                <h3 className="text-[#000000] text-[1.25vw] font-semibold mb-[1vw]">
                  Contract Information
                </h3>
                <p className="mb-[1.3vw] text-justify">{contractInfo}</p>
              </div>
            </div>

            {/* Card 2 dan 3 */}
            <div className="flex flex-col gap-[1.5vw]">
              {/* Published by */}
              <div className="w-[33.74vw] h-[18.4vw] border border-[#E0E0E0] p-[1.2vw] rounded-lg">
                <h3 className="text-[#000000] text-[1.25vw] font-semibold mb-[1vw]">
                  Published by
                </h3>
                <div className="flex items-center gap-[1vw] mb-[1.2vw]">
                  <Image
                    src={companyLogo}
                    alt="Company"
                    width={40}
                    height={40}
                  />
                  <p className="text-[1.11vw] text-[#000000]">{companyName}</p>
                </div>
                <div className="flex flex-col gap-[0.8vw] translate-y-[1vw]">
                  <Button
                    text="View all contract"
                    variant="custom"
                    size="custom"
                    customClass="w-[26.9vw] h-[2.5vw] text-[0.9vw] border-[#CFB3F1] border rounded-md flex items-center justify-center"
                  />
                  <Button
                    text="Dashboard"
                    variant="custom"
                    size="custom"
                    customClass="w-[26.9vw] h-[2.5vw] text-[0.9vw] bg-[#420092] text-white border-none rounded-md flex items-center justify-center"
                  />
                </div>
              </div>

              {/* Details Card */}
              <div className="w-[33.74vw] h-[24vw] border border-[#E0E0E0] p-[1.2vw] rounded-lg">
                <h3 className="text-[#000000] text-[1.25vw] font-semibold mb-[1.7vw]">
                  Details
                </h3>
                <div>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
