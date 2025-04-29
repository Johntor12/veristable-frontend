"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Dropdown from "@/components/Dropdown";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";

// ABI dan Alamat Kontrak
const TokenFactoryABI = [
  "function createToken(string name, string symbol, address tokenOwner) public returns (address)",
  "function getTokensByUser(address user) public view returns (address[])",
  "function addToAVSTokens(address token) public",
  "function removeFromAVSTokens(address token) public",
  "function getUserTokenCount(address user) public view returns (uint256)",
];

const TokenABI = [
  "function mint(address to, uint256 amount) public",
  "function burn(uint256 amount) public",
  "function balanceOf(address account) public view returns (uint256)",
  "function symbol() public view returns (string)",
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function transferOwnership(address newOwner) public",
  "function owner() public view returns (address)",
];

const ReserveABI = [
  "function setReserveBalance(address tokenAddress, uint256 newBalance) external",
  "function getReserveBalance(address tokenAddress) external view returns (uint256)",
  "function getLastUpdateTimestamp() external view returns (uint256)",
];

const VeristableAVSABI = [
  "function underwrite(address token, uint128 amount) external",
  "function withdraw(address token, uint128 amount) external",
  "function claimRewards(address token) external",
  "function depositRewards(address token, uint128 amount) public",
  "function pause() public",
  "function unpause() public",
  "function transferOwnership(address newOwner) public",
  "function paused() public view returns (bool)",
  "function owner() public view returns (address)",
  "function underwritingAmounts(address token, address underwriter) public view returns (uint128)",
  "function totalUnderwriting(address token) public view returns (uint128)",
  "function totalRewards(address token) public view returns (uint128)",
  "function unclaimedRewards(address token, address underwriter) public view returns (uint128)",
];

// Alamat Kontrak di Pharos Network
const factoryAddress = "0x5418fc891317C20f923ccB431d9B040D14987bD8";
const reserveAddress = "0x32e26c6880e652599A20CF8eb672FDd9179114FC";
const veristableAVSAddress = "0x7F3AC11808D1ADd56Abe48603D7ee16cAB970060";

const teams = [
  { label: "Your Team", icon: "/icons/team.png" },
  { label: "Team Alpha", icon: "/icons/team-alpha.png" },
  { label: "Team Beta", icon: "/icons/team-beta.png" },
];

const projects = [{ label: "Project X" }, { label: "Project Y" }];

const chains = [
  { label: "Ethereum Mainnet", icon: "/icons/ethereum.png" },
  { label: "Polygon Mumbai", icon: "/icons/polygon.png" },
  { label: "Binance Smart Chain", icon: "/icons/binance.png" },
];

