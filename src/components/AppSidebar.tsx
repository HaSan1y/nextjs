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
import Link from "next/link";
import { useSession } from "@/providers/SessionProvider";

export default function AppSidebar() {
   const { session } = useSession();
   const [notes, setNote] = useState<Note[] | undefined>(undefined);
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
   // if (userLoading || notesLoading || session !== null) {
   useEffect(() => {
      const fetchNotes = async () => {
         if (!session) {
            setNote([]);
            setNotesLoading(false);
            return;
         }

         try {
            const response = await fetch(`/api/fetch-all-notes`);
            if (!response.ok) {
               throw new Error(`API request failed with status ${response.status}`);
            }

            const data: Note[] = await response.json();
            if (Array.isArray(data)) {
               setNote(data);
            } else {
               console.error("Fetched notes data is not an array:", data);
               setNote([]);
            }
         } catch (error) {
            console.error("Error fetching notes:", error);
            setNote([]);
         } finally {
            setNotesLoading(false);
         }
      };
      fetchNotes();
   }, [session]);

   if (notesLoading || !session) {
      return (
         <Sidebar>
            <SidebarHeader />
            <SidebarContent>
               <p>Loading user information...</p>
            </SidebarContent>
            <SidebarFooter />
         </Sidebar>
      );
   }

   return (
      <Sidebar variant="floating" className="glass-panel border-0 !bg-transparent">
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
               {/* notes can be undefined initially or [] on error/no notes.
                   SidebarGroupContent is designed to handle notes: Note[] | undefined.
               */}
               <SidebarGroupContent notes={notes} />
            </SidebarGroup>
         </SidebarContent >
         <SidebarFooter />
      </Sidebar >
   )
}
