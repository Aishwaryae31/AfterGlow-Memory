import { proxyAuthedRequest } from "@/lib/server/express-proxy";

export async function GET(request: Request) {
  const { search } = new URL(request.url);
  return proxyAuthedRequest(`/api/memories/on-this-day${search}`, {
    method: "GET",
  });
}
