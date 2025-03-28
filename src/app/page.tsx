
import { getUser } from "@/auth/server";
// import AskAIButton from "@/components/AskAIButton";
import { prisma } from "@/db/prisma";
import PageTwo from "../components/PageTwo";
import NoteTextInput from "@/components/NoteTextInput";
import NewNoteButton from "@/components/NewNoteButton";
import HomeToast from "@/components/HomeToast";
import { redirect } from "next/navigation";

// const supabasee = createClient(
//    process.env.SUPABASE_URL!,
//    process.env.SUPABASE_ANON_KEY!
// );

type Props = {
   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HomePage({ searchParams }: Props) {
   try {
      const user = await getUser();
      // const { data: { user: supabaseUser } } = await supabase.auth.getUser();

      if (!user) {
         console.log("User not authenticated or session expired");
         console.log("Redirecting to login...");
         return redirect("/login");

         // return <div>User not authenticated or session expired. Please log in or confirm your email.</div>
      }

      const noteIdParam = (await searchParams).noteId;
      const noteId = Array.isArray(noteIdParam)
         ? noteIdParam![0]
         : noteIdParam || "";

      const note = await prisma.note.findUnique({
         where: { id: noteId, authorId: user.id },
      });

      if (!note) {
         console.log("Note not found or invalid note ID");
         return <div>Note not found or invalid note ID.</div>;
      }

      return (
         <div className="flex h-full flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
            <p className="text-lg">Here are your notes:</p>
            <NewNoteButton user={user} />
            <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""} />
            {/* <AskAIButton user={user} /> */}
            <HomeToast />
            {/* Note content: {note.text} */}
            <PageTwo />
         </div>
      );
   } catch (error) {
      console.log("An error occurred:", error);
      return <div>An unexpected error occurred. Please try again later.</div>;
   }
}
