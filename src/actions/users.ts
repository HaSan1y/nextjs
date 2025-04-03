"use server"

import { createCookieClient } from "../auth/server"
import { prisma } from "../db/prisma"
// import { redirect } from "next/navigation"
// import { handleErrors } from "@/lib/utils"

export const loginAction = async (email: string, password: string) => {
   try {
      if (!email || !password) {
         throw new Error('Email and password are required')
      }
      const { auth } = await createCookieClient()
      const { data, error } = await auth.signInWithPassword({
         email,
         password
      })
      if (error) {
         // console.log("Login response:", data);
         // return console.error("Supabase login error:", error);
         // return { errorMessage: error.message }
         throw new Error('err: ' + error.code || "Login failed");
      }

      if (!data || !data.user) {
         throw new Error("Invalid response from server");
      }

      return { successMessage: 'Logged in successfully' };
   } catch (error) {
      console.error("Error in loginAction:", error);
      if (error instanceof Error) {
         return { errorMessage: error.message }
      }
      return { errorMessage: 'Error validating input:' }
   }
}

export const logOutAction = async () => {
   try {
      const { auth } = await createCookieClient();
      const { error } = await auth.signOut();

      if (error) throw new Error('err: ' + error.code || "Logout failed");
      // return redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
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

      const { auth } = await createCookieClient()
      const { data, error } = await auth.signUp({
         email,
         password
      })
      if (error) throw new Error('err: ' + error.code || "Signup failed");

      const userID = data.user?.id
      if (!userID) {
         throw new Error('Unique constraint failed on the fields: (`email`)')
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
