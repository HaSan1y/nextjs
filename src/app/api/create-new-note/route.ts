import { getSession } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   // const { searchParams } = new URL(request.url);
   // const userId = searchParams.get("userId") || "";
   const session = await getSession();
   if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }

   const userId = session.user.id;
   const { id } = await prisma.note.create({
      data: { authorId: userId, text: "" },
   });

   if (!id) {
      return NextResponse.json({ error: "Failed to create a new note", });
   }

   return NextResponse.json({ noteId: id, });
}
