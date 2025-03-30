// import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
// import { cookies } from "next/headers";  // Import the cookies function
// import { getSession } from '@/auth/server';

export async function middleware(request: NextRequest) {
   // const session = await getSession();
   // if (!session) {
   //    return NextResponse.redirect('/login');
   // }
   // return NextResponse.next();
   /*
   
      const cookieStore = cookies();  // This should be awaited if necessary
   
      let supabaseResponse = NextResponse.next({
         request,
      });
   
      const supabase = createServerClient(
         process.env.SUPABASE_URL!,
         process.env.SUPABASE_ANON_KEY!,
         {
            cookies: {
               async getAll() {
                  const store = await cookieStore; // Await the cookie store
                  return store.getAll();
               },
               async setAll(cookiesToSet) {
                  const store = await cookieStore; // Await the cookie store
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
   
      return supabaseResponse;*/
}


export const config = {
   matcher: [
      "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
   ],
};

// export async function updateSession(request: NextRequest) {
//    let supabaseResponse = NextResponse.next({
//       request,
//    });

//    const supabase = createServerClient(
//       process.env.SUPABASE_URL!,
//       process.env.SUPABASE_ANON_KEY!,
//       {
//          cookies: {
//             getAll() {
//                return request.cookies.getAll();
//             },
//             setAll(cookiesToSet) {
//                cookiesToSet.forEach(({ name, value }) =>
//                   request.cookies.set(name, value),
//                );
//                supabaseResponse = NextResponse.next({
//                   request,
//                });
//                cookiesToSet.forEach(({ name, value, options }) =>
//                   supabaseResponse.cookies.set(name, value, options),
//                );
//             },
//          },
//       },
//    );

//    const isAuthRoute =
//       request.nextUrl.pathname === "/login" ||
//       request.nextUrl.pathname === "/sign-up";

//    if (isAuthRoute) {
//       try {
//          const {
//             data: { user },
//          } = await supabase.auth.getUser();
//          if (user) {
//             return NextResponse.redirect(
//                new URL("/", process.env.NEXT_PUBLIC_BASE_URL),
//             );
//          }
//       } catch (error) {
//          console.log("erro:", error)
//       }
//    }

//    const { searchParams, pathname } = new URL(request.url);

//    if (!searchParams.get("noteId") && pathname === "/") {
//       const {
//          data: { user },
//       } = await supabase.auth.getUser();

//       if (user) {
//          try {
//             const { newestNoteId } = await fetch(
//                `${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-newest-note?userId=${user.id}`,
//             ).then((res) => res.json());

//             if (newestNoteId) {
//                const url = request.nextUrl.clone();
//                url.searchParams.set("noteId", newestNoteId);
//                return NextResponse.redirect(url);
//             } else {
//                const { noteId } = await fetch(
//                   `${process.env.NEXT_PUBLIC_BASE_URL}/api/create-new-note?userId=${user.id}`,
//                   {
//                      method: "POST",
//                      headers: {
//                         "Content-Type": "application/json",
//                      },
//                   },
//                ).then((res) => res.json());
//                const url = request.nextUrl.clone();
//                url.searchParams.set("noteId", noteId);
//                return NextResponse.redirect(url);
//             }

//          } catch (error) {
//             console.log("path err:", error)
//          }
//       }
//    }

//    return supabaseResponse;
// }