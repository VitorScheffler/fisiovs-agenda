import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ['192.168.0.105'],
    output: "standalone",
};

export default nextConfig;
