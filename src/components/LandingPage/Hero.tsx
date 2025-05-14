"use client";
import React from "react";
import Button from "../Button"; // Assuming this is the refactored shadcn Button
import Image from "next/image";
import Hero_Image from "../../assets/hero_image.png";
import { cn } from "@/lib/utils"; // Import cn

const Hero = () => {
  return (
    <div className="w-full grid grid-cols-2 gap-[1.111vw] ">
      <div className="grid grid-rows-7  w-full text-black font-jakarta">
        <div className="row-span-4 p-4 text-purple-100 w-full"></div>
        <div className="row-span-3 flex flex-col gap-y-[0.667vw] w-full bg-white text-[#420092]">
          <h1 className="font-bold text-[2.639vw]">Trust, Backed By Proof.</h1>
          <p className="text-[1.25vw] text-black">
            Trust, Backed by Proof. The new standard for verifying stability in
            digital and tokenized assets.
          </p>
          <div className="grid grid-cols-7 ">
            <div className="col-span-5 flex flex-row gap-[1.556vw]">
              <div className="w-[55%]">
                <Button
                  fullW={true}
                  className="rounded-[0.694vw]" // Use className
                >
                  Get Started {/* Use children */}
                </Button>
              </div>
              <div className="w-[40%]">
                <Button
                  variant="outline" // Use shadcn outline variant
                  fullW={true}
                  className="border" // Use className
                >
                  Explore {/* Use children */}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center items-end">
        <Image
          src={Hero_Image}
          sizes={"38.333vw"}
          className="aspect-[552/440]"
          alt="Hero Image"
        />
      </div>
    </div>
  );
};

export default Hero;
