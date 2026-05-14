import { proxyAuthedRequest } from "@/lib/server/express-proxy";

export async function GET() {
  return proxyAuthedRequest("/api/memories/insights", { method: "GET" });
}
