import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.BUFFER_CLIENT_ID;
  const redirectUri = process.env.BUFFER_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/integrations/buffer/callback`;

  if (!clientId) {
    return NextResponse.json(
      { error: "BUFFER_CLIENT_ID is not configured" },
      { status: 500 }
    );
  }

  const authUrl = `https://bufferapp.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;

  return NextResponse.redirect(authUrl);
}
