import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/settings?buffer_error=no_code", request.url));
  }

  const clientId = process.env.BUFFER_CLIENT_ID;
  const clientSecret = process.env.BUFFER_CLIENT_SECRET;
  const redirectUri = process.env.BUFFER_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/integrations/buffer/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/settings?buffer_error=missing_config", request.url));
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch("https://api.bufferapp.com/1/oauth2/token.json", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
        grant_type: "authorization_code",
      }).toString(),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL("/settings?buffer_error=token_exchange_failed", request.url));
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.redirect(new URL("/settings?buffer_error=no_token", request.url));
    }

    // Redirect to settings with the token in a fragment (not query param for security)
    // The frontend will read the fragment and store it in localStorage
    return NextResponse.redirect(
      new URL(`/settings?buffer_token=${accessToken}`, request.url)
    );
  } catch {
    return NextResponse.redirect(new URL("/settings?buffer_error=network", request.url));
  }
}
