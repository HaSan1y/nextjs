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
   const [notes, setNote] = useState<Note[] | undefined>(undefined);
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
   // if (userLoading || notesLoading || session !== null) {
   useEffect(() => {
      const fetchNotes = async () => {
         try {
            const fetchedUser = await getUser();
            if (fetchedUser) {

               console.log(`fetching notes for user ${fetchedUser.id}`);
               setSession(fetchedUser);


               const response = await fetch(`/api/fetch-all-notes?userId=${fetchedUser.id}`);
               if (!response.ok) {
                  throw new Error(`API request failed with status ${response.status}`);
               }
               const data: Note[] = await response.json();
               // const sortedNotes = JSON.parse(JSON.stringify(data));
               // console.log("sortedNotes:", sortedNotes);
               // setNote(sortedNotes.newestNoteId);
               // console.log("fetcheddd notes", data.text, '..', session?.id);
               // setNote(data);
               // Assuming 'data' is the array of notes.
               // The previous line `setNote(sortedNotes.newestNoteId)` was likely causing `notes` to be undefined
               // if `sortedNotes` was an array and `newestNoteId` was not a property of an array.
               console.log("Fetched notes data:", data);
               if (Array.isArray(data)) {
                  setNote(data); // Correctly set the array of notes
               } else {
                  console.error("Fetched notes data is not an array:", data);
                  setNote([]); // Fallback to empty array if data is not as expected
               }
            } else {
               setSession(null);
               setNote([]); // No user, so no notes or empty notes
            }
         } catch (error) {
            console.error("Error fetching notes:", error);
            setNote([]);
         } finally {
            setNotesLoading(false);
            setUserLoading(false);
         }
      };
      fetchNotes();
      // }, [notesLoading, userLoading]);
   }, []);

   // if (!session || session === null) {
   if (userLoading || notesLoading || !session) {
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
// export default AppSidebar;
