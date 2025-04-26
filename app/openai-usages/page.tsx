import { listOpenaiUsageCached } from "./_actions/list-openai-usage";
import { OpenaiUsageList } from "./_components/openai-usage-list";

export const dynamic = "force-dynamic";

export default async function Page() {
  const openaiUsages = await listOpenaiUsageCached();

  return (
    <div className="max-w-3xl min-h-dvh mx-auto p-4">
      <div className="flex flex-col gap-4">
        <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
          <OpenaiUsageList openaiUsages={openaiUsages} />
        </div>
      </div>
    </div>
  );
}
