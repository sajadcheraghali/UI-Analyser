import type { NextConfig } from "next";
import webpack from "webpack";

const nextConfig: NextConfig = {

eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    serverActions: {},
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        mysql: false,
        pg: false,
        sqlite3: false,
        tedious: false,
        oracledb: false,
        "better-sqlite3": false,
        "react-native-sqlite-storage": false,
        "@sap/hana-client": false,
      };
    }

    config.plugins.push(
      new webpack.ContextReplacementPlugin(/typeorm/, (context: any) => {
        for (const dep of context.dependencies || []) {
          if ("critical" in dep) {
            // @ts-ignore
            dep.critical = false;
          }
        }
      })
    );

    // 🚀 هشدارهای Module not found را نادیده بگیر
    config.ignoreWarnings = [
      { message: /Critical dependency: the request of a dependency is an expression/ },
      { module: /typeorm/ },
    ];

    return config;
  },
};

export default nextConfig;
