"use server";
import { getUser } from "../../../auth/server";
import { prisma } from "../../../db/prisma";
import { NextRequest, NextResponse } from "next/server";


// import type { User, Note } from "@prisma/client";
export async function POST(request: NextRequest) {
   const { searchParams } = new URL(request.url);
   const userId = searchParams.get("userId") || "";

   const session = await getUser();
   if (!userId || !session || userId !== session.id || userId === "undefined" || userId === "" || userId === null) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }

   // const userId = user?.id;
   const { id } = await prisma.note.create({
      data: { authorId: userId, text: "" },
   });

   if (!id) {
      return NextResponse.json({ error: "Failed to create a new note", });
   }

   return NextResponse.json({ noteId: id, });
}
