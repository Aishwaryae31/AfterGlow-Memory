import { proxyAuthedRequest } from "@/lib/server/express-proxy";

export async function POST(request: Request) {
  const body = await request.text();
  return proxyAuthedRequest("/api/memories/text", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
}
