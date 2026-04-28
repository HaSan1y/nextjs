
// import { createSupabaseClient } from "@/auth/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma-custom/prisma";
import { getUser } from "@/auth/server";

export async function GET(request: NextRequest) {
   const { searchParams } = new URL(request.url);
   const id: string | null = searchParams.get("Id") || "";

   const user = await getUser();
   const userId = user?.id;

   if (!userId || !id) { return NextResponse.json({ error: null }, { status: 400 }); }
   try {
      // const supabase = await createSupabaseClient();
      // const { data, error } = await supabase.auth.refreshSession();
      // await supabase.auth.refreshSession();
      // const x = await prisma.tasks.delete({ where: { id: id } });
      // const { error } = await supabase.from('Tasks').delete().eq('id', id).eq('user_Id', userId);
      await prisma.tasks.delete({
         where: {
            id: id,
            user_Id: userId,
         },
      });

      // if (error) { return NextResponse.json({ error: error }, { status: 404 }) }
      return NextResponse.json({ error: null }, { status: 200 });
   } catch (error) {
      console.error('Err:', error)  //err for client
      return NextResponse.json({ error: error }, { status: 500 });
   }
}
