"use client";
// import { useSession } from "@/providers/SessionProvider";

import NoteTextInput from "../components/NoteTextInput";
import NewNoteButton from "../components/NewNoteButton";
import HomeToast from "../components/HomeToast";
import { getUser } from "../auth/server";
import { useEffect, useState, useContext, Suspense } from "react";
// import type { User } from '@supabase/auth-helpers-nextjs';
// import type { User } from '@supabase/auth-js';
import type { User } from "@supabase/supabase-js";
import type { Note } from "@prisma/client";
import { useSearchParams } from "next/navigation";

import { NoteProviderContext } from "../providers/NoteProvider";
import AskAIButton from "@/components/AskAiButton";

// type Props = {
//    searchParams?: {
//       userId?: string;
//       noteId?: string;
//       task?: string;
//       [key: string]: string | string[] | undefined;
//    }
// };

export default function HomePage(/*{ searchParams }: Props*/) {
   // const { refresh, setRefresh } = useRefresh();
   // if (refresh) {
   //    // reload the page
   //    window.location.reload();
   //    setRefresh(false);
   // }

   const searchParams = useSearchParams();
   const [session, setSession] = useState<User | null>(null);
   const [note, setNote] = useState<Note | null>(null);
   const [loading, setLoading] = useState(true);
   // const userId = searchParams?.get("userId");
   // const task = searchParams?.get("task");
   const noteIdParam = searchParams?.get("noteId");
   const noteId = Array.isArray(noteIdParam) ? noteIdParam[0] : noteIdParam || "";

   const { noteText } = useContext(NoteProviderContext);
   //receive note through parentcomponent providername from usecontext
   console.log("noteText:", noteText);

   useEffect(() => {
      const fetchUser = async () => {
         console.log("fetching user");
         try {
            const currentUser: User | null = await getUser();
            if (currentUser) {
               setSession(currentUser);
            } else {
               console.log("unauthenticated, session expired. Redirecting to login..");
               window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
            }

         } catch (error) {
            console.error("Error fetching user:", error);
         }
         finally {
            setLoading(false);
         }
      };
      fetchUser();
   }, []);


   useEffect(() => {
      if (session) {
         const fetchNotes = async () => {
            try {
               const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-unique-notes?userId=${session.id}&noteId=${noteId}`);
               const { note }: { note: Note } = await response.json();
               const dnote = JSON.parse(JSON.stringify(note));
               if (!dnote || dnote === null || dnote === undefined || dnote.text === null || !dnote.text) {
                  console.error("Note not found or invalid note ID");
               } else {
                  console.log(dnote, "serializeduniqnotes");
                  setNote(dnote);
               }
               console.log("fetched notes", dnote);
            } catch (error) {
               console.error("Error fetching notes:", error);
            } finally {

               setTimeout(() => {
                  setLoading(false);
               }, 1000);

            }
         };
         fetchNotes();
      }
   }, []);

   // console.log('user', userId, 'noteId', noteId, 'note', note, 'task', task);
   if (loading) return (<div>Loading...</div>)
   // const searchParams = props.searchParams;

   // const user = getUser()

   // if (!user) {
   //    console.log("unauthenticated, session expired. Redirecting to login..");
   //    return redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
   // }



   // if (!note) return <div>note Loading...</div>;
   // console.log('notes', note);

   // const cookieStore = await cookies()
   // const supabase = await createCookieClient(cookieStore);
   // const supabase = await createCookieClient(Promise.resolve(cookieStore));

   // const user = session && 'user' in session ? session.user : undefined;

   // const user = supabase.auth.getUser()
   // if (!user) {
   //    return console.log("unauthenticated, session expired. Redirecting to login..", user);
   // }
   // const userId = session?.user?.id; // Extract only what you need

   return (
      <div className="flex h-full flex-col items-center gap-4">
         <Suspense>
            <div className="flex w-full max-w-4xl justify-end gap-2">
               <AskAIButton session={session} />
               <NewNoteButton user={session} note={noteText} />
            </div>
            <h1 className="text-2xl font-bold">Welcome, {session?.email}</h1>
            <p className="text-lg">Here are your notes:</p>

            <NoteTextInput noteId={note?.id ?? ""} startingNoteText={note?.text ?? ""} />
            {/* {authState.authenticated ? "Yes" : "No"} */}

            <HomeToast />
         </Suspense>
      </div>
   );
}

