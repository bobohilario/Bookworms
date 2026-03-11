import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Captured at build time — shows exactly when this deployment was built.
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
};

export default nextConfig;
