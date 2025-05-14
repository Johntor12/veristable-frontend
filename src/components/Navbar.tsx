"use client";

import Logo from "../assets/Logo_Veristable.png";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { ConnectButton } from "@xellar/kit";
import { cn } from "@/lib/utils"; // Import cn for utility classes

const Navbar = () => {
  return (
    <div className="relative">
      <div className="absolute flex flex-row w-full h-[4.667vw] justify-center items-center font-jakarta">
        <div className="flex flex-row justify-between items-center w-[90vw] h-10">
          <div className="flex flex-row items-center h-full text-black">
            <Image
              src={Logo}
              width={40}
              className="aspect-square"
              alt="Logo Veristable"
            />
            <p className="font-jakarta text-[1.25vw] font-bold">Veristable</p>
          </div>
          <div className="grid grid-cols-13 justify-items-end items-center h-full gap-[2.667vw] text-black">
            {/* Use Link for navigation */}
            <Link
              href="/explore-rwa"
              className="col-span-3 font-jakarta text-[1.111vw]"
            >
              ExploreRWA
            </Link>
            <Link
              href="/myrwa"
              className="col-span-3 font-jakarta text-[1.111vw]"
            >
              MyRWA
            </Link>
            <Link
              href="/dashboard"
              className="col-span-3 font-jakarta text-[1.111vw]"
            >
              Dashboard
            </Link>
            <div className="col-span-4 font-jakarta text-[1.111vw]">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
