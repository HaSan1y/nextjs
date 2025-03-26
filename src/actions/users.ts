"use server"

import { createClient } from "@/auth/server"
import { prisma } from "@/db/prisma"
// import { handleErrors } from "@/lib/utils"

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

      return { successMessage: 'Logged in successfully' };
   } catch (error) {
      if (error instanceof Error) {
         return { errorMessage: error.message }
      }
      return { errorMessage: 'Error validating input:' }
   }
}

export const logOutAction = async () => {
   try {
      const { auth } = await createClient();

      const { error } = await auth.signOut();
      if (error) throw error;

      return { successMessage: 'Logged out successfully' };
   } catch (error) {
      if (error instanceof Error) {
         return { errorMessage: error.message };
      }
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
      await prisma.user.create({
         data: { id: userID, email }
      })

      return { successMessage: 'User created successfully' };
   } catch (error) {
      if (error instanceof Error) {
         console.error('Error in signupAction:', error)
         return { errorMessage: error.message }
      }
      return { errorMessage: 'Error signup' }
   }
}
