"use client"
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarGroup,
   SidebarGroupLabel
} from "../components/ui/sidebar"

import SidebarGroupContent from "../components/SidebarGroupContent"
// import { getSession, getUser } from "@/auth/server";
// import { cookies } from 'next/headers'
import type { Note } from "@prisma/client";

import { useEffect, useState } from 'react';
import { getUser } from "../auth/server"
import Link from "next/link";
// import { prisma } from "@/db/prisma";
// import type { User } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/auth-js';

export default function AppSidebar() {
   const [session, setSession] = useState<User | null>(null);
   const [notes, setNote] = useState<Note[]>([]);
   const [userLoading, setUserLoading] = useState(true);
   const [notesLoading, setNotesLoading] = useState(true);


   // useEffect(() => {
   //    const fetchUser = async () => {
   //       try {
   //       } catch (error) {
   //          console.error("Error fetching user:", error);
   //       } finally {
   //          setUserLoading(false);
   //       }
   //    };
   //    fetchUser();
   // }, []);
   if (userLoading || notesLoading || session !== null) {
      useEffect(() => {
         const fetchNotes = async () => {
            try {
               const fetchedUser = await getUser();
               if (fetchedUser && fetchedUser !== null) {

                  console.log(`fetching notes for user ${fetchedUser.id}`);
                  setSession(fetchedUser);


                  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-all-notes?userId=${fetchedUser.id}`);
                  const data: Note[] = await response.json();
                  const sortedNotes = JSON.parse(JSON.stringify(data));
                  console.log("sortedNotes:", sortedNotes);
                  setNote(sortedNotes.newestNoteId);
                  // console.log("fetcheddd notes", data.text, '..', session?.id);
                  // setNote(data);
               }
            } catch (error) {
               console.error("Error fetching notes:", error);
            } finally {
               setNotesLoading(false);
               setUserLoading(false);
            }
         };
         fetchNotes();
      }, []);
   }

   if (!session || session === null) {
      return (
         <Sidebar>
            <SidebarHeader />
            <SidebarContent>
               <p>Please log in to see your notes.</p>
            </SidebarContent>
            <SidebarFooter />
         </Sidebar>
      );
   }

   if (userLoading || notesLoading) {
      return <div>Loading...</div>; // Or a loading spinner
   }
   // const user = await getUser()
   // const cookieStore = cookies()
   // const supabase = await createClient(cookieStore);
   // const { data: { user }, error } = await supabase.auth.getUser()


   return (
      <Sidebar>
         <SidebarHeader />
         <SidebarContent /*className="custom-scrollbar"*/>
            <SidebarGroup>
               <SidebarGroupLabel className="mb-2 mt-2 text-lg">
                  {session ? (
                     "Your Notes"
                  ) : (
                     <p>
                        <Link href="/login" className="underline">Log in</Link>{" "} to see your notes
                     </p>)}
               </SidebarGroupLabel>
               {session ? <SidebarGroupContent notes={notes} /> : null}
            </SidebarGroup>
         </SidebarContent >
         <SidebarFooter />
      </Sidebar >
   )
}
// export default AppSidebar;
