"use client";

import React from 'react';
import { IoClose } from "react-icons/io5";
import { useState } from "react";

type TokenPopupProps = {
  type: "Mint" | "Burn" | "Reserve";
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  totalSupply: number;
  symbol: string;
};

// Fungsi untuk mendekode JWT token
const decodeJwtToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Error decoding JWT token:", err);
    return {};
  }
};

const TokenPopup = ({
  type,
  isOpen,
  onClose,
  onSubmit,
  totalSupply,
  symbol,
}: TokenPopupProps) => {
  const [amount, setAmount] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [amountReserve, setAmountReserve] = useState<number | null>(null);

  const handleConnectBank = async () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Langkah 1: Login
      console.log("Sending login request to:", "https://mockup-backend-seven.vercel.app/login");
      console.log("Request body:", { username, password });

      const loginResponse = await fetch("https://mockup-backend-seven.vercel.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Login response status:", loginResponse.status);
      if (!loginResponse.ok) {
        const text = await loginResponse.text();
        throw new Error(`HTTP error! status: ${loginResponse.status}, message: ${text}`);
      }

      const loginData = await loginResponse.json();
      console.log("Login response data:", loginData);

      if (!loginData.token) {
        throw new Error("No token received from login");
      }

      // Simpan token ke localStorage
      localStorage.setItem("jwtToken", loginData.token);

      // Dekode token untuk mendapatkan balance
      const decodedToken = decodeJwtToken(loginData.token);
      const amountReserveFromApi = decodedToken.balance || 0;
      setAmountReserve(amountReserveFromApi);
      setAmount(amountReserveFromApi.toString());
      setIsConnected(true);
      setUsername("");
      setPassword("");

      // Langkah 3: Verifikasi
      const token = loginData.token; // Gunakan nama "token" sesuai dengan yang diharapkan server
      const RWASupply = totalSupply; // Ambil dari Current Reserve Balance

      console.log("Sending verify request to:", "https://veristable-render-cool-frog-1562.fly.dev/verify");
      console.log("Request body:", { token, RWASupply });

      const verifyResponse = await fetch(
        "https://veristable-render-cool-frog-1562.fly.dev/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, RWASupply }),
        }
      );

      console.log("Verify response status:", verifyResponse.status);
      if (!verifyResponse.ok) {
        const text = await verifyResponse.text();
        throw new Error(`Verification failed! status: ${verifyResponse.status}, message: ${text}`);
      }

      const verifyData = await verifyResponse.json();
      console.log("Verify response data:", verifyData);

      if (verifyData.message === true) {
        setSuccessMessage("Success Connect to Bank and True Verify");
        setIsVerified(true);
      } else {
        throw new Error("Verification failed: message is not true");
      }
    } catch (err: any) {
      console.error("Error:", err);
      if (isConnected) {
        // Langkah 1 berhasil, tetapi langkah 3 gagal
        setSuccessMessage("Success to Connect and Verify Failed");
        setIsVerified(false);
      } else {
        // Langkah 1 gagal
        setError(`Failed to connect to bank: ${err.message}`);
        setIsConnected(false);
        setIsVerified(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    if (type === "Reserve" && !isConnected) {
      setError("Please connect to your bank account first");
      return;
    }

    if (type === "Reserve" && !isVerified) {
      setError("Verification failed. Please try connecting again.");
      return;
    }

    onSubmit(amountNum);
    setAmount("");
    setIsConnected(false);
    setIsVerified(false);
    setAmountReserve(null);
    setSuccessMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="absolute bg-white rounded-lg w-[30vw] p-6 relative font-jakarta">
        <button onClick={onClose} className="absolute right-4 top-4 text-xl">
          <IoClose className="text-black" />
        </button>
        <h2 className="text-[1.2vw] font-bold mb-4 text-black">
          {type} Token
        </h2>

        {type === "Reserve" && (
          <div className="mb-6">
            {isConnected ? (
              <p className={`text-[0.972vw] font-semibold ${isVerified ? "text-green-600" : "text-red-500"}`}>
                {successMessage}
              </p>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-[0.833vw] text-gray-600 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-[0.972vw] text-[#717680] border px-3 py-2 rounded bg-white"
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[0.833vw] text-gray-600 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-[0.972vw] text-[#717680] border px-3 py-2 rounded bg-white"
                    disabled={isLoading}
                  />
                </div>
                <div className="w-full flex justify-end mb-4">
                  <button
                    onClick={handleConnectBank}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-[0.833vw] disabled:bg-blue-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "Connecting..." : "Connect to Account Bank"}
                  </button>
                </div>
                {error && (
                  <p className="text-red-500 text-[0.833vw] mb-4">{error}</p>
                )}
              </>
            )}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-[0.833vw] text-gray-600 mb-1">
            {type === "Reserve"
              ? "Current Reserve Balance"
              : "Current Token Supply"}
          </label>
          <p className="w-full text-[0.972vw] text-[#717680] border px-3 py-2 rounded bg-gray-100">
            {totalSupply} {symbol}
          </p>
        </div>
        <div className="mb-6">
          <label className="block text-[0.833vw] text-gray-600 mb-1">
            Amount to {type} <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder={`Enter amount to ${type.toLowerCase()}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-[0.972vw] text-[#717680] border px-3 py-2 rounded bg-white"
            disabled={isLoading}
          />
        </div>
        <div className="w-full flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 text-[0.833vw] disabled:bg-purple-300"
            disabled={isLoading || (type === "Reserve" && !isVerified)}
          >
            {type} Token
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenPopup;