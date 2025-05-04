"use client";

import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Smart Contract ABI
const TokenABI = [
  "function totalSupply() public view returns (uint256)",
  "function decimals() public view returns (uint256)",
  "function symbol() public view returns (string)",
  "function balanceOf(address account) public view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
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

const TokenActionPopup = ({
  isOpen,
  onClose,
  token,
  walletClient,
  account,
}: TokenActionPopupProps) => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [depositRewardAmount, setDepositRewardAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"stake" | "unstake" | "rewards">(
    "stake"
  );

  useEffect(() => {
    const fetchTokenInfo = async () => {
      if (!walletClient || !account || !ethers.isAddress(token.address)) return;

      try {
        setIsLoading(true);
        setErrorMessage(null);
        const provider = new ethers.BrowserProvider(walletClient);
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
          provider
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
        setErrorMessage(
          `Failed to load token information: ${err.message || "Unknown error"}`
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) fetchTokenInfo();
  }, [isOpen, token, walletClient, account]);

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
      console.log("Staking:", { token: token.address, amount: stakeAmount });
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const avs = new ethers.Contract(
        veristableAVSAddress,
        VeristableAVSABI,
        signer
      );
      const tx = await avs.stakeForToken(token.address, {
        value: ethers.parseEther(stakeAmount),
        gasLimit: 500000,
      });
      console.log("Stake TX:", tx);
      await tx.wait();
      setStakeAmount("");
      alert("ETH successfully staked!");
      // Refresh token info
      fetchTokenInfo();
    } catch (err: any) {
      console.error("Error staking ETH:", err);
      setErrorMessage(
        `Failed to stake: ${err.reason || err.message || "Unknown error"}`
      );
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
      console.log("Unstaking:", {
        token: token.address,
        amount: unstakeAmount,
      });
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const avs = new ethers.Contract(
        veristableAVSAddress,
        VeristableAVSABI,
        signer
      );

      // Check if contract is paused
      const isPaused = await avs.paused();
      if (isPaused) {
        setErrorMessage("Cannot unstake: Contract is paused");
        return;
      }

      // Parse amount in wei (assuming amount is in ETH)
      const amount = ethers.parseEther(unstakeAmount);
      console.log("Unstake amount (wei):", amount.toString());
      const tx = await avs.unstakeFromToken(token.address, amount, {
        gasLimit: 500000,
      });
      console.log("Unstake TX:", tx);
      await tx.wait();
      setUnstakeAmount("");
      alert("ETH successfully unstaked!");
      // Refresh token info
      fetchTokenInfo();
    } catch (err: any) {
      console.error("Error unstaking ETH:", err);
      setErrorMessage(
        `Failed to unstake: ${err.reason || err.message || "Unknown error"}`
      );
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
      console.log("Claiming rewards for:", {
        token: token.address,
        pendingRewards: tokenInfo.pendingRewards,
      });

      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const avs = new ethers.Contract(
        veristableAVSAddress,
        VeristableAVSABI,
        signer
      );

      // Check if contract is paused
      const isPaused = await avs.paused();
      if (isPaused) {
        setErrorMessage("Cannot claim rewards: Contract is paused");
        return;
      }

      // Check user stake
      const userStake = await avs.tokenStakes(token.address, account);
      console.log("User stake:", ethers.formatUnits(userStake, 18));
      if (userStake === 0n) {
        setErrorMessage("No active stake found. Cannot claim rewards.");
        return;
      }

      // Execute claim
      const tx = await avs.claimTokenRewards(token.address, {
        gasLimit: 600000, // Increased gas limit
      });
      console.log("Claim TX:", tx);
      await tx.wait();
      alert("Rewards successfully claimed!");
      // Refresh token info
      await fetchTokenInfo();
    } catch (err: any) {
      console.error("Error claiming rewards:", err);
      setErrorMessage(
        `Failed to claim rewards: ${err.reason || err.message || "Unknown error"}`
      );
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
      console.log("Distributing rewards:", {
        token: token.address,
        amount: depositRewardAmount,
      });
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const avs = new ethers.Contract(
        veristableAVSAddress,
        VeristableAVSABI,
        signer
      );

      // Check if contract is paused
      const isPaused = await avs.paused();
      if (isPaused) {
        setErrorMessage("Cannot distribute rewards: Contract is paused");
        return;
      }

      // Parse amount in wei
      const amount = ethers.parseEther(depositRewardAmount);
      console.log("Distribute amount (wei):", amount.toString());
      const tx = await avs.distributeTokenRewards(token.address, {
        value: amount,
        gasLimit: 500000,
      });
      console.log("Distribute TX:", tx);
      await tx.wait();
      setDepositRewardAmount("");
      alert("Rewards successfully distributed!");
      // Refresh token info
      fetchTokenInfo();
    } catch (err: any) {
      console.error("Error distributing rewards:", err);
      setErrorMessage(
        `Failed to distribute rewards: ${err.reason || err.message || "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTokenInfo = async () => {
    if (!walletClient || !account || !ethers.isAddress(token.address)) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const provider = new ethers.BrowserProvider(walletClient);
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
        provider
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
      setErrorMessage(
        `Failed to load token information: ${err.message || "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="absolute bg-white rounded-lg w-[32vw] max-h-[80vh] overflow-y-auto p-6 relative shadow-md">
        <button onClick={onClose} className="absolute right-4 top-4 text-xl">
          <IoClose className="text-black" />
        </button>
        <h2 className="font-jakarta text-[1.2vw] font-bold mb-4 text-black">
          Token Actions
        </h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-[20vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-700"></div>
          </div>
        ) : tokenInfo ? (
          <>
            {/* Informasi Token */}
            <div className="mb-6">
              <h3 className="font-jakarta text-[1vw] font-semibold text-gray-800 mb-3">
                Token Information
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="col-span-2">
                  <label className="block text-[0.833vw] text-gray-600 mb-1">
                    Status
                  </label>
                  <p
                    className={`font-jakarta text-[0.972vw] ${parseFloat(tokenInfo.reserve) >= parseFloat(tokenInfo.totalSupply) ? "text-green-500" : "text-red-500"}`}
                  >
                    {parseFloat(tokenInfo.reserve) >=
                    parseFloat(tokenInfo.totalSupply)
                      ? "VERIFIED"
                      : "UNVERIFIED"}
                  </p>
                </div>
                <div>
                  <label className="block text-[0.833vw] text-gray-600 mb-1">
                    Token Name
                  </label>
                  <p className="font-jakarta text-[0.972vw] text-[#717680]">
                    {tokenInfo.name}
                  </p>
                </div>
                <div>
                  <label className="block text-[0.833vw] text-gray-600 mb-1">
                    Address
                  </label>
                  <p className="font-jakarta text-[0.972vw] text-[#717680]">
                    {tokenInfo.address.slice(0, 6)}...
                    {tokenInfo.address.slice(-4)}
                  </p>
                </div>
                <div>
                  <label className="block text-[0.833vw] text-gray-600 mb-1">
                    Total Supply
                  </label>
                  <p className="font-jakarta text-[0.972vw] text-[#717680]">
                    {tokenInfo.totalSupply}
                  </p>
                </div>
                <div>
                  <label className="block text-[0.833vw] text-gray-600 mb-1">
                    Reserve Balance
                  </label>
                  <p className="font-jakarta text-[0.972vw] text-[#717680]">
                    {tokenInfo.reserve}
                  </p>
                </div>
                <div>
                  <label className="block text-[0.833vw] text-gray-600 mb-1">
                    Your Balance
                  </label>
                  <p className="font-jakarta text-[0.972vw] text-[#717680]">
                    {tokenInfo.userBalance}
                  </p>
                </div>
                <div>
                  <label className="block text-[0.833vw] text-gray-600 mb-1">
                    Last Update
                  </label>
                  <p className="font-jakarta text-[0.972vw] text-[#717680]">
                    {tokenInfo.lastUpdate}
                  </p>
                </div>
              </div>
            </div>

            {/* Informasi Staking */}
            <div className="mb-6">
              <h3 className="font-jakarta text-[1vw] font-semibold text-gray-800 mb-3">
                Staking Information
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-[0.833vw] text-gray-600 mb-1">
                    Your Stake
                  </label>
                  <p className="font-jakarta text-[0.972vw] text-[#717680]">
                    {tokenInfo.userStake}
                  </p>
                </div>
                <div>
                  <label className="block text-[0.833vw] text-gray-600 mb-1">
                    Total Staked
                  </label>
                  <p className="font-jakarta text-[0.972vw] text-[#717680]">
                    {tokenInfo.totalStaked}
                  </p>
                </div>
                <div>
                  <label className="block text-[0.833vw] text-gray-600 mb-1">
                    Rewards Pool
                  </label>
                  <p className="font-jakarta text-[0.972vw] text-[#717680]">
                    {tokenInfo.rewardsPool}
                  </p>
                </div>
                <div>
                  <label className="block text-[0.833vw] text-gray-600 mb-1">
                    Pending Rewards
                  </label>
                  <p className="font-jakarta text-[0.972vw] text-[#717680]">
                    {tokenInfo.pendingRewards}
                  </p>
                </div>
                <div>
                  <label className="block text-[0.833vw] text-gray-600 mb-1">
                    Minimum Stake
                  </label>
                  <p className="font-jakarta text-[0.972vw] text-[#717680]">
                    {tokenInfo.minStake}
                  </p>
                </div>
              </div>
            </div>

            {/* Tab Tindakan */}
            <div className="mb-6">
              <h3 className="font-jakarta text-[1vw] font-semibold text-gray-800 mb-3">
                Actions
              </h3>
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`px-4 py-2 text-[0.833vw] font-jakarta font-medium ${activeTab === "stake" ? "border-b-2 border-purple-700 text-purple-700" : "text-gray-600"}`}
                  onClick={() => setActiveTab("stake")}
                >
                  Stake
                </button>
                <button
                  className={`px-4 py-2 text-[0.833vw] font-jakarta font-medium ${activeTab === "unstake" ? "border-b-2 border-purple-700 text-purple-700" : "text-gray-600"}`}
                  onClick={() => setActiveTab("unstake")}
                >
                  Unstake
                </button>
                <button
                  className={`px-4 py-2 text-[0.833vw] font-jakarta font-medium ${activeTab === "rewards" ? "border-b-2 border-purple-700 text-purple-700" : "text-gray-600"}`}
                  onClick={() => setActiveTab("rewards")}
                >
                  Rewards
                </button>
              </div>

              {/* Konten Tab */}
              {activeTab === "stake" && (
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <label className="block text-[0.833vw] text-gray-600 mb-1">
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
                    className="w-full font-jakarta text-[0.972vw] text-[#717680] border px-3 py-2 rounded bg-white mb-3"
                    disabled={isLoading}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={stakeForToken}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-[0.833vw] font-jakarta disabled:bg-green-300"
                      disabled={
                        isLoading ||
                        !stakeAmount ||
                        parseFloat(stakeAmount) <= 0
                      }
                    >
                      {isLoading ? "Processing..." : "Stake ETH"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "unstake" && (
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <label className="block text-[0.833vw] text-gray-600 mb-1">
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
                    className="w-full font-jakarta text-[0.972vw] text-[#717680] border px-3 py-2 rounded bg-white mb-3"
                    disabled={isLoading}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={unstakeFromToken}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-[0.833vw] font-jakarta disabled:bg-red-300"
                      disabled={
                        isLoading ||
                        !unstakeAmount ||
                        parseFloat(unstakeAmount) <= 0 ||
                        !tokenInfo ||
                        parseFloat(tokenInfo.userStake) <= 0
                      }
                    >
                      {isLoading ? "Processing..." : "Unstake ETH"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "rewards" && (
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="mb-4">
                    <button
                      onClick={claimTokenRewards}
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 text-[0.833vw] font-jakarta disabled:bg-blue-300"
                      disabled={isLoading || !tokenInfo}
                    >
                      {isLoading ? "Processing..." : "Claim Rewards"}
                    </button>
                  </div>
                  <label className="block text-[0.833vw] text-gray-600 mb-1">
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
                    className="w-full font-jakarta text-[0.972vw] text-[#717680] border px-3 py-2 rounded bg-white mb-3"
                    disabled={isLoading}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={distributeTokenRewards}
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 text-[0.833vw] font-jakarta disabled:bg-blue-300"
                      disabled={
                        isLoading ||
                        !depositRewardAmount ||
                        parseFloat(depositRewardAmount) <= 0
                      }
                    >
                      {isLoading ? "Processing..." : "Distribute Rewards"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Pesan Kesalahan */}
            {errorMessage && (
              <p className="text-red-500 font-jakarta text-[0.833vw] mb-4">
                {errorMessage}
              </p>
            )}
          </>
        ) : (
          <p className="text-center text-[0.972vw] text-gray-500">
            Failed to load token data
          </p>
        )}
      </div>
    </div>
  );
};

export default TokenActionPopup;
