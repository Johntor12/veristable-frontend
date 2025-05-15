"use client";

import Logo from "../assets/Logo_Veristable.png";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "@xellar/kit";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <Image
            src={Logo}
            width={40}
            height={40}
            alt="Veristable Logo"
            className="object-contain"
          />
          <span className="font-jakarta font-bold text-lg md:text-xl text-black">
            Veristable
          </span>
        </div>

        {/* Navigation Section */}
        <nav className="flex items-center space-x-6 md:space-x-8">
          <Link
            href="/explore-rwa"
            className="font-jakarta text-sm md:text-base text-black hover:text-blue-600 transition-colors"
          >
            ExploreRWA
          </Link>
          <Link
            href="/myrwa"
            className="font-jakarta text-sm md:text-base text-black hover:text-blue-600 transition-colors"
          >
            MyRWA
          </Link>
          <Link
            href="/dashboard"
            className="font-jakarta text-sm md:text-base text-black hover:text-blue-600 transition-colors"
          >
            Dashboard
          </Link>
          <ConnectButton />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
