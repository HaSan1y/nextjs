
import { getUser } from "@/auth/server";
// import AskAIButton from "@/components/AskAIButton";
// import NewNoteButton from "@/components/NewNoteButton";
// import NoteTextInput from "@/components/NoteTextInput";
// import HomeToast from "@/components/HomeToast";
import { prisma } from "@/db/prisma";

type Props = {
   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HomePage({ searchParams }: Props) {
   try {
      const noteIdParam = (await searchParams).noteId;
      const user = await getUser();

      if (!user) {
         console.log("User not authenticated or session expired");
         return <div>User not authenticated or session expired. Please log in or confirm your email.</div>
      }

      const noteId = Array.isArray(noteIdParam)
         ? noteIdParam![0]
         : noteIdParam || "";

      const note = await prisma.note.findUnique({
         where: { id: noteId, authorId: user.id },
      });

      if (!note) {
         console.error("Note not found or invalid note ID");
         return <div>Note not found or invalid note ID.</div>;
      }

      return (
         <div className="flex h-full flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
            <p className="text-lg">Here are your notes:</p>
            {/* <NewNoteButton /> */}
            {/* <NoteTextInput /> */}
            {/* <AskAIButton /> */}
            {/* <HomeToast /> */}
            Note content: {note.text}
            {/* <Page2 /> */}
         </div>
      );
   } catch (error) {
      console.log("An error occurred:", error);
      return <div>An unexpected error occurred. Please try again later.</div>;
   }
}

