"use server";
import { prisma } from "../../../db/prisma";
import { NextRequest, NextResponse } from "next/server";


// import type { User, Note } from "@prisma/client";
export async function POST(request: NextRequest) {
   const { searchParams } = new URL(request.url);
   const userId = searchParams.get("userId");

   // const session = await getUser();
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
