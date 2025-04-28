"use client";

import Logo from "../assets/Logo_Veristable.png";
import Image from "next/image";
import Button from "./Button";

const Navbar = () => {
  return (
    <div className="relative">
      <div className="absolute flex flex-row w-full h-[4.667vw] justify-center items-center font-jakarta">
        <div className="flex flex-row justify-between items-center w-[90%] h-10">
          <div className="flex flex-row items-center h-full text-black">
            <Image
              src={Logo}
              width={40}
              className="aspect-square"
              alt="Logo Veristable"
            />
            <p className="font-jakarta text-[1.25vw] font-bold">Veristable</p>
          </div>
          <div className="grid grid-cols-13 justify-items-end  items-center h-full gap-[2.667vw] text-black">
            <p className="col-span-3 font-jakarta text-[1.111vw]">ExploreRWA</p>
            <p className="col-span-3 font-jakarta text-[1.111vw]">MyRWA</p>
            <p className="col-span-3 font-jakarta text-[1.111vw]">Dashboard</p>
            <Button
              text="Login"
              customClass="col-span-4 text-[1.111vw] font-jakarta rounded-[0.694vw] h-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
