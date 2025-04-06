"use server"

import { cookies } from "next/headers"
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
         throw new Error(error.message || "Login failed");
      }

      if (!data || !data.user) {
         throw new Error("Invalid response from server");
      }
      const accessToken = data.session.access_token;
      (await cookies()).set('auth-token', accessToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         maxAge: 60 * 60 * 24 * 7,
      });

      //window.location.replace(`${process.env.NEXT_PUBLIC_BASE_URL}/`)//window not defined
      // redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`)

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

      if (error) { throw new Error('err: ' + error.code || "Logout failed"); }
      // return redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);

      // const sessionData = await response.json();
      // setIsLoggedIn(!!sessionData.user);
      // router.push('/login');
      // await prisma.$disconnect()
      return { success: true };
      // redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
      // return { successMessage: 'Logged out successfully' };
   } catch (error) {
      console.error("Error in logOutAction:", error);
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
      if (!data || !data.session || !data.session.access_token) {
         throw new Error("Invalid response from server");
      }
      const accessToken = data.session.access_token;
      (await cookies()).set('auth-token', accessToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         maxAge: 60 * 60 * 24 * 7, // 7 days
      });
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

// const handleLogout = async () => {
//    try {
//        await fetch('/api/logout', { method: 'POST' });
//        const response = await fetch('/api/session'); // Fetch current session
//        const sessionData = await response.json();
//        setIsLoggedIn(!!sessionData.user); // Update state based on session
//        router.push('/login');
//    } catch (error) {
//        console.error('Logout failed:', error);
//    }
// };
// useEffect(() => {
//    const fetchSession = async () => {
//        const response = await fetch('/api/session');
//        const sessionData = await response.json();
//        setIsLoggedIn(!!sessionData.user);
//    };
//    fetchSession();
// }, [/* dependency array */]);
