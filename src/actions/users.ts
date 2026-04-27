"use server"

import { cookies } from "next/headers"
import { createCookieClient } from "../auth/server"
import { prisma } from "../../prisma-custom/prisma"
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

      if (error) { throw new Error('err: ' + error || "Logout failed"); }
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
      if (error) {
         // Handles "User already registered", "Password should be at least 6 characters", etc.
         throw new Error(error.message || "Signup failed due to a Supabase error.");
      }

      if (!data || !data.user || !data.user.id || !data.user.email) {
         console.log("Signup response missing user data:", data);
         throw new Error("Invalid response from server: User data not found after sign up.");
      }
      const userID = data.user.id;
      const userEmail = data.user.email; // Use email from Supabase response

      // Upsert the user in Prisma database.
      // This ensures that if the email exists, its associated Supabase ID is updated.
      // If the email doesn't exist, a new user record is created.
      // This is crucial for re-registration scenarios.
      try {
         await prisma.user.upsert({
            where: { email: userEmail }, // Look for an existing user by email
            update: { id: userID },      // If found, update their id to the new Supabase userID
            create: { id: userID, email: userEmail }, // If not found, create a new user
         });
         console.log(`Successfully created user ${userID} in Prisma DB.`);
         console.log(`[signUpAction] Successfully upserted user ${userID} (${userEmail}) in Prisma DB.`);
      } catch (prismaError: any) {
         // An error here is more serious, as upsert should handle P2002 on email gracefully.
         console.error(`[signUpAction] Error upserting user ${userID} (${userEmail}) in Prisma DB:`, prismaError);
         throw new Error("Failed to record or update user in local database after successful Supabase signup.");
      }
      // Check if a session was returned (i.e., user is auto-logged in, email confirmation might be off)
      if (data.session && data.session.access_token) {
         const accessToken = data.session.access_token;
         (await cookies()).set('auth-token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
         });
         return { successMessage: 'User created and logged in. Please check your email for a verification link if applicable.' };
      } else if (data.user && !data.session) {
         // Email confirmation is pending. User is created in Supabase and Prisma, but not logged in.
         return { successMessage: 'User created. Please check your email to confirm your account.' };
      } else {
         // Fallback for any other unexpected structure of `data`
         console.log("Signup response (unhandled state):", data);
         throw new Error("Invalid or unhandled response from server after sign up." + JSON.stringify(data));
      }
   } catch (error) {
      if (error instanceof Error) {
         if (error.message.includes("User already registered")) { // More specific message
            return { errorMessage: "This email is already registered." };
         }
         return { errorMessage: error.message }
      }
      return { errorMessage: 'Error validating input:' }
   }
}
//Unreachable code
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
