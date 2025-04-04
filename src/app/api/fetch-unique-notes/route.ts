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

   if (!userId || !noteId) {
      return NextResponse.json({ error: null }, { status: 400 });
   }

   try {
      // Fetch the note by its ID and check if the user is the author
      const note: Note | null = await prisma.note.findUnique({
         where: { id: noteId, authorId: userId },
      });

      if (!note) { return NextResponse.json({ error: null }, { status: 401 }); }

      // const plainNote = JSON.parse(JSON.stringify(note));
      return NextResponse.json(note, { status: 200 });
   } catch (error) { return NextResponse.json({ error: error }, { status: 500 }); }
}