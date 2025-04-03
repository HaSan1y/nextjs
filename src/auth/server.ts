"use server"
import { createServerClient, type CookieOptions } from '../../node_modules/@supabase/ssr';
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js';
// import { User } from '@prisma/client';
// import type { User } from '@supabase/auth-helpers-nextjs';
// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { NextRequest } from 'next/server';


export async function createCookieClient(cookieStore?: ReturnType<typeof cookies>) {
   cookieStore = cookieStore ? Promise.resolve(cookieStore) : cookies();
   // cookieStore = cookieStore || await cookies();

   const client = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

      {
         cookies: {
            async get(name: string) {
               // const store = await cookieStore;
               // return store.get(name)?.value;
               return (await cookieStore).get(name)?.value;
            },
            async remove(name: string, options: CookieOptions) {
               // const store = await cookieStore;
               // store.set(name, '', { ...options, maxAge: 0 })
               (await cookieStore).set(name, '', { ...options, maxAge: 0 });
            },
            // async set(data) { console.log('xxset:', data); },
            async set(name: string, value: string, options: CookieOptions) {
               // const store = await cookieStore;
               // store.set(name, value, options)
               try {
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

export async function getSSession() {
   const supabase = await createCookieClient();
   const { data: { session } } = await supabase.auth.getSession();
   return session;
}

// creates an user object
export async function getUser() {
   // const supabase = createServerComponentClient({ cookies });
   // const { auth } = await createCookieClient;
   const client = await createCookieClient();
   const auth = client.auth;
   // const supabase = createServerComponentClient({ cookies: () => Promise.resolve(cookies()) });
   // const supabase = createServerComponentClient(({ cookies }));
   // const supabase = createServerComponentClient({ cookies: await cookies() });
   // const store = await cookieStore;
   // const session = store?.get('session') ?? null;
   // const { data: { session }, error } = await supabase.auth.getSession();
   const userObject = await auth.getUser();
   if (!userObject) { console.error("Error fetching user on server:plz login",); return null; }

   console.log('userObject retrieved:success');
   return userObject.data.user;
}

export async function createSupabaseClient() {
   return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   );
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

