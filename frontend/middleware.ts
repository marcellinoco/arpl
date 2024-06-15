import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import axios from "axios";

async function isGoogleAccessTokenValid(accessToken: string): Promise<boolean> {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`
    );
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

const authedPages = ["/onboard", "/dashboard"];
const publicPages = ["/", "/auth"];

export async function middleware(request: NextRequest) {
  const accessToken = cookies().get("accessToken")?.value;

  if (
    request.nextUrl.pathname.endsWith(".js") ||
    request.nextUrl.pathname.endsWith(".css")
  ) {
    return NextResponse.next();
  }

  const isAuthPage = authedPages.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!accessToken && isAuthPage) {
    const authUrl = new URL("/auth", request.url).toString();
    return NextResponse.redirect(authUrl);
  }

  const isTokenValid = await isGoogleAccessTokenValid(accessToken ?? "");

  if (!isTokenValid && isAuthPage) {
    const authUrl = new URL("/auth", request.url).toString();
    return NextResponse.redirect(authUrl);
  }

  if (isTokenValid && request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect("/dashboard");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
