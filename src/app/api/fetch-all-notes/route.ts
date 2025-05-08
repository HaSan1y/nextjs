"use server";
// import { getUser } from "../../../auth/server";
import { prisma } from "../../../db/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Note } from "@prisma/client"
export async function GET(request: NextRequest) {
   const { searchParams } = new URL(request.url);
   const userId = searchParams.get("userId") || "";

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

      /*   if (!notes || notes.length === 0) {
            return NextResponse.json({
               notes: null,
            }, { status: 401 });
         }*/
      return NextResponse.json(
         notes,
         { status: 200 });
   } catch (error) {
      console.error("Error fetching notes:", error);
      return NextResponse.json({ notes: null }, { status: 500 });
   }
}



