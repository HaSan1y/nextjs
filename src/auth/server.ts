"use server"
import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from '../../node_modules/@supabase/ssr';
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js';
// import { User } from '@prisma/client';
// import type { User } from '@supabase/auth-helpers-nextjs';
// import type { User } from '@supabase/auth-js';
// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { NextRequest } from 'next/server';

export async function createCookieClient(cookieStore?: ReturnType<typeof cookies>) {
   // headers: {
   // "Access-Control-Allow-Credentials": "true",
   //  },
   cookieStore = cookieStore ? Promise.resolve(cookieStore) : cookies();
   // cookieStore = cookieStore || await cookies();

   const client = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

      {
         cookies: {
            async get(name: string) {

               // return store.get(name)?.value;
               const value = (await cookieStore).get(name)?.value;
               // console.log(`Cookie get: ${name} = ${value}`);
               return value || null;
            },
            // const fragments = [];
            // let index = 0;
            // let fragment;
            // do {
            //    fragment = (await cookieStore).get(`${name}.${index}`)?.value;
            //    if (fragment) {
            //       fragments.push(fragment);
            //    }
            //    index++;
            // } while (fragment);

            // const combinedValue = fragments.join("");
            // console.log(`Reconstructed cookie: ${name} = ${combinedValue}`);
            // return combinedValue || (await cookieStore).get(name)?.value;
            async remove(name: string, options: CookieOptions) {
               const defaultOptions: CookieOptions = {
                  ...options,
                  maxAge: 0,
                  path: '/', // Ensure the path is '/' to remove the cookie globally
                  // If your cookie has domain or SameSite set, make sure to add those as well
                  domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || '', // Set if using a specific domain
                  sameSite: 'lax', // Or 'Strict' based on how the cookie was set
                  secure: process.env.NODE_ENV === 'production', // Ensure it's secure in production
               };
               (await cookieStore).set(name, '', { ...options, maxAge: 0 });
            },
            // async set(data) { console.log('xxset:', data); },
            async set(name: string, value: string, options: CookieOptions) {

               // store.set(name, value, options)
               try {
                  // console.log(`Cookie set: ${name} = ${value}`);
                  (await cookieStore).set(name, value, options);
               } catch {
                  console.error('Error setting cookie:');
               }
            },
         },
      }
   );
   return client;
}

export async function getSession() {
   const supabase = await createCookieClient();
   const { data: { user }, error } = await supabase.auth.getUser();
   console.log("Session retrieved:", user);
   console.log("Session error:", error);
   return user;
}

// creates an user object
export async function getUser() {
   const client = await createCookieClient();
   const auth = client.auth;
   const userObject = await auth.getUser();
   if (!userObject) { console.error("Error fetching user on server:plz login",); return null; }
   // const supabase = createServerComponentClient({ cookies });
   // const { auth } = await createCookieClient;
   // const supabase = createServerComponentClient({ cookies: () => Promise.resolve(cookies()) });
   // const supabase = createServerComponentClient({ cookies: await cookies() });
   // const store = await cookieStore;
   // const session = store?.get('session') ?? null;
   // const { data: { session }, error } = await supabase.auth.getSession();

   console.log('userObject retrieved:success');
   return userObject.data.user;
}

export async function createSupabaseClient() {
   return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      global: {
         headers: {
            "Access-Control-Allow-Credentials": "true",
            // "Custom-Header": "MyCustomValue",
         },
      },
   }
   );
}


export async function DELETE(/*request: Request*/) {
   const response = NextResponse.json({ message: "All cookies cleared" });

   // List of cookies to delete
   const cookiesToDelete = [
      "sb-{project-ref}-auth-token",
      "sb-{project-ref}-auth-token.0",
      "sb-{project-ref}-auth-token.1",
      "sb-{project-ref}-auth-token.2",
      "sb-{project-ref}-auth-token.3",
      "sb-{project-ref}-auth-token.4",
      "sb-{project-ref}-auth-token.5",
      // Add other cookies if needed
   ];

   cookiesToDelete.forEach((cookieName) => {
      response.cookies.set(cookieName, "", {
         path: "/",
         maxAge: 0, // Deletes the cookie
      });
   });

   return response;
}

// export async function handler(req: NextRequest | NextApiRequest, res: NextApiResponse) {
//    const supabase = createServerClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//       {
//          cookies: {
//             async get(name: string) {
//                return (req.cookies )[name] || null;
//             },
//             async set(name: string, value: string, options?: CookieOptions) {
//                const cookieString = `${name}=${value}; Path=${options?.path || '/'}; HttpOnly`;
//                res.setHeader('Set-Cookie', cookieString);
//             },
//          },
//       }
//    );

//    const { event, session } = req.body;

//    if (event === 'SIGNED_IN') {
//       const { access_token, refresh_token } = session;
//       if (access_token && refresh_token) {
//          res.setHeader('Set-Cookie', [
//             `access_token=${access_token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
//             `refresh_token=${refresh_token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
//          ]);
//       }
//       res.status(200).json({ message: 'Signed in successfully' });
//    } else if (event === 'SIGNED_OUT') {
//       res.setHeader('Set-Cookie', [
//          `access_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
//          `refresh_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
//       ]); // Clears cookies
//       res.status(200).json({ message: 'Signed out successfully' });
//    } else {
//       res.status(400).json({ message: 'Invalid event' });
//    }
// }

// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";

// export async function createClient() {
//   const cookieStore = await cookies();

//   const client = createServerClient(
//     process.env.SUPABASE_URL!,
//     process.env.SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return cookieStore.getAll();
//         },
//         setAll(cookiesToSet) {
//           try {
//             cookiesToSet.forEach(({ name, value, options }) =>
//               cookieStore.set(name, value, options),
//             );
//           } catch {}
//         },
//       },
//     },
//   );

//   return client;
// }

// export async function getUser() {
//   const { auth } = await createClient();

//   const userObject = await auth.getUser();

//   if (userObject.error) {
//     console.error(userObject.error);
//     return null;
//   }

//   return userObject.data.user;
// }