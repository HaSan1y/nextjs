"use client"

import { shadows } from "./../styles/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkmodeToggle";
import LogOutButton from "./ui/LogOutButton";
import { useSession } from "@/providers/SessionProvider";

const Header = () => {
   const { session } = useSession();

   return (
      <header className="bg-popover relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
         style={{
            boxShadow: shadows.lg,
         }}>
         <Link href="./" className="flex items-center gap-2 text-primary">Home
            <Image src="./vercel.svg" alt="Vercel Logo" className="dark:invert"
               priority={true} width={0} height={0}
               style={{ width: 'auto', height: '20px' }} />
            <h2 className="flex flex-col items-center justify-center text-2xl font-semibold leading-6  text-primary">Vercel<span> Scan</span></h2>
         </Link>
         <div className="flex gap-4 items-center justify-end">
            {session ? (
               <LogOutButton />
            ) : (
               <>
                  <Button asChild>
                     <Link href="./sign-up" className="hidden sm:block text-primary">sign-up</Link>
                  </Button>
                  <Button asChild variant={'outline'}>
                     <Link href="./login" className="hidden sm:block text-primary">Login</Link>
                  </Button>
               </>
            )}
         </div>
         <DarkModeToggle />
      </header>
   )
}

export default Header
