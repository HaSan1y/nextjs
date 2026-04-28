import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
   const response = NextResponse.next();

   const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
         cookies: {
            getAll() {
               return request.cookies.getAll();
            },
            setAll(cookiesToSet: Array<{ name: string; value: string; options?: Parameters<typeof response.cookies.set>[2] }>) {
               cookiesToSet.forEach(({ name, value, options }) => {
                  response.cookies.set(name, value, options);
               });
            },
         },
      }
   );

   const {
      data: { user },
   } = await supabase.auth.getUser();

   const isPublicPath = ["/login", "/sign-up"].some(path => request.nextUrl.pathname.startsWith(path));
   const isApi = request.nextUrl.pathname.startsWith("/api");

   if (!user && !isPublicPath && !isApi) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
   }

   // Optional: redirect logged-in users away from auth pages
   if (user && isPublicPath) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = "/";
      return NextResponse.redirect(homeUrl);
   }

   return response;
}
export const config = {
   matcher: [
      '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
   ],
};
