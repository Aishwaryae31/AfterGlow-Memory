import { proxyAuthedRequest } from "@/lib/server/express-proxy";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const body = await request.text();
  return proxyAuthedRequest(`/api/memories/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body,
  });
}

export async function DELETE(_request: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  return proxyAuthedRequest(`/api/memories/${id}`, { method: "DELETE" });
}
