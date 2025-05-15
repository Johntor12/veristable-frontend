"use client";

import React from "react";

import { type Config, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XellarKitProvider, defaultConfig } from "@xellar/kit";
import { liskSepolia, lisk } from "viem/chains";

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const xellarAppId = process.env.NEXT_PUBLIC_XELLAR_APP_ID;

if (!walletConnectProjectId) {
  throw new Error("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not defined");
}
if (!xellarAppId) {
  throw new Error("NEXT_PUBLIC_XELLAR_APP_ID is not defined");
}

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

const config = defaultConfig({
  appName: "Xellar",
  walletConnectProjectId,
  xellarAppId,
  xellarEnv: "sandbox",
  chains: [lisk, liskSepolia, pharosDevnet],
}) as Config;

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <XellarKitProvider>{children}</XellarKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
