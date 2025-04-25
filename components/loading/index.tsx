"use client"

import Image from "next/image"

export function LoadingSession() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Image alt="loading session" src="/images/loading-panda.gif" unoptimized width={256} height={256} />

        <div className="text-sm font-bold">ログイン情報を取得しています...</div>
      </div>
    </div>
  )
}

export function LoadingAssets() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Image alt="loading session" src="/images/loading-panda.gif" unoptimized width={256} height={256} />

        <div className="text-sm font-bold">データを読み込んでいます...</div>
      </div>
    </div>
  )
}
