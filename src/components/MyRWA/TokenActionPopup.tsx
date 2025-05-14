"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { createClient } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Import shadcn Dialog components
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Import shadcn Tabs components
import { Input } from "@/components/ui/input"; // Import shadcn Input
import { Button } from "@/components/ui/button"; // Import shadcn Button
import { X } from "lucide-react"; // Import Lucide X icon
import { cn } from "@/lib/utils"; // Import cn

// Supabase Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Smart Contract ABI
const TokenABI = [
  "function totalSupply() public view returns (uint256)",
  "function decimals() public view returns (uint256)",
  "function symbol() public view returns (string)",
  "function balanceOf(address account) public view returns (uint256)",
];
const ReserveABI = [
  "function getReserveBalance(address tokenAddress) external view returns (uint256)",
  "function getLastUpdateTimestamp() external view returns (uint256)",
];
const VeristableAVSABI = [
  "function stakeForToken(address token) external payable",
  "function unstakeFromToken(address token, uint256 amount) external",
  "function claimTokenRewards(address token) external",
  "function distributeTokenRewards(address token) external payable",
  "function tokenStakes(address token, address staker) external view returns (uint256)",
  "function totalTokenStakes(address token) external view returns (uint256)",
  "function tokenRewardsPools(address token) external view returns (uint256)",
  "function pendingTokenRewards(address token, address staker) external view returns (uint256)",
  "function MIN_TOKEN_STAKE() external view returns (uint256)",
  "function paused() external view returns (bool)",
];

// Alamat Kontrak di Pharos Network
const reserveAddress = "0xb080914D90A76EC677a9d288e9BF03B9a052769d";
const veristableAVSAddress = "0xfDb408556Fb995C105Fb98dd4e682322d5Cf68b3";

interface Token {
  id: number;
  name: string;
  address: string;
  totalSupply: string;
  reserve: string;
  restake: string;
}

interface TokenInfo {
  name: string;
  address: string;
  totalSupply: string;
  reserve: string;
  userBalance: string;
  userStake: string;
  totalStaked: string;
  rewardsPool: string;
  pendingRewards: string;
  minStake: string;
  lastUpdate: string;
  symbol: string;
  decimals: number;
}

interface TokenActionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  token: Token;
  walletClient: any;
  account: string | undefined;
}

