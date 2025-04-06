"use server";
import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";
// import type { User } from "@supabase/supabase-js";
// const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
//   email: 'kkk@kkk.kk',
//   password: 'asdfghjk'
// });



export async function GET(request: NextRequest) {
   // const response = NextResponse.json({ message: "Hello, world!" });
   // response.headers.set("Access-Control-Allow-Credentials", "true");
   // response.headers.set("Custom-Header", "MyCustomValue");
   // return response;
   const { searchParams } = new URL(request.url);
   const userId: string | null = searchParams.get("userId") || "";
   const id: string | null = searchParams.get("Id") || "";
   const title: string | null = searchParams.get("title") || "";

   if (!userId || !id || !title) { return NextResponse.json({ error: null }, { status: 400 }); }

   // try {
   //    const supabase = await createSupabaseClient();
   //    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
   //    const user = session?.user
   //    if (sessionError || !session || !user) {
   //       return NextResponse.json({ error: sessionError }, { status: 401 })
   //    }
   // }
   // catch (sessionError) {
   //    return NextResponse.json({ error: sessionError }, { status: 401 })
   // }
   try {
      // const supabase = await createSupabaseClient();
      // // const supabase = await createSupabaseClient();
      // await supabase.auth.refreshSession();
      // const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      // console.log("Session object:", session);
      // console.log("Session Error:", sessionError);

      // const user = session?.user
      // console.log("Query userId:", userId, "Session userId:", session, 'id', id, title);
      // if (sessionError || !session) {
      //    return NextResponse.json({ error: sessionError }, { status: 401 })
      // }
      // console.log("Session userId:", session?.user?.id)

      // const { data, error } = await supabase.from('Tasks').update({ title }).eq('id', id,).eq('user_Id', session?.user.id);
      await prisma.tasks.update({
         where: {
            id: id,
            user_Id: userId, // userId,
         },
         data: {
            title: title,
         },
      });
      // if (error) { return NextResponse.json({ error: error }, { status: 404 }) }
      return NextResponse.json({ error: null }, { status: 200 });
   } catch (error) {
      console.error('Err:', error)  //err for client
      return NextResponse.json({ error: error }, { status: 500 });
   }
}
