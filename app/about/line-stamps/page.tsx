import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";

export default async function Page() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="font-bold">マイスタンプGPT</div>

            <div className="text-gray-600">
              マイスタンプGPTはAIを使用して人物や動物のスタンプ画像を作成するサービスです。
              <br />
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
            <div className="font-bold">特定商取引法に基づく表記</div>

            <Table>
              <TableBody>
                <TableRow>
                  <TableHead className="p-2 text-xs text-gray-400 font-bold">販売業社の名称</TableHead>
                  <TableCell className="p-2 text-xs text-gray-400">マイスタンプGPT</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="p-2 text-xs text-gray-400 font-bold">所在地</TableHead>
                  <TableCell className="p-2 text-xs text-gray-400">請求があったら遅滞なく開示します</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="p-2 text-xs text-gray-400 font-bold">電話番号</TableHead>
                  <TableCell className="p-2 text-xs text-gray-400">請求があったら遅滞なく開示します</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="p-2 text-xs text-gray-400 font-bold">メールアドレス</TableHead>
                  <TableCell className="p-2 text-xs text-gray-400">mail@a10a.app</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="p-2 text-xs text-gray-400 font-bold">運営統括責任者</TableHead>
                  <TableCell className="p-2 text-xs text-gray-400">新垣 克真</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="p-2 text-xs text-gray-400 font-bold">交換および返品<br />（返金ポリシー）</TableHead>
                  <TableCell className="p-2 text-xs text-gray-400">システム不具合によりマイスタンプが提供されない場合、返金いたします。</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="p-2 text-xs text-gray-400 font-bold">引渡時期</TableHead>
                  <TableCell className="p-2 text-xs text-gray-400">注文後、順番にマイスタンプが生成され、提供されます。</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="p-2 text-xs text-gray-400 font-bold">受け付け可能な<br />決済手段</TableHead>
                  <TableCell className="p-2 text-xs text-gray-400">クレジットカード</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="p-2 text-xs text-gray-400 font-bold">決済期間</TableHead>
                  <TableCell className="p-2 text-xs text-gray-400">ただちに処理されます。</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="p-2 text-xs text-gray-400 font-bold">販売価格</TableHead>
                  <TableCell className="p-2 text-xs text-gray-400">¥100</TableCell>
                </TableRow>
              </TableBody>
            </Table>
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
