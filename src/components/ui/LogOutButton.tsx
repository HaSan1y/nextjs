"use client"

import { Button } from './button'
import { Loader2 } from 'lucide-react'
import { useToast } from '../../hooks/use-toast'
import { logOutAction } from '../../actions/users'
import { useTransition } from "react";
// import { useRefresh } from '@/providers/RefreshProvider'
import Link from 'next/link'
// import { createCookieClient } from '@/auth/server'

function LogOutButton() {
   const { toast } = useToast()
   const [isPending, startTransition] = useTransition();
   // const { setRefresh } = useRefresh();


   const handleClick = () => {
      startTransition(async () => {
         try {
            const { success, errorMessage } = await logOutAction();
            if (!errorMessage) {
               toast({
                  title: "Logged out",
                  description: "You have been logged out successfully",
                  variant: "success",
               });
               if (success) {
                  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logout`, { method: 'POST' })

                  if (response.ok) {
                     // Optionally, you can redirect after successful logout
                     window.location.replace(`${process.env.NEXT_PUBLIC_BASE_URL}/login`)
                     // document.cookie = 'auth-token=; Max-Age=0; path=/;'
                     // document.cookie = 'auth-token=; Max-Age=0; path=/; domain=' + window.location.hostname;
                     // document.cookie = 'auth-token=; Max-Age=0; path=/; domain=' + window.location.hostname + '; SameSite=Lax';
                     // document.cookie = 'auth-token=; Max-Age=0; path=/; domain=' + window.location.hostname + '; SameSite=Strict';
                     // const cookieStore = await cookies()
                     // cookieStore.delete('auth-token');
                     // ('auth-token', {
                     //    path: '/',
                     //    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
                     //    sameSite: 'Lax',
                     // });
                     // setRefresh((prev) => !prev);
                     // window.location.replace(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
                     // router.refresh();
                  } else {
                     toast({
                        title: "Error",
                        description: "An unexpected error occurred. Please try again.",
                        variant: "destructive",
                     });
                  }
               }
            } else {
               toast({
                  title: "Error",
                  description: "An unexpected error occurred. Please try again.",
                  variant: "destructive",
               })
            }
         } catch (error) {
            console.error("An unexpected error occurred:", error);
            toast({
               title: "Error",
               description: "An unexpected error occurred. Please try again.",
               variant: "destructive",
            });
         }
      });
   }

   return (<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/login`}>
      <Button variant="outline" onClick={handleClick} disabled={isPending} className="hidden sm:block w-24">
         {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
         ) : (
            <span>Log out</span>
         )}
      </Button></Link>
   );
}

export default LogOutButton