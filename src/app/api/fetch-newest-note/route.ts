import { getSession } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   // const { searchParams } = new URL(request.url);
   // const userId = searchParams.get("userId") || "";

   const session = await getSession();
   const userId = session?.user.id;
   if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
   if (!userId) {
      throw new Error("User ID is required");
   }

   const newestNoteId = await prisma.note.findFirst({
      where: { authorId: userId, },
      orderBy: { createdAt: "desc", },
      select: { id: true, },
   });
   if (!newestNoteId) {
      return NextResponse.json({
         newestNoteId: null,
      });
   }

   return NextResponse.json({
      newestNoteId: newestNoteId?.id,
   });
}