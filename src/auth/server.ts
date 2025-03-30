"use server"
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export async function createCookieClient(cookieStore?: ReturnType<typeof cookies>) {
   cookieStore = cookieStore ? Promise.resolve(cookieStore) : cookies();
   // cookieStore = cookieStore || cookies();
   // cookieStore = cookieStore || await cookies();

   return createServerClient(
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
               (await cookieStore).set(name, value, options);

            },
         },
      }
   );
}

export async function getSession() {
   const supabase = await createCookieClient();
   // const supabase = createServerComponentClient({ cookies: () => Promise.resolve(cookies()) });
   // const supabase = createServerComponentClient(({ cookies }));
   // const supabase = createServerComponentClient({ cookies: await cookies() });
   // const store = await cookieStore;
   // const session = store?.get('session') ?? null;
   const { data: { session } } = await supabase.auth.getSession();
   return session;
}

export async function createSupabaseClient() {
   return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   );
}
