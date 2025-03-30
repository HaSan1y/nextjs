
// import { cookies } from 'next/headers' 
import { prisma } from "@/db/prisma";
import NoteTextInput from "@/components/NoteTextInput";
import NewNoteButton from "@/components/NewNoteButton";
import HomeToast from "@/components/HomeToast";
import { createCookieClient, getSession } from "@/auth/server";
import { redirect } from "next/navigation";

type Props = {
   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HomePage({ searchParams }: Props) {

   const session = await getSession()
   if (!session) {
      console.log("unauthenticated, session expired. Redirecting to login..");
      return redirect("/login"); //redirect outside of try, or only client components 
   }
   // const cookieStore = await cookies()
   // const supabase = await createCookieClient(cookieStore);
   // const supabase = await createCookieClient(Promise.resolve(cookieStore));

   // const user = session && 'user' in session ? session.user : undefined;

   // const user = supabase.auth.getUser()
   // if (!user) {
   //    return console.log("unauthenticated, session expired. Redirecting to login..", user);
   // }

   try {
      const noteIdParam = (await searchParams).noteId;
      const noteId = Array.isArray(noteIdParam)
         ? noteIdParam![0]
         : noteIdParam || "";

      const note = await prisma.note.findUnique({
         where: { id: noteId, authorId: session.user.id },
      });

      // if (!note) {
      //    console.log("Note not found or invalid note ID");
      //    return <div>Note not found or invalid note ID.{note}</div>;
      // }

      return (
         <div className="flex h-full flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">Welcome, {session.user.email}</h1>
            <p className="text-lg">Here are your notes:</p>
            <NewNoteButton user={session.user} />
            <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""} />
            {/* <AskAIButton user={session.user} /> */}
            <HomeToast />
            Note content: {note ? note.text : "Note not found or invalid note ID"}

         </div>
      );
   } catch (error) {
      console.log("An error occurred:", error);
      return <div>An unexpected error occurred. Please try again later.</div>;
   }
}
