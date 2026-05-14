import { proxyAuthedRequest } from "@/lib/server/express-proxy";

export async function GET(request: Request) {
  const { search } = new URL(request.url);
  return proxyAuthedRequest(`/api/memories${search}`, { method: "GET" });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  return proxyAuthedRequest("/api/memories", { method: "POST", body: formData });
}
