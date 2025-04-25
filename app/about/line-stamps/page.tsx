export default async function Page() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="font-bold">マイスタンプGPT</div>

            <div className="text-gray-400">マイスタンプGPTはAIを使用して人物や動物のスタンプ画像を作成するサービスです。</div>

            <div className="text-gray-400">
              ご利用は以下のURL、またはQRコードからLINE公式アカウントを友だち追加してください
            </div>

            <div className="flex flex-col items-center gap-2">
              <img className="max-w-48 max-h-48" src="https://qr-official.line.me/gs/M_317xnaan_GW.png?oat_content=qr" />

              <a
                href="https://lin.ee/a5Ozffh"
                target="_blank"
                style={{
                  color: "#06c755",
                }}>
                https://lin.ee/a5Ozffh
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="font-bold">お問合せ</div>

            <div className="text-gray-400">mail@a10a.app</div>
          </div>
        </div>
      </div>
    </div>
  );
}
