"use server";
import { createSupabaseClient } from "@/auth/server";
import { NextRequest, NextResponse } from "next/server";
// import type { User } from "@supabase/supabase-js";


export async function GET(request: NextRequest) {
   const { searchParams } = new URL(request.url);
   const userId: string | null = searchParams.get("userId");
   const id: string | null = searchParams.get("Id");
   const title: string | null = searchParams.get("title");

   if (!userId || userId === "null" || !id || id === "null") {
      return NextResponse.json({ error: null }, { status: 400 });
   }
   try {
      const supabase = await createSupabaseClient();
      const { error } = await supabase.from('Tasks').update({ title }).eq('id', id);
      // const supabase = await createSupabaseClient();
      // const { error: supabaseError } = await supabase.from('Tasks').update({ title }).eq('id', id);

      if (error || !error) console.error('Error deleting task:', error);

      return NextResponse.json({ error: null }, { status: 200 });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ error: null }, { status: 500 });
   }
}