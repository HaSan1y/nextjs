"use server"

// const { createClient } = await import('@/utils/supabase-server')
import { createClient } from "@/auth/server"
import { handleErrors } from "@/lib/utils"

export const loginAction = async (email: string, password: string) => {
   try {
      if (!email || !password) {
         throw new Error('Email and password are required')
      }
      const { auth } = await createClient()
      const { error } = await auth.signInWithPassword({
         email,
         password
      })
      if (error) throw error

      // const userID = data.user?.id
      // if (!userID) {
      //    throw new Error('User ID not found')
      // }
      return { errorMessage: null };
   } catch (error) {
      console.error('Error validating input:', error)
      return { errorMessage: 'Email and password are required' }
   }
}

export const logOutAction = async () => {
   try {
      const { auth } = await createClient();

      const { error } = await auth.signOut();
      if (error) throw error;

      return { errorMessage: null };
   } catch (error) {
      console.error('Error :', error)
      return { errorMessage: 'Error logging out' }
   }
};

export const signUpAction = async (email: string, password: string) => {
   try {
      if (!email || !password) {
         throw new Error('signup: Email and password are required')
      }

      const { auth } = await createClient()
      const { data, error } = await auth.signUp({
         email,
         password
      })
      if (error) throw error

      const userID = data.user?.id
      if (!userID) {
         throw new Error('signup: User ID not found')
      }
      return { errorMessage: null };
   } catch (error) {
      console.error('Error signup:', error)
      return { errorMessage: 'Error signup' }
   }
}
