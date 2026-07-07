import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // iPhone など LAN 端末から dev サーバー（http://192.168.10.101:8100）へアクセスした際に
  // Next.js 16 が /_next/* のクライアントJSを既定でブロックするのを許可する。
  // これがないと LAN 端末でハイドレーションされず、絞り込みなどの操作が一切効かない。
  allowedDevOrigins: ['192.168.10.101'],
}

export default nextConfig
