"use client"

import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { CardContent, CardFooter } from "./ui/card"
import { Label } from "./ui/label"
import { useTransition } from "react"
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Input } from "./ui/input"
import { loginAction, signUpAction } from "@/actions/users"
// import { loginAction, signUpAction } from "@/actions/users";

type Props = {
   type: 'login' | 'signUp'
}

function AuthForm({ type }: Props) {
   const isLoginForm = type === 'login'
   const router = useRouter()
   const { toast } = useToast()

   const [isPending, startTransition] = useTransition()
   const isDisabled = isPending ? true : false
   const handleSubmit = async (formData: FormData) => {
      startTransition(async () => {
         const email = formData.get('email') as string
         const password = formData.get('password') as string

         // try {
         //    if (isLoginForm) {
         //       const { error } = await supabase.auth.signIn({ email, password })
         //       if (error) throw error
         //       toast({
         //          title: 'Login successful',
         //          description: 'You have successfully logged in.',
         //          variant: 'default'
         //       })
         //       router.refresh()
         //    } else {
         //       const { error } = await supabase.auth.signUp({ email, password })
         //       if (error) throw error
         //       toast({
         //          title: 'Registration successful',
         //          description: 'You have successfully registered.',
         //          variant: 'default'
         //       })
         //    }
         // } catch (error) {
         //    console.error(error)
         // }
         let errorMessage, title, description;
         if (isLoginForm) {
            errorMessage = (await loginAction(email, password)).errorMessage;
            title = 'Login successful';
            description = 'You have successfully logged in.';
         } else {
            errorMessage = (await signUpAction(email, password)).errorMessage;
            title = 'Registration successful';
            description = 'You have successfully registered.';
         }
         //signupaction = actions/users.ts
         if (!errorMessage) {
            // router.replace(`/?toastType=${type}`);
            toast({
               title,
               description,
               variant: 'success',
            })
            // router.push('/')  // redirect to home page, but user can go back to login page using back button
            router.replace('/') // redirect to home page, but user can't go back to login page using back button
            // router.refresh()
         } else {
            toast({
               title: "Error",
               description: errorMessage,
               variant: "destructive",
            });
         }
      });
   }

   return (
      <form action={handleSubmit}>
         <CardContent className="grid gap-4 w-full items-center">
            <div className="flex flex-col space-y-1.5">
               <Label htmlFor="email">Email</Label>
               <Input type="email" name="email" id="email" placeholder="Email" required disabled={isDisabled} />
            </div>
            <div className="flex flex-col space-y-1.5">
               <Label htmlFor="password">Password</Label>
               <Input type="password" name="password" id="password" placeholder="password" required disabled={isDisabled} />
            </div>
         </CardContent>
         <CardFooter className="mt-4 flex flex-col gap-6">
            <Button className="w-full">
               {isDisabled ? <Loader2 className="animate-spin" /> : isLoginForm ? 'Login' : 'Sign up'}
            </Button>
            <p className="text-xs">
               {isLoginForm ? 'Don\'t have an account? ' : 'Already have an account? '}
               <Link href={isLoginForm ? '/sign-up' : '/login'} className={`text-blue-500 underline ${isDisabled ? "pointer-events-none opacity-50" : ""}`}>

                  {isLoginForm ? 'Sign Up' : 'Login'}
               </Link>
            </p>

         </CardFooter>
      </form>
   )
}
export default AuthForm