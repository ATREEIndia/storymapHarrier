import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  images: {
    remotePatterns: [
      
     
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "atree-communication.s3.ap-south-1.amazonaws.com",
      },
    ],
  },

  



  turbopack:{},

  
};

export default nextConfig;
