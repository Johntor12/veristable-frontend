"use client";

import React from "react";

import { type Config, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XellarKitProvider, defaultConfig } from "@xellar/kit";
import { liskSepolia } from "viem/chains";

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const xellarAppId = process.env.NEXT_PUBLIC_XELLAR_APP_ID;

if (!walletConnectProjectId) {
  throw new Error("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not defined");
}
if (!xellarAppId) {
  throw new Error("NEXT_PUBLIC_XELLAR_APP_ID is not defined");
}

const config = defaultConfig({
  appName: "Xellar",
  walletConnectProjectId,
  xellarAppId,
  xellarEnv: "sandbox",
  chains: [liskSepolia],
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
