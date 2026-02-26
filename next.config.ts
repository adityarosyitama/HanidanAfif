// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Kamu bisa tambahkan opsi lain di sini nanti
  // misal: reactStrictMode: true,
  // images: { ... },
  
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/index.html",
      },
      // Contoh tambahan jika perlu:
      // {
      //   source: "/old-page",
      //   destination: "/new-page",
      // },
    ];
  },
};

export default nextConfig;