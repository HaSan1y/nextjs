"use server";
// import { getUser } from "../../../auth/server";
import { prisma } from "../../../db/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Note } from "@prisma/client";

export async function GET(request: NextRequest) {
   const { searchParams } = new URL(request.url);
   const userId: string | null = searchParams.get("userId");
   const noteId: string = searchParams.get("noteId") || '';
   // const user = await getUser();Get the current user (e.g., from session)

   if (!userId || userId === "null") {
      return NextResponse.json({ error: "User ID, or Note ID is required" });
   }


   try {
      // Fetch the note by its ID and check if the user is the author
      const note: Note | null = await prisma.note.findUnique({
         where: { id: noteId, authorId: userId },
      });

      if (!note) {
         return NextResponse.json({ notes: 'null' });
      }

      // const plainNote = JSON.parse(JSON.stringify(note));
      return NextResponse.json({ note: note });
   } catch (error) {
      console.error("Error fetching note:", error);
      return NextResponse.json({ note: 'null' });
   }
}