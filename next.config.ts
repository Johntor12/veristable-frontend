/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ualgztyigchvrtukbxed.supabase.co",
        pathname: "/storage/v1/object/public/images/**", // Sesuaikan dengan path gambar
      },
    ],
  },
};

export default nextConfig;