export default function TokenActionPopup({
  isOpen,
  onClose,
  token,
  walletClient,
  account,
}: TokenActionPopupProps) {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [depositRewardAmount, setDepositRewardAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"stake" | "unstake" | "rewards">(
    "stake"
  );

  // Fungsi untuk menyimpan data ke Supabase
  const saveToSupabase = async (
    onchainTotalSupply: number,
    onchainReserveBalance: number,
    onchainRestake: number
  ) => {
    if (!ethers.isAddress(token.address)) return;

    const realEstateData = {
      address: token.address,
      owner: account,
      reserve: Math.floor(onchainReserveBalance),
      totalSupply: Math.floor(onchainTotalSupply),
      restake: onchainRestake,
    };

    try {
      const { error } = await supabase
        .from("real_estate")
        .upsert([realEstateData], {
          onConflict: "address",
        });
      if (error)
        throw new Error(`Failed to save to Supabase: ${error.message}`);
    } catch (err: any) {
      console.error("Error saving to Supabase:", err);
      setErrorMessage(`Failed to save to database: ${err.message}`);
    }
  };

  const fetchTokenInfo = async () => {
    if (!walletClient || !account || !ethers.isAddress(token.address)) return;
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      const tokenContract = new ethers.Contract(
        token.address,
        TokenABI,
        provider
      );
      const reserveContract = new ethers.Contract(
        reserveAddress,
        ReserveABI,
        provider
      );
      const avsContract = new ethers.Contract(
        veristableAVSAddress,
        VeristableAVSABI,
        signer
      );

      const [
        decimalsBigInt,
        symbol,
        totalSupplyRaw,
        reserveBalanceRaw,
        timestampBigInt,
        balanceRaw,
        userStake,
        totalStaked,
        rewardsPool,
        pendingRewards,
        minStake,
        isPaused,
      ] = await Promise.all([
        tokenContract.decimals(),
        tokenContract.symbol(),
        tokenContract.totalSupply(),
        reserveContract.getReserveBalance(token.address),
        reserveContract.getLastUpdateTimestamp(),
        tokenContract.balanceOf(account),
        avsContract.tokenStakes(token.address, account),
        avsContract.totalTokenStakes(token.address),
        avsContract.tokenRewardsPools(token.address),
        avsContract.pendingTokenRewards(token.address, account),
        avsContract.MIN_TOKEN_STAKE(),
        avsContract.paused(),
      ]);

      if (isPaused) {
        setErrorMessage("Contract is paused. Actions are disabled.");
        return;
      }

      const decimals = Number(decimalsBigInt);
      setTokenInfo({
        name: token.name,
        address: token.address,
        totalSupply: `${parseFloat(ethers.formatUnits(totalSupplyRaw, decimals)).toFixed(2)} ${symbol}`,
        reserve: `${parseFloat(ethers.formatUnits(reserveBalanceRaw, decimals)).toFixed(2)} ${symbol}`,
        userBalance: `${parseFloat(ethers.formatUnits(balanceRaw, decimals)).toFixed(2)} ${symbol}`,
        userStake: `${parseFloat(ethers.formatUnits(userStake, 18)).toFixed(4)} ETH`,
        totalStaked: `${parseFloat(ethers.formatUnits(totalStaked, 18)).toFixed(4)} ETH`,
        rewardsPool: `${parseFloat(ethers.formatUnits(rewardsPool, 18)).toFixed(4)} ETH`,
        pendingRewards: `${parseFloat(ethers.formatUnits(pendingRewards, 18)).toFixed(4)} ETH`,
        minStake: `${parseFloat(ethers.formatUnits(minStake, 18)).toFixed(4)} ETH`,
        lastUpdate: new Date(Number(timestampBigInt) * 1000).toLocaleString(),
        symbol,
        decimals,
      });
    } catch (err: any) {
      console.error("Error fetching token info:", err);
      setErrorMessage(`Failed to load token information: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const stakeForToken = async () => {
    if (
      !walletClient ||
      !account ||
      !stakeAmount ||
      parseFloat(stakeAmount) <= 0
    ) {
      setErrorMessage("Please enter a valid stake amount");
      return;
    }
    if (tokenInfo && parseFloat(stakeAmount) < parseFloat(tokenInfo.minStake)) {
      setErrorMessage(`Stake amount must be at least ${tokenInfo.minStake}`);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const avs = new ethers.Contract(
        veristableAVSAddress,
        VeristableAVSABI,
        signer
      );
      const tokenContract = new ethers.Contract(
        token.address,
        TokenABI,
        provider
      );
      const reserveContract = new ethers.Contract(
        reserveAddress,
        ReserveABI,
        provider
      );

      const tx = await avs.stakeForToken(token.address, {
        value: ethers.parseEther(stakeAmount),
        gasLimit: 500000,
      });

      await tx.wait();

      const [totalSupplyRaw, reserveBalanceRaw, totalStakedRaw] =
        await Promise.all([
          tokenContract.totalSupply(),
          reserveContract.getReserveBalance(token.address),
          avs.totalTokenStakes(token.address),
        ]);

      const totalSupply = parseFloat(
        ethers.formatUnits(totalSupplyRaw, tokenInfo?.decimals || 18)
      );
      const reserveBalance = parseFloat(
        ethers.formatUnits(reserveBalanceRaw, tokenInfo?.decimals || 18)
      );
      const restake = parseFloat(ethers.formatUnits(totalStakedRaw, 18));

      await saveToSupabase(totalSupply, reserveBalance, restake);

      setStakeAmount("");
      alert("ETH successfully staked!");
      await fetchTokenInfo();
    } catch (err: any) {
      console.error("Error staking ETH:", err);
      setErrorMessage(`Failed to stake: ${err.reason || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const unstakeFromToken = async () => {
    if (
      !walletClient ||
      !account ||
      !unstakeAmount ||
      parseFloat(unstakeAmount) <= 0
    ) {
      setErrorMessage("Please enter a valid unstake amount");
      return;
    }
    if (
      tokenInfo &&
      parseFloat(unstakeAmount) > parseFloat(tokenInfo.userStake)
    ) {
      setErrorMessage(
        `Unstake amount cannot exceed your stake (${tokenInfo.userStake})`
      );
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const avs = new ethers.Contract(
        veristableAVSAddress,
        VeristableAVSABI,
        signer
      );
      const tokenContract = new ethers.Contract(
        token.address,
        TokenABI,
        provider
      );
      const reserveContract = new ethers.Contract(
        reserveAddress,
        ReserveABI,
        provider
      );

      const isPaused = await avs.paused();
      if (isPaused) {
        setErrorMessage("Cannot unstake: Contract is paused");
        return;
      }

      const amount = ethers.parseEther(unstakeAmount);
      const tx = await avs.unstakeFromToken(token.address, amount, {
        gasLimit: 500000,
      });

      await tx.wait();

      const [totalSupplyRaw, reserveBalanceRaw, totalStakedRaw] =
        await Promise.all([
          tokenContract.totalSupply(),
          reserveContract.getReserveBalance(token.address),
          avs.totalTokenStakes(token.address),
        ]);

      const totalSupply = parseFloat(
        ethers.formatUnits(totalSupplyRaw, tokenInfo?.decimals || 18)
      );
      const reserveBalance = parseFloat(
        ethers.formatUnits(reserveBalanceRaw, tokenInfo?.decimals || 18)
      );
      const restake = parseFloat(ethers.formatUnits(totalStakedRaw, 18));

      await saveToSupabase(totalSupply, reserveBalance, restake);

      setUnstakeAmount("");
      alert("ETH successfully unstaked!");
      await fetchTokenInfo();
    } catch (err: any) {
      console.error("Error unstaking ETH:", err);
      setErrorMessage(`Failed to unstake: ${err.reason || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const claimTokenRewards = async () => {
    if (!walletClient || !account) {
      setErrorMessage("Please connect your wallet");
      return;
    }
    if (!tokenInfo) {
      setErrorMessage("Token information not loaded");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const avs = new ethers.Contract(
        veristableAVSAddress,
        VeristableAVSABI,
        signer
      );
      const tokenContract = new ethers.Contract(
        token.address,
        TokenABI,
        provider
      );
      const reserveContract = new ethers.Contract(
        reserveAddress,
        ReserveABI,
        provider
      );

      const isPaused = await avs.paused();
      if (isPaused) {
        setErrorMessage("Cannot claim rewards: Contract is paused");
        return;
      }

      const userStake = await avs.tokenStakes(token.address, account);
      if (userStake === BigInt(0)) {
        setErrorMessage("No active stake found. Cannot claim rewards.");
        return;
      }

      const tx = await avs.claimTokenRewards(token.address, {
        gasLimit: 600000,
      });

      await tx.wait();

      const [totalSupplyRaw, reserveBalanceRaw, totalStakedRaw] =
        await Promise.all([
          tokenContract.totalSupply(),
          reserveContract.getReserveBalance(token.address),
          avs.totalTokenStakes(token.address),
        ]);

      const totalSupply = parseFloat(
        ethers.formatUnits(totalSupplyRaw, tokenInfo?.decimals || 18)
      );
      const reserveBalance = parseFloat(
        ethers.formatUnits(reserveBalanceRaw, tokenInfo?.decimals || 18)
      );
      const restake = parseFloat(ethers.formatUnits(totalStakedRaw, 18));

      await saveToSupabase(totalSupply, reserveBalance, restake);

      alert("Rewards successfully claimed!");
      await fetchTokenInfo();
    } catch (err: any) {
      console.error("Error claiming rewards:", err);
      setErrorMessage(`Failed to claim rewards: ${err.reason || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const distributeTokenRewards = async () => {
    if (
      !walletClient ||
      !account ||
      !depositRewardAmount ||
      parseFloat(depositRewardAmount) <= 0
    ) {
      setErrorMessage("Please enter a valid reward amount");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const avs = new ethers.Contract(
        veristableAVSAddress,
        VeristableAVSABI,
        signer
      );
      const tokenContract = new ethers.Contract(
        token.address,
        TokenABI,
        provider
      );
      const reserveContract = new ethers.Contract(
        reserveAddress,
        ReserveABI,
        provider
      );

      const isPaused = await avs.paused();
      if (isPaused) {
        setErrorMessage("Cannot distribute rewards: Contract is paused");
        return;
      }

      const amount = ethers.parseEther(depositRewardAmount);
      const tx = await avs.distributeTokenRewards(token.address, {
        value: amount,
        gasLimit: 500000,
      });

      await tx.wait();

      const [totalSupplyRaw, reserveBalanceRaw, totalStakedRaw] =
        await Promise.all([
          tokenContract.totalSupply(),
          reserveContract.getReserveBalance(token.address),
          avs.totalTokenStakes(token.address),
        ]);

      const totalSupply = parseFloat(
        ethers.formatUnits(totalSupplyRaw, tokenInfo?.decimals || 18)
      );
      const reserveBalance = parseFloat(
        ethers.formatUnits(reserveBalanceRaw, tokenInfo?.decimals || 18)
      );
      const restake = parseFloat(ethers.formatUnits(totalStakedRaw, 18));

      await saveToSupabase(totalSupply, reserveBalance, restake);

      setDepositRewardAmount("");
      alert("Rewards successfully distributed!");
      await fetchTokenInfo();
    } catch (err: any) {
      console.error("Error distributing rewards:", err);
      setErrorMessage(
        `Failed to distribute rewards: ${err.reason || err.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTokenInfo();
    } else {
      setTokenInfo(null); // Reset token info when dialog is closed
      setErrorMessage(null); // Clear error message
      setStakeAmount(""); // Clear input fields
      setUnstakeAmount("");
      setDepositRewardAmount("");
      setActiveTab("stake"); // Reset to default tab
    }
  }, [isOpen, token.address, walletClient, account]); // Added dependencies

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {" "}
      {/* Use shadcn Dialog */}
      <DialogContent className="sm:max-w-[425px]">
        {" "}
        {/* Use shadcn DialogContent */}
        <DialogHeader>
          {" "}
          {/* Use shadcn DialogHeader */}
          <DialogTitle>Token Actions</DialogTitle>{" "}
          {/* Use shadcn DialogTitle */}
          <DialogDescription>
            {" "}
            {/* Use shadcn DialogDescription */}
            Perform actions on {token.name} ({token.address.slice(0, 6)}...
            {token.address.slice(-4)})
          </DialogDescription>
        </DialogHeader>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        {isLoading ? (
          <div className="text-center">Loading token info...</div>
        ) : tokenInfo ? (
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "stake" | "unstake" | "rewards")
            }
            className="w-full"
          >
            {" "}
            {/* Use shadcn Tabs */}
            <TabsList className="grid w-full grid-cols-3">
              {" "}
              {/* Use shadcn TabsList */}
              <TabsTrigger value="stake">Stake</TabsTrigger>{" "}
              {/* Use shadcn TabsTrigger */}
              <TabsTrigger value="unstake">Unstake</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
            </TabsList>
            <TabsContent value="stake" className="space-y-4">
              {" "}
              {/* Use shadcn TabsContent */}
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Your Balance: {tokenInfo.userBalance}
                </p>
                <p className="text-sm font-medium text-gray-700">
                  Minimum Stake: {tokenInfo.minStake}
                </p>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="stake-amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount to Stake (ETH)
                </label>
                <Input
                  id="stake-amount"
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <Button
                onClick={stakeForToken}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Staking..." : "Stake"}
              </Button>
            </TabsContent>
            <TabsContent value="unstake" className="space-y-4">
              {" "}
              {/* Use shadcn TabsContent */}
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Your Stake: {tokenInfo.userStake}
                </p>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="unstake-amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount to Unstake (ETH)
                </label>
                <Input
                  id="unstake-amount"
                  type="number"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <Button
                onClick={unstakeFromToken}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Unstaking..." : "Unstake"}
              </Button>
            </TabsContent>
            <TabsContent value="rewards" className="space-y-4">
              {" "}
              {/* Use shadcn TabsContent */}
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Pending Rewards: {tokenInfo.pendingRewards}
                </p>
                <p className="text-sm font-medium text-gray-700">
                  Rewards Pool: {tokenInfo.rewardsPool}
                </p>
              </div>
              <Button
                onClick={claimTokenRewards}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Claiming..." : "Claim Rewards"}
              </Button>
              <div className="space-y-2">
                <label
                  htmlFor="deposit-rewards-amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount to Deposit to Rewards Pool (ETH)
                </label>
                <Input
                  id="deposit-rewards-amount"
                  type="number"
                  value={depositRewardAmount}
                  onChange={(e) => setDepositRewardAmount(e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <Button
                onClick={distributeTokenRewards}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Depositing..." : "Deposit Rewards"}
              </Button>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center text-red-500">
            Failed to load token info.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
