import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AGENTS.md는 직접 관리하므로 next dev가 내용을 덧붙이지 않게 한다
  agentRules: false,
};

export default nextConfig;
