import { NextResponse } from "next/server";

const BACKEND_BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080";

export async function GET(req, { params }) {
  const filePath = params.path.join("/");
  const remoteUrl = `${BACKEND_BASE}/uploads/tickets/${filePath}`;

  const resp = await fetch(remoteUrl);
  if (!resp.ok) {
    return new NextResponse("Not found", { status: 404 });
  }

  const buffer = await resp.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        resp.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filePath}"`,
    },
  });
}
