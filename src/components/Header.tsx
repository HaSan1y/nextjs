"use client"

import { shadows } from "@/styles/utils"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import DarkModeToggle from "./DarkmodeToggle"
import LogOutButton from "./ui/LogOutButton"

function Header({ user }: { user: { email: string } | null }) {

   return (
      <header className="flex items-center justify-between w-full max-w-4xl px-4 py-4 mx-auto text-slate-200 dark:text-slate-200 bg-popover dark:bg-slate-900 border-b border-slate-700 dark:border-slate-700" style={{ boxShadow: shadows.lg }}>

         <Link href="/">Home
            <Image src="/vercel.svg" alt="Vercel Logo" className="dark:invert"
               priority={true} width={0} height={0}
               style={{ width: 'auto', height: '20px' }} />

            <h2 className="flex flex-col items-center justify-center text-2xl font-semibold leading-6">Vercel<span> Scan</span></h2></Link>
         <div className="flex gap-4 items-center justify-end">
            {user ? (
               <LogOutButton />
            ) : (
               <>
                  <Button asChild>
                     <Link href="/sign-up" className="hidden sm:block">sign-up</Link>
                  </Button>
                  <Button asChild variant={'outline'}>
                     <Link href="/login">Login</Link>
                  </Button>
               </>
            )}
            <DarkModeToggle />
         </div>
      </header>
   )
}

export default Header