"use client";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { createClient } from "@supabase/supabase-js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

// Alamat Kontrak di Lisk Sepolia Network
const reserveAddress = "0x8A34597c14F11743dA19a8D9Ff09866A211be089";
const veristableAVSAddress = "0x1F113512858d23EC940846486A4800077CC42678";

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
      toast.success("ETH successfully staked!");
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
      toast.success("ETH successfully unstaked!");
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
      if (userStake === 0) {
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

      toast.success("Rewards successfully claimed!");
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
      toast.success("Rewards successfully distributed!");
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
    if (isOpen) fetchTokenInfo();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <ToastContainer />
      <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-xl relative border border-gray-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-gray-500 hover:text-gray-700"
        >
          <IoClose />
        </button>

        <h2 className="text-xl font-bold mb-6 text-gray-800">Token Actions</h2>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : tokenInfo ? (
          <>
            {/* Token Info */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">
                Token Information
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="col-span-2">
                  <label className="block text-sm text-gray-500">Status</label>
                  <p
                    className={`font-medium text-gray-500  ${parseFloat(tokenInfo.reserve) >= parseFloat(tokenInfo.totalSupply) ? "text-green-500" : "text-red-500"}`}
                  >
                    {parseFloat(tokenInfo.reserve) >=
                    parseFloat(tokenInfo.totalSupply)
                      ? "VERIFIED"
                      : "UNVERIFIED"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">
                    Token Name
                  </label>
                  <p className="font-medium text-gray-500 ">{tokenInfo.name}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Address</label>
                  <p className="font-mono text-xs text-gray-500 truncate">
                    {tokenInfo.address}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">
                    Total Supply
                  </label>
                  <p className="font-medium text-gray-500 ">
                    {tokenInfo.totalSupply}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">
                    Reserve Balance
                  </label>
                  <p className="font-medium text-gray-500 ">
                    {tokenInfo.reserve}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">
                    Your Balance
                  </label>
                  <p className="font-medium text-gray-500 ">
                    {tokenInfo.userBalance}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">
                    Last Update
                  </label>
                  <p className="font-medium text-gray-500 ">
                    {tokenInfo.lastUpdate}
                  </p>
                </div>
              </div>
            </div>

            {/* Staking Info */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">
                Staking Information
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-sm text-gray-500">
                    Your Stake
                  </label>
                  <p className="font-medium text-gray-500 ">
                    {tokenInfo.userStake}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">
                    Total Staked
                  </label>
                  <p className="font-medium text-gray-500 ">
                    {tokenInfo.totalStaked}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">
                    Rewards Pool
                  </label>
                  <p className="font-medium text-gray-500 ">
                    {tokenInfo.rewardsPool}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">
                    Pending Rewards
                  </label>
                  <p className="font-medium text-gray-500 ">
                    {tokenInfo.pendingRewards}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">
                    Minimum Stake
                  </label>
                  <p className="font-medium text-gray-500 ">
                    {tokenInfo.minStake}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`px-4 py-2 font-medium text-gray-500  ${
                    activeTab === "stake"
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("stake")}
                >
                  Stake
                </button>
                <button
                  className={`px-4 py-2 font-medium text-gray-500  ${
                    activeTab === "unstake"
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("unstake")}
                >
                  Unstake
                </button>
                <button
                  className={`px-4 py-2 font-medium text-gray-500  ${
                    activeTab === "rewards"
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("rewards")}
                >
                  Rewards
                </button>
              </div>

              {activeTab === "stake" && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-500  text-gray-700">
                    Amount to Stake (ETH){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    placeholder="Enter amount to stake"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={stakeForToken}
                      disabled={
                        isLoading ||
                        !stakeAmount ||
                        parseFloat(stakeAmount) <= 0
                      }
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-300"
                    >
                      {isLoading ? "Processing..." : "Stake ETH"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "unstake" && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-500  text-gray-700">
                    Amount to Unstake (ETH){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    placeholder="Enter amount to unstake"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={unstakeFromToken}
                      disabled={
                        isLoading ||
                        !unstakeAmount ||
                        parseFloat(unstakeAmount) <= 0 ||
                        !tokenInfo ||
                        parseFloat(tokenInfo.userStake) <= 0
                      }
                      className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-red-300"
                    >
                      {isLoading ? "Processing..." : "Unstake ETH"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "rewards" && (
                <div className="space-y-4">
                  <button
                    onClick={claimTokenRewards}
                    disabled={isLoading}
                    className="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                  >
                    {isLoading ? "Processing..." : "Claim Rewards"}
                  </button>

                  <label className="block text-sm font-medium text-gray-500  text-gray-700">
                    Amount to Distribute (ETH){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    placeholder="Enter amount to distribute"
                    value={depositRewardAmount}
                    onChange={(e) => setDepositRewardAmount(e.target.value)}
                    className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={distributeTokenRewards}
                      disabled={
                        isLoading ||
                        !depositRewardAmount ||
                        parseFloat(depositRewardAmount) <= 0
                      }
                      className="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                    >
                      {isLoading ? "Processing..." : "Distribute Rewards"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 mt-4 bg-red-100 text-red-700 rounded-md text-sm">
                {errorMessage}
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500">Failed to load token data</p>
        )}
      </div>
    </div>
  );
}
