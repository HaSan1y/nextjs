"use server"
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function createClient() {
   const cookieStore = await cookies();

   const client = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
         cookies: {
            getAll() {
               return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
               try {
                  cookiesToSet.forEach(({ name, value, options }) =>
                     cookieStore.set(name, value, options),
                  );
               } catch { }
            },
         },
      },
   );

   return client;
}

export async function getUser() {
   const { auth } = await createClient();
   const userObject = await auth.getUser();
   if (!userObject || userObject.data.user === null || auth.getSession() === null || userObject.error) {
      console.log('err userget:', userObject.error);
      return null;
   }

   return userObject.data.user;
}
