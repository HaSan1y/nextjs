import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   const { searchParams } = new URL(request.url);
   const userId = searchParams.get("userId") || "";
   try {
      if (!userId) {
         throw new Error("User ID is required");
      }
   } catch (error) {
      console.error("Error fetching user ID:", error);
      return NextResponse.json({ error: "Error fetching user ID" });
   }

   const newestNoteId = await prisma.note.findFirst({
      where: {
         authorId: userId,
      },
      orderBy: {
         createdAt: "desc",
      },
      select: {
         id: true,
      },
   });

   return NextResponse.json({
      newestNoteId: newestNoteId?.id,
   });
}