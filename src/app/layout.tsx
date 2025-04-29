"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";

// Define Pharos Devnet
const pharosDevnet = {
  id: 50002,
  name: "Pharos Devnet",
  network: "pharos",
  nativeCurrency: {
    decimals: 18,
    name: "Pharos",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://devnet.dplabs-internal.com"] },
    default: { http: ["https://devnet.dplabs-internal.com"] },
  },
} as const;

// Configure wagmi
const config = getDefaultConfig({
  appName: "VeriStable",
  projectId:
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "YOUR_PROJECT_ID", // Replace with actual WalletConnect Project ID
  chains: [pharosDevnet],
  ssr: true, // Enable SSR support
});

const queryClient = new QueryClient();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <Navbar />
              {children}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
