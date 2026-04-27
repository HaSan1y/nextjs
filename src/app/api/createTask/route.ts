"use server";
import { prisma } from "../../../../prisma-custom/prisma";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
// import type { User } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
   // const requestBody = await request.body
   const { title } = await request.json();
   const cookieStore = await cookies();
   const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
         cookies: {
            getAll() {
               return cookieStore.getAll();
            },
            setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
               cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: any }) => {
                  cookieStore.set(name, value, options);
               });
            },
         },
      }
   );
   try {
      const {
         data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const userId = user.id; // 🔥 single source of truth
      if (!title || !userId) {
         return NextResponse.json({ error: null }, { status: 400 });
      }
      console.log("AUTH USER:", user?.email);
      await prisma.user.upsert({
         where: { id: userId },
         update: {},
         create: {
            id: userId,
            email: user.email!,
         },
      });
      // id: generatedId,
      const newTask = await prisma.tasks.create({
         data: {
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
      console.error('Task add err:', error); //err for client
      return NextResponse.json({ error: error }, { status: 500 });
   }
}
