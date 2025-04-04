import { NextResponse } from "next/server";
export async function POST(/*request: Request*/) {
   const response = NextResponse.json({ message: "Logged out successfully" });

   // Clear Supabase session cookies
   response.cookies.set("sb-{project-ref}-auth-token", "", {
      path: "/",
      maxAge: 0,
   });
   response.cookies.set("sb-{project-ref}-auth-token.0", "", {
      path: "/",
      maxAge: 0,
   });
   response.cookies.set("sb-{project-ref}-auth-token.1", "", {
      path: "/",
      maxAge: 0,
   });
   response.cookies.set("sb-{project-ref}-auth-token.2", "", {
      path: "/",
      maxAge: 0,
   });
   response.cookies.set("sb-{project-ref}-auth-token.3", "", {
      path: "/",
      maxAge: 0,
   });
   response.cookies.set("sb-{project-ref}-auth-token.4", "", {
      path: "/",
      maxAge: 0,
   });

   return response;
}