"use client";
import React from "react";
import Button from "../Button";
import Image from "next/image";
import Hero_Image from "../../assets/hero_image.png";

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
                  text="Get Started"
                  fullW={true}
                  customClass="rounded-[0.694vw]"
                />
              </div>
              <div className="w-[40%]">
                <Button
                  variant="secondary"
                  text="Explore"
                  fullW={true}
                  customClass="border"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#100FF1] w-full">
        <Image
          src={Hero_Image}
          width={552}
          className="aspect-[552/440]"
          alt="Hero Image"
        />
      </div>
    </div>
  );
};

export default Hero;
