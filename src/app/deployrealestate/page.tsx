"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Dropdown from "@/components/Dropdown";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { createClient } from "@supabase/supabase-js";

// Supabase Client Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// ABI dan Alamat Kontrak
const TokenFactoryABI = [
  "function createToken(string name, string symbol, address tokenOwner) public returns (address)",
  "function getTokensByUser(address user) public view returns (address[])",
  "function addToAVSTokens(address token) public",
  "function removeFromAVSTokens(address token) public",
  "function getUserTokenCount(address user) public view returns (uint256)",
  // Asumsi event (sesuaikan jika nama berbeda)
  "event TokenCreated(address indexed tokenAddress, string name, string symbol, address indexed owner)",
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

// Alamat Kontrak di Pharos Network (NEW)
const factoryAddress = "0x9C34c7d588C2db8f5f4626C5e8C6E51cffFDF9e1";
const reserveAddress = "0x32e26c6880e652599A20CF8eb672FDd9179114FC";
const veristableAVSAddress = "0x9Ec9eb3E56B0B66948dB51ce98A56cA7a5b49Ad7";

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
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();
  const { address: account } = useAccount();
  const { data: walletClient } = useWalletClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
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

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const imageUrls: string[] = [];
    for (const file of files) {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      try {
        console.log(`Uploading image: ${fileName} to bucket 'images'`);
        const { error } = await supabase.storage
          .from("images")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });
        if (error) {
          console.error(`Failed to upload ${fileName}:`, error);
          throw new Error(
            `Failed to upload image ${fileName}: ${error.message}`
          );
        }
        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(fileName);
        if (!urlData.publicUrl) {
          throw new Error(`Failed to retrieve public URL for ${fileName}`);
        }
        console.log(`Public URL for ${fileName}:`, urlData.publicUrl);
        imageUrls.push(urlData.publicUrl);
      } catch (error: any) {
        console.error(`Error processing ${fileName}:`, error);
        throw error;
      }
    }
    return imageUrls;
  };

  const createTokenAndInsert = async () => {
    try {
      if (!walletClient || !account || !tokenName || !tokenSymbol) {
        alert("Please connect your wallet and fill in all required fields!");
        return;
      }

      setIsLoading(true);

      // Upload images to Supabase Storage
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        console.log(
          "Selected images:",
          selectedImages.map((f) => f.name)
        );
        imageUrls = await uploadImages(selectedImages);
        console.log("Uploaded image URLs:", imageUrls);
      }

      // Inisiasi provider dan kontrak
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const factory = new ethers.Contract(
        factoryAddress,
        TokenFactoryABI,
        signer
      );

      // Cek token sebelum pembuatan
      console.log("Checking tokens before creation...");
      const tokensBefore = await factory.getTokensByUser(account);
      console.log("Tokens before:", tokensBefore);

      // Create token on blockchain
      console.log("Creating token with:", {
        tokenName,
        tokenSymbol,
        owner: account,
      });
      const tx = await factory.createToken(tokenName, tokenSymbol, account, {
        gasLimit: 5000000,
      });
      console.log("Transaction hash:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);

      // Coba ambil tokenAddress dari event
      let tokenAddress: string | undefined;
      const parsedLogs = receipt.logs
        .map((log: ethers.Log, index: number) => {
          try {
            const parsed = factory.interface.parseLog(log) as ethers.LogDescription | null;
            console.log(`Parsed log ${index}:`, parsed);
            return parsed;
          } catch (error) {
            console.error(`Failed to parse log ${index}:`, error);
            return null;
          }
        })
        .filter((parsed: ethers.LogDescription | null) => parsed && parsed.name === "TokenCreated");

      if (parsedLogs.length > 0) {
        tokenAddress = parsedLogs[0]?.args.tokenAddress;
        console.log("Token address from event:", tokenAddress);
      }

      // Jika event tidak ditemukan, coba fallback ke getTokensByUser
      if (!tokenAddress) {
        console.log("No TokenCreated event found, trying getTokensByUser...");
        const tokensAfter = await factory.getTokensByUser(account);
        console.log("Tokens after:", tokensAfter);

        // Cari token baru yang tidak ada di tokensBefore
        const newToken = tokensAfter.find(
          (token: string) => !tokensBefore.includes(token)
        );
        if (newToken) {
          tokenAddress = newToken;
          console.log("Token address from getTokensByUser:", tokenAddress);
        }
      }

      // Validasi tokenAddress
      if (!tokenAddress || !ethers.isAddress(tokenAddress)) {
        throw new Error("Failed to retrieve valid token address");
      }

      // Prepare data for Supabase
      const realEstateData = {
        address: tokenAddress,
        owner: account,
        name: tokenName,
        description,
        location,
        image: imageUrls,
      };
      console.log(
        "Data to be sent to Supabase real_estate table:",
        realEstateData
      );

      // Insert into Supabase real_estate table
      const { error } = await supabase
        .from("real_estate")
        .insert([realEstateData]);

      if (error) {
        console.error("Error inserting into real_estate:", error);
        throw new Error(`Failed to save real estate data: ${error.message}`);
      }

      // Reload user tokens
      await loadUserTokens(account, provider);

      // Reset form
      setTokenName("");
      setTokenSymbol("");
      setDescription("");
      setLocation("");
      setSelectedImages([]);
      alert("Token created and real estate data saved successfully!");
    } catch (error: any) {
      console.error("Error during createTokenAndInsert:", error);
      alert(
        `Failed to complete operation: ${
          error.reason || error.message || "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

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
              {/* Upload Images */}
              <div className="flex flex-col">
                <label className="text-[#000000] font-medium text-[1.11vw] mb-[0.7vw]">
                  Images
                </label>
                <label className="w-[15vw] h-[14.79vw] border border-[#D5D7DA] rounded-lg flex flex-col justify-center items-center cursor-pointer">
                  {selectedImages.length > 0 ? (
                    <div className="w-full h-full overflow-auto">
                      {selectedImages.map((img, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(img)}
                          alt={`Selected ${index}`}
                          className="w-full h-auto object-cover rounded-lg mb-1"
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      <Image
                        src="/icons/upload.png"
                        alt="Upload"
                        width={30}
                        height={30}
                      />
                      <p className="text-[#717680] text-[0.83vw] font-normal mt-[0.5vw]">
                        Upload Files
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Form Fields */}
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

                <div className="flex gap-[2vw]">
                  {/* Description */}
                  <div className="flex flex-col">
                    <label className="text-[#000000] font-medium text-[1.11vw] mb-[0.7vw]">
                      Description
                    </label>
                    <textarea
                      placeholder="Property Description"
                      className="w-[20.55vw] h-[8.75vw] border border-[#D5D7DA] rounded-md px-[1vw] py-[1vw] text-[0.83vw] text-[#717680] placeholder-[#717680] resize-none"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Location */}
                  <div className="flex flex-col">
                    <label className="text-[#000000] font-medium text-[1.11vw] mb-[0.7vw]">
                      Location
                    </label>
                    <textarea
                      placeholder="Property Location"
                      className="w-[20.55vw] h-[8.75vw] border border-[#D5D7DA] rounded-md px-[1vw] py-[1vw] text-[0.83vw] text-[#717680] placeholder-[#717680] resize-none"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
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
                disabled={isLoading}
              />
              <p className="text-[1.11vw] text-[#535862] font-medium mt-[1vw]">
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
                disabled={isLoading}
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
            onClick={createTokenAndInsert}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full disabled:bg-green-300 mt-[2vw]"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Create Token and Save"}
          </button>
        </div>
      </div>
    </div>
  );
}