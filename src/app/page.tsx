import { getUser } from "@/auth/server";
// import AskAIButton from "@/components/AskAIButton";
// import NewNoteButton from "@/components/NewNoteButton";
// import NoteTextInput from "@/components/NoteTextInput";
// import HomeToast from "@/components/HomeToast";
import { prisma } from "@/db/prisma";

type Props = {
   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function HomePage({ searchParams }: Props) {
   try {
      const noteIdParam = (await searchParams).noteId;
      const user = await getUser();

      if (!user) {
         return <div>User not authenticated. Please log in.</div>;
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

         </div>
      );
   } catch (error) {
      console.error("An error occurred:", error);
      return <div>An unexpected error occurred. Please try again later.</div>;
   }
}

export default HomePage;
