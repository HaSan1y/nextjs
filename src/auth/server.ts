import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
   const cookieStore = await cookies()

   // Create a server's supabase client with newly configured cookie,
   // which could be used to maintain user's session
   const client = createServerClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || '',
      {
         cookies: {
            getAll() {
               return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
               try {
                  cookiesToSet.forEach(({ name, value, options }) =>
                     cookieStore.set(name, value, options)
                  )
               } catch {

               }
            },
         },
      }
   )
   return client
}

export async function getUser() {
   const { auth } = await createClient()
   const userObject = await auth.getUser()
   if (userObject.error) {
      console.log('Error getting user session:', userObject.error)

      return null
   }
   return userObject.data.user || null
}
