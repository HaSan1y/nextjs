"use client"

// import { useSession } from "@/providers/SessionProvider";
import { shadows } from "./../styles/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkmodeToggle";
import LogOutButton from "./ui/LogOutButton";
import type { User } from '@supabase/auth-js';
// import type { User } from '@supabase/auth-helpers-nextjs';
// import type { User } from "@prisma/client";
import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { getUser } from "./../auth/server";

// import { useSession } from "@/providers/SessionProvider";
// interface HeaderProps { session: Session; }
const Header = () => {
   //in your logout function

   // const router = useRouter();

   // const handleLogout = async () => {
   //    try {
   //       await fetch('/api/logout', { method: 'POST' });

   //       router.push('/login');
   //    } catch (error) {
   //       console.error('Logout failed:', error);
   //    }
   // };


   // const Header: React.FC<HeaderProps> = ({ session }) => {
   // function Header({ session }: { session: Session | null }) {
   // console.log(session?.user);
   // const session = Promise.resolve(getSession());
   const [session, setSession] = useState<User>();
   const [loading, setLoading] = useState(true);
   // const router = useRouter();
   // console.log('session...', session);

   // const { session: sessionData } = useSession();
   useEffect(() => {
      async function fetchSession() {
         try {
            const sessionData = await getUser();
            if (sessionData) {
               setSession(sessionData);
            } else {
               console.log("no session:", sessionData);
            }
         } catch (error) {
            console.log("errhd session:", error);
         }
         finally {
            setLoading(false);
            // router.push('/login');

         }
      }
      fetchSession();
   }, []);

   // useEffect(() => {
   //    if (!session) {
   //       // Redirect to login if no session is found
   //       const absoluteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
   //       router.push(absoluteUrl);
   //    }
   // }, []);

   // useEffect(() => {
   //    if (!router) return;
   //    if (session === null) {
   //       // If session is still null, navigate to the login page
   //       setLoading(false);
   //       const absoluteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
   //       router?.push(absoluteUrl); // Redirect to the login page
   //    } else {
   //       setLoading(false); // If session is available, stop loading
   //    }
   // }, [router]);


   if (loading) {
      // You can show a loading spinner or skeleton here
      return <div>Loading...</div>;
   }
   // priority={false} // lazy load image on viewport
   return (
      <header className="bg-popover relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
         style={{
            boxShadow: shadows.lg,
         }}>

         <Link href="./" className="flex items-center gap-2">Home
            <Image src="./vercel.svg" alt="Vercel Logo" className="dark:invert"
               priority={true} width={0} height={0}
               style={{ width: 'auto', height: '20px' }} />
            <h2 className="flex flex-col items-center justify-center text-2xl font-semibold leading-6">Vercel<span> Scan</span></h2>
         </Link>
         <div className="flex gap-4 items-center justify-end">
            {session ? (
               <LogOutButton />
            ) : (
               <>
                  <Button asChild>
                     <Link href="./sign-up" className="hidden sm:block">sign-up</Link>
                  </Button>
                  <Button asChild variant={'outline'}>
                     <Link href="./login">Login</Link>
                  </Button>
               </>
            )}
         </div>
         <DarkModeToggle />
      </header>
   )
}

export default Header