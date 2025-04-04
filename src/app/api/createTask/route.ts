"use server";
import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
// import type { User } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
   // const requestBody = await request.body
   const { userId, title } = await request.json();
   const generatedId = uuidv4();
   try {
      if (!title || !userId) {
         return NextResponse.json({ error: null }, { status: 400 });
      }

      // const supabase = await createSupabaseClient();
      // await supabase.auth.refreshSession();
      // // const { id } = await prisma.note.create({ data: { authorId: userId, text: "" } });
      // const { data, error } = await supabase.from('Tasks').insert([
      //    {
      //       id: generatedId,
      //       user_Id: userId,
      //       title,
      //       first_name: "Jon",
      //       last_name: "Do",
      //       email: "jon.doe@example.com",
      //       phone: "123-456-789",
      //       createdAt: new Date().toISOString(),
      //       updatedAt: new Date().toISOString(),
      //    },
      // ]);

      // if (error) {
      //    return NextResponse.json({ error: error }, { status: 400 });
      // } else {
      const newTask = await prisma.tasks.create({
         data: {
            id: generatedId,
            user_Id: userId,
            title,
            first_name: "Jon",
            last_name: "Do",
            email: "jon.doe@example.com",
            phone: "123-456-789"
         },
      });
      return NextResponse.json({ data: newTask }, { status: 200 });

   } catch (error) {
      return NextResponse.json({ error: error }, { status: 500 });
   }
}
