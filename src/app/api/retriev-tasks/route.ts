
import { prisma } from "../../../../prisma-custom/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/auth/server";

export async function GET(request: NextRequest) {
   const user = await getUser();
   const userId = user?.id;

   if (!userId) { return NextResponse.json({ tasks: null }, { status: 400 }); }
   try {
      const tasks = await prisma.tasks.findMany({
         select: { id: true, title: true, },
         where: { user_Id: userId },
      });

      if (!tasks || tasks.length === 0) {
         return NextResponse.json({ tasks: null }, { status: 500 });
      }
      const serializedTasks = tasks.map(task => ({
         id: task.id.toString(),
         title: task.title.toString(),
      }));

      return NextResponse.json(serializedTasks, { status: 200 });
   } catch (error) {
      console.error('Err:', error)  //err for client
      return NextResponse.json({ tasks: error }, { status: 500 });
   }
}
