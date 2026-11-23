import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 에이전트 규칙은 CLAUDE.md 하나로 관리하므로 next dev의 AGENTS.md 자동 생성을 끈다
  agentRules: false,
};

export default nextConfig;
