import { shadows } from "@/styles/utils"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./button"
import { ModeToggle } from "../DarkmodeToggle"
import LogOutButton from "./LogOutButton"
import { getUser } from "@/auth/server"

async function Header() {
   const user = await getUser()
   return (
      <header className="flex items-center justify-between w-full max-w-4xl px-4 py-4 mx-auto text-slate-200 dark:text-slate-200 bg-popover dark:bg-slate-900 border-b border-slate-700 dark:border-slate-700" style={{ boxShadow: shadows.lg }}>
         <Link href="/">Home</Link>
         <Image src="/vercel.svg" alt="Vercel Logo" className="dark:invert" priority width={100} height={24} />
         <h2 className="flex flex-col items-center justify-center text-2xl font-semibold leading-6"><span>Vercel Scan</span></h2>
         <div className="flex gap-4 ">
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
            )}{/** variant button appears pressed; aschild make sure only to pass a single child+no comment+button will act as link**/}
            <ModeToggle />
         </div>
      </header>
   )
}

export default Header