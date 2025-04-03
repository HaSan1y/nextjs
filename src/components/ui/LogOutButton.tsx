"use client"

import { Button } from './button'
import { Loader2 } from 'lucide-react'
import { useToast } from '../../hooks/use-toast'
import { useRouter } from 'next/navigation'
import { logOutAction } from '../../actions/users'
import { useTransition } from "react";

function LogOutButton() {
   const { toast } = useToast()
   const router = useRouter()
   const [isPending, startTransition] = useTransition();

   const handleClick = () => {
      startTransition(async () => {
         try {
            const { errorMessage, successMessage } = await logOutAction();
            if (!errorMessage) {
               toast({
                  title: "Logged out",
                  description: "You have been logged out successfully",
                  variant: "success",
               });
               return router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
            } else {
               toast({
                  title: "Error",
                  description: "An unexpected error occurred. Please try again.",
                  variant: "destructive",
               });
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
   return (
      <Button variant="outline" onClick={handleClick} disabled={isPending} className="hidden sm:block w-24">
         {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
         ) : (
            <span>Log out</span>
         )}
      </Button>
   );
}

export default LogOutButton