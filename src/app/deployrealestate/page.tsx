"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Dropdown from "@/components/Dropdown";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { createClient } from "@supabase/supabase-js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Supabase Client Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Alamat Kontrak di Pharos Network
const factoryAddress = "0x7b1803075FEe77b756aBfC2c450D83e1A934880c";

// Interface untuk TokenFactory
const TokenFactoryABI = [
  "function createToken(string memory name, string memory symbol, address owner) external returns (address)",
  "function getTokensByUser(address user) external view returns (address[])",
];

// Interface untuk event logs
interface Log {
  name: string;
  args: {
    tokenAddress?: string;
  };
}

const teams = [
  { label: "Veri Team", icon: "/icons/team.png" },
  { label: "Stable Team", icon: "/icons/team-alpha.png" },
];
const projects = [{ label: "Project Real Estate" }, { label: "Stablecoin" }];
const chains = [
  { label: "Pharos Mainnet", icon: "/icons/ethereum.png" },
  { label: "Pharos Testnet", icon: "/icons/binance.png" },
  { label: "Pharos Devnet", icon: "/icons/polygon.png" },
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
      return userTokens;
    } catch (error) {
      console.error("Error loading user tokens:", error);
    }
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const imageUrls: string[] = [];
    for (const file of files) {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      try {
        const { error } = await supabase.storage
          .from("images")
          .upload(fileName, file, { cacheControl: "3600", upsert: false });
        if (error) throw new Error(`Upload failed: ${error.message}`);

        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(fileName);
        if (!urlData?.publicUrl) throw new Error("No public URL");

        imageUrls.push(urlData.publicUrl);
      } catch (error) {
        console.error(`Image processing error:`, error);
        throw error;
      }
    }
    return imageUrls;
  };

  const createTokenAndInsert = async () => {
    try {
      if (!walletClient || !account || !tokenName || !tokenSymbol) {
        toast.error(
          "Please connect your wallet and fill in all required fields!"
        );
        return;
      }

      setIsLoading(true);

      // Upload images
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        imageUrls = await uploadImages(selectedImages);
      }

      // Init provider & contract
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const factory = new ethers.Contract(
        factoryAddress,
        TokenFactoryABI,
        signer
      );

      const tokensBefore = await factory.getTokensByUser(account);

      // Create token
      const tx = await factory.createToken(tokenName, tokenSymbol, account, {
        gasLimit: 5000000,
      });
      const receipt = await tx.wait();

      // Get token address from event or fallback
      let tokenAddress: string | undefined;

      const parsedLogs = receipt.logs
        .map((log: { topics: string[]; data: string }): Log | null => {
          try {
            return factory.interface.parseLog(log) as Log;
          } catch {
            return null;
          }
        })
        .filter(
          (log: Log | null): log is Log =>
            log !== null && log.name === "TokenCreated"
        );

      if (parsedLogs.length > 0) {
        tokenAddress = parsedLogs[0]?.args.tokenAddress;
      }

      if (!tokenAddress) {
        const tokensAfter = await factory.getTokensByUser(account);
        tokenAddress = tokensAfter.find(
          (t: string) => !tokensBefore.includes(t)
        );
      }

      if (!tokenAddress || !ethers.isAddress(tokenAddress)) {
        throw new Error("Failed to retrieve valid token address");
      }

      // Insert into Supabase
      const realEstateData = {
        address: tokenAddress,
        owner: account,
        name: tokenName,
        description,
        location,
        image: imageUrls,
      };

      const { error } = await supabase
        .from("real_estate")
        .insert([realEstateData]);
      if (error) throw error;

      // Reset form
      setTokenName("");
      setTokenSymbol("");
      setDescription("");
      setLocation("");
      setSelectedImages([]);
      toast.success("Token created and saved successfully!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error: ${error.message || "Unknown error"}`);
      } else {
        toast.error("An unknown error occurred");
      }
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
    <div className="min-h-screen bg-white pt-16 px-4 font-jakarta">
      <ToastContainer />
      <div className="max-w-6xl mx-auto py-10">
        {/* Back Button */}
        <div
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 cursor-pointer"
        >
          <Image src="/icons/back.png" alt="Back" width={14} height={14} />
          <p className="text-gray-800">Back</p>
        </div>

        {/* Main Card */}
        <div className="border border-gray-300 rounded-xl p-6 shadow-md">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/icons/realestate.png"
              alt="Real Estate"
              width={60}
              height={60}
            />
            <div>
              <h2 className="text-2xl text-[#5200B7] font-semibold">
                Real Estate
              </h2>
              <p className="text-gray-500">
                Long-term value from physical properties.
              </p>
            </div>
          </div>

          {/* Contract Information */}
          <div className="border border-gray-300 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Contract Information
            </h3>
            <hr className="my-4 border-gray-200" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Upload Images */}
              <div className="flex flex-col space-y-2">
                <label className="text-gray-700 font-medium">Images</label>
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition-all">
                  {selectedImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {selectedImages.map((img, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(img)}
                          alt={`Preview ${index}`}
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      <Image
                        src="/icons/upload.png"
                        alt="Upload"
                        width={24}
                        height={24}
                      />
                      <p className="text-gray-500 text-sm mt-2">Upload Files</p>
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
              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-gray-700 font-medium">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Token Name"
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                      disabled={isLoading}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black placeholder-gray-500"
                    />
                  </div>
                  {/* Symbol */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-gray-700 font-medium">Symbol</label>
                    <input
                      type="text"
                      placeholder="Token Symbol"
                      value={tokenSymbol}
                      onChange={(e) => setTokenSymbol(e.target.value)}
                      disabled={isLoading}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Description */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-gray-700 font-medium">
                      Description
                    </label>
                    <textarea
                      placeholder="Property Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={isLoading}
                      rows={5}
                      className="border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 text-black placeholder-gray-500"
                    />
                  </div>
                  {/* Location */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-gray-700 font-medium">
                      Location
                    </label>
                    <textarea
                      placeholder="Property Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={isLoading}
                      rows={5}
                      className="border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 text-black placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Fees */}
          <div className="border border-gray-300 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Platform Fees
            </h3>
            <hr className="my-4 border-gray-200" />
            <p className="text-gray-600">
              A 2% fee on primary sales supports our mission to make real-world
              assets accessible onchain — funding open infrastructure, ongoing
              development, and verification integrity.{" "}
              <span className="underline cursor-pointer">Read more</span>
            </p>
          </div>

          {/* Add to Project */}
          <div className="border border-gray-300 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Add to Project
            </h3>
            <p className="text-gray-600 mb-4">
              Save the deployed contract in a project’s contract list on MyRWA
              and VeriStable dashboard.
            </p>
            <hr className="my-4 border-gray-200" />
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium">Team</label>
                <Dropdown
                  options={teams}
                  placeholder="Select Team"
                  width="w-48"
                  height="h-10"
                />
              </div>
              <span className="text-xl font-semibold">/</span>
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium">Project</label>
                <Dropdown
                  options={projects}
                  placeholder="Select Project"
                  width="w-48"
                  height="h-10"
                />
              </div>
            </div>
          </div>

          {/* Chain Selection */}
          <div className="border border-gray-300 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Chain</h3>
            <hr className="my-4 border-gray-200" />
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 font-medium">
                Chain <span className="text-red-500">*</span>
              </label>
              <p className="text-gray-600">
                Select a network to deploy this contract on.
              </p>
              <Dropdown
                options={chains}
                placeholder="Select Chain"
                width="w-full max-w-md"
                height="h-10"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={createTokenAndInsert}
            disabled={isLoading}
            className="mt-6 bg-green-500 text-white px-6 py-3 rounded-lg w-full hover:bg-green-600 disabled:bg-green-300 transition-colors"
          >
            {isLoading ? "Processing..." : "Create Token and Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
