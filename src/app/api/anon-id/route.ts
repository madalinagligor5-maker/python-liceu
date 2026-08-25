import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  let anonId = cookieStore.get("academia_anon_id")?.value;

  if (!anonId) {
    anonId = crypto.randomUUID();
    const response = NextResponse.json({ anonId });
    response.cookies.set("academia_anon_id", anonId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60, // 1 an
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ anonId });
}
