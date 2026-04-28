
import { prisma } from "../../../../prisma-custom/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/auth/server";

export async function POST(request: NextRequest) {
   const user = await getUser();
   const userId = user?.id;

   if (!userId) {
      return NextResponse.json({ error: null }, { status: 401 });
   }

   // const userId = user?.id;
   const { id } = await prisma.note.create({ data: { authorId: userId, text: "" } });

   if (!id) {
      console.error("Error creating note");
      return NextResponse.json({ error: null }, { status: 500 });
   }

   return NextResponse.json(id, { status: 200 });
}
