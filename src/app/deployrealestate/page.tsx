'use client';

import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function DeployPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white pt-[6vw] px-4 lg:px-0 font-jakarta ml-[1vw]">
      <div className="w-[90%] mx-auto py-12">

        {/* Back Button */}
        <div
          className="flex items-center gap-[0.83vw] mb-[4.5vw] cursor-pointer"
          onClick={() => router.back()}
        >
          <Image src="/icons/back.png" alt="Back" width={14} height={14} />
          <p className="text-[1.11vw] text-[#000000]">Back</p>
        </div>

        {/* Card Utama dengan Border */}
        <div className="w-[78.33vw] h-[123.75vw] border border-[#D5D7DA] rounded-xl p-[2vw]">
          {/* Header Card */}
          <div className="flex items-center gap-[3vw]">
            <Image
              src="/icons/realestate.png"
              alt="Real Estate"
              width={70}
              height={70}
              className="-translate-x-[-1vw]"
            />
            <div>
              <h2 className="text-[1.53vw] text-[#5200B7] font-semibold">Real Estate</h2>
              <p className="text-[0.97vw] text-[#535862]">Long-term value from physical properties.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
