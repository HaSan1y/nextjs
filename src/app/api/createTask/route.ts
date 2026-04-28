
import { prisma } from "../../../../prisma-custom/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/auth/server";

export async function POST(request: NextRequest) {
   const { title } = await request.json();
   
   try {
      const user = await getUser();
      
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
