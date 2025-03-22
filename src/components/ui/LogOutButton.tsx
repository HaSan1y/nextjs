"use client"
// in order to make useroute, usestate and other react hooks; disabled when loading true
import { Button } from './button'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function LogOutButton() {
   const toast = useToast()
   const router = useRouter()/*make sure import router from navigation*/
   const [loading, setLoading] = useState(false)
   const handleClick = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate a delay for the logout process
      // await fetch('/api/auth/logout', { method: 'POST' })
      const errorMessage = null // Replace with actual error message if any
      if (!errorMessage) {
         toast.toast({
            title: 'Logged out',
            description: 'You have been logged out successfully',
            variant: 'success',
         })
         router.push('/')
         // Redirect to the home page or any other page after logout
      } else {
         toast.toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
         })
      }
      setLoading(false)
   }
   return (
      <Button variant="outline" onClick={handleClick} disabled={loading} className="hidden sm:block w-24" asChild>
         {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
         ) : (
            <span>Log out</span>
         )}
         <a href="/api/auth/logout" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25V9m0 0h9m-9 0l3.75 3.75M21 12h-6m6 0l-3.75 3.75" />
            </svg>
            <span>Log out</span>
         </a>
      </Button>
   )
}

export default LogOutButton