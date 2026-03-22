import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require auth
const PUBLIC_PATHS = [
  "/login",
  "/set-password",
  "/api/auth",
  "/early-access",
  "/_next",
  "/favicon.ico",
];

// Routes investors can access
const INVESTOR_PATHS = [
  "/data-room",
  "/api/data-room",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow static files
  if (pathname.includes(".") && !pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Check for valid session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    if (!pathname.startsWith("/api/")) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Role-based access: investors can only access data room
  const role = token.role as string;
  if (role === "investor") {
    const isAllowed = INVESTOR_PATHS.some((p) => pathname.startsWith(p)) ||
      pathname === "/" ||
      pathname.startsWith("/api/auth");

    if (!isAllowed) {
      if (!pathname.startsWith("/api/")) {
        return NextResponse.redirect(new URL("/data-room", request.url));
      }
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
