import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(request) {
  const token = request.cookies.get("jwt")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET); // proveruva dali tokenot e validen 
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("jwt");
    return response;
  }
}

export const config = {
  matcher: [
    "/courses/:path*",
    "/tutoring/:path*",
    "/project-requests/:path*",
    "/project-applications/:path*",
    "/internships/:path*",
    "/messages/:path*",
    "/notifications/:path*",
    "/profile/:path*",
  ],
};