import { headers } from "next/headers";

export default async function DebugPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const head = await headers();
    const query = await searchParams;

    const allHeaders: Record<string, string> = {};
    head.forEach((value, key) => {
        allHeaders[key] = value;
    });

    return (
        <div className="p-8 font-mono text-xs">
            <h1 className="text-xl font-bold mb-4">Debug Information</h1>

            <section className="mb-8">
                <h2 className="text-lg font-bold mb-2">Request Headers</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                    {JSON.stringify(allHeaders, null, 2)}
                </pre>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-bold mb-2">Search Parameters</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                    {JSON.stringify(query, null, 2)}
                </pre>
            </section>

            <section>
                <h2 className="text-lg font-bold mb-2">Environment (Public)</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                    {JSON.stringify({
                        NEXT_PUBLIC_WHOP_APP_ID: process.env.NEXT_PUBLIC_WHOP_APP_ID,
                        WHOP_APP_ID: process.env.WHOP_APP_ID ? 'HIDDEN (Present)' : 'MISSING',
                        WHOP_API_KEY: process.env.WHOP_API_KEY ? 'HIDDEN (Present)' : 'MISSING',
                        NODE_ENV: process.env.NODE_ENV,
                    }, null, 2)}
                </pre>
            </section>
        </div>
    );
}
