import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// نقطة الرجوع بعد تسجيل الدخول (Magic Link / OAuth) — تبادل الـ code بجلسة فعلية.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${redirectTo}`);
}
