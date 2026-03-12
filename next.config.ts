import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/content/smart-image": [
      "./src/lib/integrations/fonts/**/*",
      "./public/fonts/**/*",
    ],
    "/api/content/generate-image-actual": [
      "./src/lib/integrations/fonts/**/*",
      "./public/fonts/**/*",
    ],
    "/api/briefs/refresh": [],
    "/api/content/branded-image": [
      "./src/lib/integrations/fonts/**/*",
      "./public/fonts/**/*",
    ],
  },
};

export default nextConfig;
