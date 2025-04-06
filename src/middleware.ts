"use server";  //must run on server
// import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from 'next/server';
// import { cookies } from "next/headers";
// import { getUser } from "./auth/server";
// import type { User } from '@supabase/auth-helpers-nextjs';
export async function middleware(request: NextRequest) {
   const authToken = request.cookies.get('auth-token');
   // Optionally validate token here

   if (!authToken && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/sign-up')) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`); // Redirect unauthenticated users
   } else if (authToken && request.nextUrl.pathname.startsWith('/login') || authToken && request.nextUrl.pathname.startsWith('/sign-up')) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`);
   }
   return NextResponse.next();
}
/*
const session: User | null = await getUser();
if (!session || null) {
   const url = new URL("/login", request.nextUrl.origin);
   return NextResponse.redirect(url);
}
//return NextResponse.next();


const cookieStore = await cookies();

let supabaseResponse = NextResponse.next({
   request,
});

const supabase = createServerClient(
   process.env.SUPABASE_URL!,
   process.env.SUPABASE_ANON_KEY!,
   {
      cookies: {
         async getAll() {
            const store = cookieStore; // Await the cookie store
            return store.getAll();
         },
         async setAll(cookiesToSet) {
            const store = cookieStore; // Await the cookie store
            cookiesToSet.forEach(({ name, value }) => {
               store.set(name, value);
            });
            supabaseResponse = NextResponse.next({
               request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
               supabaseResponse.cookies.set(name, value, options),
            );
         },
      },
   }
);

const isAuthRoute =
   request.nextUrl.pathname === "/login" ||
   request.nextUrl.pathname === "/sign-up";

if (isAuthRoute) {
   try {
      const {
         data: { user },
      } = await supabase.auth.getUser();
      if (user) {
         return NextResponse.redirect(
            new URL("/", process.env.NEXT_PUBLIC_BASE_URL)
         );
      }
   } catch (error) {
      console.log("Error:", error);
   }
}

const { searchParams, pathname } = new URL(request.url);

if (!searchParams.get("noteId") && pathname === "/") {
   const {
      data: { user },
   } = await supabase.auth.getUser();

   if (user) {
      try {
         const { newestNoteId } = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-newest-note?userId=${user.id}`
         ).then((res) => res.json());

         if (newestNoteId) {
            const url = request.nextUrl.clone();
            url.searchParams.set("noteId", newestNoteId);
            return NextResponse.redirect(url);
         } else {
            const { noteId } = await fetch(
               `${process.env.NEXT_PUBLIC_BASE_URL}/api/create-new-note?userId=${user.id}`,
               {
                  method: "POST",
                  headers: {
                     "Content-Type": "application/json",
                  },
               }
            ).then((res) => res.json());

            const url = request.nextUrl.clone();
            url.searchParams.set("noteId", noteId);
            return NextResponse.redirect(url);
         }
      } catch (error) {
         console.log("Path error:", error);
      }
   }
}

return supabaseResponse;
}

*/
export const config = {
   matcher: [
      "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
   ],
};
