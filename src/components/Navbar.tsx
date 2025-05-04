"use client";

import Logo from "../assets/Logo_Veristable.png";
import Image from "next/image";
// import Button from "./Button";
import { ConnectButton } from "@rainbow-me/rainbowkit";

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
          <nav className="grid grid-cols-13 justify-items-end items-center h-full gap-[2.667vw] text-black">
            <a
              href="/explore-rwa"
              className="col-span-3 font-jakarta text-[1.111vw]"
            >
              ExploreRWA
            </a>
            <a href="/myrwa" className="col-span-3 font-jakarta text-[1.111vw]">
              MyRWA
            </a>
            <a
              href="/dashboard"
              className="col-span-3 font-jakarta text-[1.111vw]"
            >
              Dashboard
            </a>
            <div className="col-span-4 font-jakarta text-[1.111vw]">
              <ConnectButton
                chainStatus="icon"
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full",
                }}
                label="Connect Wallet"
              />
            </div>
          </nav>
        </div>
      </div>
    </div>
  );

  // <header className="fixed top-0 z-50 w-full bg-white shadow-sm">
  //   <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
  {
    /* Logo Section */
  }
  // <div className="flex items-center gap-2">
  //   <Image
  //     src={Logo}
  //     width={40}
  //     height={40}
  //     alt="Veristable Logo"
  //     className="h-10 w-10"
  //     priority
  //   />
  //   <span className="font-jakarta text-lg font-bold text-gray-900 md:text-xl">
  //     Veristable
  //   </span>
  // </div>

  {
    /* Navigation Links */
  }
  // <nav className="hidden items-center gap-6 font-jakarta text-sm text-gray-900 md:flex md:text-base">
  //   <a href="/explore-rwa" className="hover:text-purple-600">
  //     ExploreRWA
  //   </a>
  //   <a href="/myrwa" className="hover:text-purple-600">
  //     MyRWA
  //   </a>
  //   <a href="/dashboard" className="hover:text-purple-600">
  //     Dashboard
  //   </a>
  // </nav>

  {
    /* Connect Wallet Button */
  }
  // <div className="flex items-center">
  //   <ConnectButton
  //     chainStatus="icon"
  //     accountStatus={{
  //       smallScreen: "avatar",
  //       largeScreen: "full",
  //     }}
  //   />
  // </div>
  //   </div>
  // </header>
};

export default Navbar;
