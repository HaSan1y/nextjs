"use client"

import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { CardContent, CardFooter } from "./ui/card"
import { Label } from "./ui/label"
import { useState } from "react"
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Input } from "./ui/input"
import { loginAction, signUpAction } from "@/actions/users"

type Props = {
   type: 'login' | 'signUp'
}

function AuthForm({ type }: Props) {
   const isLoginForm = type === 'login'
   const router = useRouter()
   const { toast } = useToast()

   const [isPending, setIsPending] = useState(false);

   const handleSubmit = async (formData: FormData) => {
      setIsPending(true);
      try {
         const email = formData.get('email') as string
         const password = formData.get('password') as string
         let errorMessage: string | null = null;
         if (isLoginForm) {
            const result = await loginAction(email, password);
            errorMessage = result?.errorMessage || null;
         } else {
            const result = await signUpAction(email, password);
            errorMessage = result?.errorMessage || null;
         }
         //signupaction = actions/users.ts
         if (!errorMessage) {
            // router.push('/')  // redirect to home page, but user can go back to login page using back button
            router.replace(`/?toastType=${type}`);
            // router.refresh()
         } else {
            toast({
               title: "Error",
               description: errorMessage,
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
      } finally {
         setIsPending(false);
      }
   }

   return (
      <form onSubmit={(e) => {
         e.preventDefault();
         const formData = new FormData(e.currentTarget);
         handleSubmit(formData);
      }}>
         <div>
            <CardContent className="grid w-full items-center gap-4">
               <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                     id="email"
                     name="email"
                     placeholder="Enter your email"
                     type="email"
                     required
                     disabled={isPending}
                  />
               </div>
               <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                     id="password"
                     name="password"
                     placeholder="Enter your password"
                     type="password"
                     required
                     disabled={isPending}
                  />
               </div>
            </CardContent>
            <CardFooter className="mt-4 flex flex-col gap-6">
               <Button className="w-full">
                  {isPending ? (
                     <Loader2 className="animate-spin" />
                  ) : isLoginForm ? (
                     "Login"
                  ) : (
                     "Sign Up"
                  )}
               </Button>
               <p className="text-xs">
                  {isLoginForm
                     ? "Don't have an account yet?"
                     : "Already have an account?"}{" "}
                  <Link
                     href={isLoginForm ? "/sign-up" : "/login"}
                     className={`text-blue-500 underline ${isPending ? "pointer-events-none opacity-50" : ""}`}
                  >
                     {isLoginForm ? "Sign Up" : "Login"}
                  </Link>
               </p>
            </CardFooter>
         </div>
      </form>
   )
}

export default AuthForm
