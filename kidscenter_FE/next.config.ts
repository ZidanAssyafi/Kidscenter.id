import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.1.4",    // IP Mac (server) — wajib ada agar mobile bisa akses
    "192.168.1.17",   // IP perangkat mobile (jika dibutuhkan)
    "192.168.1.2",
    "192.168.1.3",
    "192.168.1.5",
    "192.168.1.6",
    "192.168.1.7",
    "192.168.1.8",
    "192.168.1.9",
    "192.168.1.10",
    "192.168.1.100",
    "192.168.1.101",
    "192.168.1.102",
  ],
};

export default nextConfig;