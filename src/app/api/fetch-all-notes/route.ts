
import { prisma } from "../../../../prisma-custom/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Note } from "@prisma/client"
import { getUser } from "@/auth/server";

export async function GET(request: NextRequest) {
   const user = await getUser();
   const userId = user?.id;

   if (!userId) {
      return NextResponse.json({ error: null }, { status: 401 });
   }
   // 24f6c4b1-6f36-488e-b3fd-b08631fcb90f   82ff069a-b043-48e1-b66a-3a14c40c2f61
   try {
      const notes: Note[] =
         await prisma.note.findMany({
            where: { authorId: userId },
            orderBy: { updatedAt: "desc" },
         })

      if (!notes || notes.length === 0) {
         return NextResponse.json({
            notes: null,
         }, { status: 401 });
      }
      return NextResponse.json(
         notes,
         { status: 200 });
   } catch (error) {
      console.error("Error fetching notes:", error);
      return NextResponse.json({ notes: null }, { status: 500 });
   }
}
