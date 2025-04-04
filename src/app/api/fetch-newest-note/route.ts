"use server";
// import { getUser } from "../../../auth/server";
import { prisma } from "../../../db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   const { searchParams } = new URL(request.url);
   const userId = searchParams.get("userId") || "";

   // const user = await getUser();
   // const userId = user?.id;
   if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }

   const newestNoteId = await prisma.note.findFirst({
      where: { authorId: userId, },
      orderBy: { createdAt: "desc", },
      select: { id: true, },
   });
   if (!newestNoteId) {
      return NextResponse.json({ newestNoteId: "" }, { status: 401 });
   }
   return NextResponse.json({ newestNoteId: newestNoteId?.id, }, { status: 200 });
}