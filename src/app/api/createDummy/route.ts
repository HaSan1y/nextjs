
import { prisma } from "../../../../prisma-custom/prisma";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4
import { getUser } from "@/auth/server";

export async function POST(request: NextRequest) {
   try {
      const { title } = await request.json();
      const user = await getUser();
      const userId = user?.id;

      if (!title || !userId) {
         console.error("Error dumm:");
         return NextResponse.json({ error: null }, { status: 400 });
      }
      // const supabase = await createSupabaseClient();
      const generatedId = uuidv4();
      // const { data, error } = await supabase.from('Tasks').insert(
      //    {
      //       id: generatedId,
      //       user_Id: userId,
      //       title: 'title',
      //       first_name: "John",
      //       last_name: "Doe",
      //       email: "john.doe@example.com",
      //       phone: "123-456-7890"

      //    }
      // );
      const newTask = await prisma.tasks.create({
         data: {
            id: generatedId,
            user_Id: userId,
            title,
            first_name: "Jon",
            last_name: "Do",
            email: "jon.doe@example.com", // TODO: get user email from auth
            phone: "123-456-789"
         },
      });
      // if (error || !data) {
      //    return NextResponse.json({ error: error }, { status: 400 });
      // } else {
      return NextResponse.json(newTask, { status: 200 });
      // }
   } catch (error) {
      console.error('Task add err:', error); //err for client
      return NextResponse.json({ error: error }, { status: 500 });
   }
}

// }
// const { searchParams } = new URL(request.url);
// const userId: string | null = searchParams.get("userId");
// const id: string | null = searchParams.get("Id");
// const title: string | null = searchParams.get("title");


// if (!title || !id || !userId) {
//    console.error("Error dumm:");
//    return NextResponse.json({ error: null }, { status: 400 });
// }

// try {
//    const supabase = await createSupabaseClient();
//    const generatedId = uuidv4();
//    const { data, error } = await supabase.from('Tasks').insert([
//       {
//          id: generatedId,
//          user_Id: userId,
//          title,
//          first_name: "John",
//          last_name: "Doe",
//          email: "john.doe@example.com",
//          phone: "123-456-7890",
//          createdAt: new Date().toISOString(),
//          updatedAt: new Date().toISOString(),
//       },
//    ]);
//    if (error) {
//       console.log('Error adding taskf:', error);
//       return NextResponse.json({ error: error.message }, { status: 400 });
//    }
//    else {
//       console.log('dummy added:', data); return NextResponse.json({ error: null }, { status: 200 });
//    }
// } catch (error) {
//    console.error('Task add err:', error); return NextResponse.json({ error: null }, { status: 500 });
// }
// }