export default function DeployPage() {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userTokens, setUserTokens] = useState<string[]>([]);
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { address: account } = useAccount();
  const { data: walletClient } = useWalletClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const loadUserTokens = async (
    userAddress: string,
    provider: ethers.BrowserProvider
  ) => {
    try {
      const factory = new ethers.Contract(
        factoryAddress,
        TokenFactoryABI,
        provider
      );
      const tokens = await factory.getTokensByUser(userAddress);
      setUserTokens(tokens);
    } catch (error) {
      console.error("Error loading user tokens:", error);
    }
  };

  const createToken = async () => {
    try {
      if (!walletClient || !account || !tokenName || !tokenSymbol) {
        alert("Please connect your wallet and fill in token name and symbol!");
        return;
      }

      setIsLoading(true);

      // Create provider and signer for ethers v6
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      // Create contract instance
      const factory = new ethers.Contract(
        factoryAddress,
        TokenFactoryABI,
        signer
      );

      // Execute createToken transaction
      const tx = await factory.createToken(tokenName, tokenSymbol, account, {
        gasLimit: 3000000,
      });

      // Wait for transaction confirmation
      await tx.wait();

      // Reload user tokens
      await loadUserTokens(account, provider);

      // Reset form
      setTokenName("");
      setTokenSymbol("");
      alert("Token created successfully!");
    } catch (error: any) {
      console.error("Error creating token:", error);
      alert(
        `Failed to create token: ${
          error.reason || error.message || "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Load user tokens when account or walletClient changes
  useEffect(() => {
    if (account && walletClient) {
      const provider = new ethers.BrowserProvider(walletClient);
      loadUserTokens(account, provider);
    }
  }, [account, walletClient]);

  return (
    <div className="min-h-screen bg-white pt-[6vw] px-4 lg:px-0 font-jakarta ml-[1vw]">
      <div className="w-[90%] mx-auto py-12">
        {/* Back Button */}
        <div
          className="flex items-center gap-[0.83vw] mb-[4.5vw] cursor-pointer"
          onClick={() => router.back()}
        >
          <Image src="/icons/back.png" alt="Back" width={14} height={14} />
          <p className="text-[1.11vw] text-[#000000]">Back</p>
        </div>

        {/* Main Card */}
        <div className="w-[85.33vw] border border-[#D5D7DA] rounded-xl p-[2vw]">
          {/* Header */}
          <div className="flex items-center gap-[3vw] mb-[2vw]">
            <Image
              src="/icons/realestate.png"
              alt="Real Estate"
              width={70}
              height={70}
              className="-translate-x-[-1vw]"
            />
            <div>
              <h2 className="text-[1.53vw] text-[#5200B7] font-semibold">
                Real Estate
              </h2>
              <p className="text-[0.97vw] text-[#535862]">
                Long-term value from physical properties.
              </p>
            </div>
          </div>

          {/* ===== Card 1: Contract Metadata ===== */}
          <div className="w-[73.05vw] border border-[#D5D7DA] rounded-lg p-[2vw]">
            <h3 className="text-[1.25vw] text-[#000000] font-bold mb-[1.5vw]">
              Contract Metadata
            </h3>
            <div className="w-[68.4vw] h-[1px] bg-[#F5F5F5] mb-[2vw]" />

            <div className="flex gap-[2vw]">
              {/* Upload Image */}
              <div className="flex flex-col">
                <label className="text-[#000000] font-medium text-[1.11vw] mb-[0.7vw]">
                  Image
                </label>
                <label className="w-[15vw] h-[14.79vw] border border-[#D5D7DA] rounded-lg flex flex-col justify-center items-center cursor-pointer">
                  {selectedImage ? (
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Selected"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <Image
                        src="/icons/upload.png"
                        alt="Upload"
                        width={30}
                        height={30}
                      />
                      <p className="text-[#717680] text-[0.83vw] font-normal mt-[0.5vw]">
                        Upload File
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Name, Symbol, Description */}
              <div className="flex-1 flex flex-col gap-[2vw]">
                <div className="flex gap-[2vw]">
                  {/* Name */}
                  <div className="flex flex-col">
                    <label className="text-[#000000] font-medium text-[1.11vw] mb-[0.7vw]">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Token Name"
                      className="w-[31.32vw] h-[2.64vw] border border-[#D5D7DA] rounded-md px-[1vw] text-[0.83vw] text-[#717680] placeholder-[#717680]"
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Symbol */}
                  <div className="flex flex-col">
                    <label className="text-[#000000] font-medium text-[1.11vw] mb-[0.7vw]">
                      Symbol
                    </label>
                    <input
                      type="text"
                      placeholder="Token Symbol"
                      className="w-[12vw] h-[2.64vw] border border-[#D5D7DA] rounded-md px-[1vw] text-[0.83vw] text-[#717680] placeholder-[#717680]"
                      value={tokenSymbol}
                      onChange={(e) => setTokenSymbol(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col">
                  <label className="text-[#000000] font-medium text-[1.11vw] mb-[0.7vw]">
                    Description
                  </label>
                  <textarea
                    placeholder="Type here"
                    className="w-[51.6vw] h-[8.75vw] border border-[#D5D7DA] rounded-md px-[1vw] py-[1vwrecommendations. text-[0.83vw] text-[#717680] placeholder-[#717680] resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* ===== End Card 1 ===== */}

          {/* Card 2: Primary Sales */}
          <div className="w-[73.05vw] border border-[#D5D7DA] rounded-lg p-[2vw] mt-[2vw]">
            <h3 className="text-[1.25vw] text-[#000000] font-bold mb-[1vw]">
              Primary Sales
            </h3>
            <div className="w-[68.4vw] h-[1px] bg-[#F5F5F5] mb-[1.5vw]" />
            <div className="flex flex-col gap-[0.7vw]">
              <label className="text-[1.11vw] text-[#000000] font-medium">
                Recipient TRO Wallet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="w-[68.4vw] h-[2.64vw] border border-[#D5D7DA] rounded-md px-[1vw] text-[0.83vw] text-[#717680] placeholder-[#717680]"
              />
              <p className="text-[1.11vw] text-[#535862] font-medium mt-[0.5vw]">
                The wallet address that should receive the revenue from initial
                sales of the assets.
              </p>
            </div>
          </div>

          {/* Card 3: Platform Fees */}
          <div className="w-[73.05vw] border border-[#D5D7DA] rounded-lg p-[2vw] mt-[2vw]">
            <h3 className="text-[1.25vw] text-[#000000] font-bold mb-[1vw]">
              Platform Fees
            </h3>
            <div className="w-[68.4vw] h-[1px] bg-[#F5F5F5] mb-[1.5vw]" />
            <p className="text-[1.11vw] text-[#535862] font-normal leading-relaxed">
              A 2% fee on primary sales supports our mission to make real-world
              assets accessible onchain — funding open infrastructure, ongoing
              development, and verification integrity.{" "}
              <span className="underline cursor-pointer">Read more</span>
            </p>
          </div>

          {/* Card 4: Gasless */}
          <div className="w-[73.05vw] border border-[#D5D7DA] rounded-lg p-[2vw] mt-[2vw]">
            <h3 className="text-[1.25vw] text-[#000000] font-bold mb-[1vw]">
              Gasless
            </h3>
            <div className="w-[68.4vw] h-[1px] bg-[#F5F5F5] mb-[1.5vw]" />
            <div className="flex flex-col gap-[0.7vw]">
              <label className="text-[1.11vw] text-[#000000] font-medium">
                Trusted Forwarders <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="[ ]"
                className="w-[68.4vw] h-[4.93vw] border border-[#D5D7DA] rounded-md px-[1vw] py-[1vw] text-[0.83vw] text-[#717680] placeholder-[#717680] resize-none"
              />
              <p className="text-[1.11vw] text-[#535862] font-medium mt-[0.5vw]">
                Input should be passed in JSON format - Ex. [0x....]
              </p>
            </div>
          </div>

          {/* Card 5: Add to Project */}
          <div className="w-[73.05vw] border border-[#D5D7DA] rounded-lg p-[2vw] mt-[2vw]">
            <h3 className="text-[1.25vw] text-[#000000] font-bold mb-[1vw]">
              Add to Project
            </h3>
            <p className="text-[0.97vw] text-[#535862] font-medium mb-[1.5vw]">
              Save the deployed contract in a project’s contract list on MyRWA
              and VeriStable dashboard.
            </p>
            <div className="w-[68.4vw] h-[1px] bg-[#F5F5F5] mb-[2vw]" />
            <div className="flex items-center gap-[2vw]">
              {/* Team */}
              <div className="flex flex-col">
                <label className="text-[1.11vw] text-[#000000] font-medium mb-[0.7vw]">
                  Team
                </label>
                <Dropdown
                  options={teams}
                  placeholder="Select Team"
                  width="w-[16.18vw]"
                  height="h-[2.64vw]"
                />
              </div>
              <span className="text-[1.25vw] font-semibold">/</span>
              {/* Project */}
              <div className="flex flex-col">
                <label className="text-[1.11vw] text-[#000000] font-medium mb-[0.7vw]">
                  Project
                </label>
                <Dropdown
                  options={projects}
                  placeholder="Select Project"
                  width="w-[16.18vw]"
                  height="h-[2.64vw]"
                />
              </div>
            </div>
          </div>

          {/* Card 6: Chain */}
          <div className="w-[73.05vw] border border-[#D5D7DA] rounded-lg p-[2vw] mt-[2vw]">
            <h3 className="text-[1.25vw] text-[#000000] font-bold mb-[1vw]">
              Chain
            </h3>
            <div className="w-[68.4vw] h-[1px] bg-[#F5F5F5] mb-[1.5vw]" />
            <div className="flex flex-col gap-[0.7vw]">
              <label className="text-[1.11vw] text-[#000000] font-medium">
                Chain <span className="text-red-500">*</span>
              </label>
              <p className="text-[1.11vw] text-[#535862] font-medium">
                Select a network to deploy this contract on.
              </p>
              <Dropdown
                options={chains}
                placeholder="Select Chain"
                width="w-[54vw]"
                height="h-[2.64vw]"
              />
            </div>
          </div>

          <button
            onClick={createToken}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full disabled:bg-green-300 mt-[2vw]"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Create Token"}
          </button>
        </div>
      </div>
    </div>
  );
}
