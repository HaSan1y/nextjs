"use client";

import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { createNoteAction } from "../actions/notes";
import type { User, } from "@supabase/supabase-js";


type Props = { user: User | null; note: string; };

function NewNoteButton({ user, note }: Props) {
   const router = useRouter();

   const [loading, setLoading] = useState(false);

   const handleClickNewNoteButton = async () => {
      if (!user || user === null) {
         if (!router) return;
         const absoluteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
         router.push(absoluteUrl);
      } else {
         setLoading(true);

         const uuid = uuidv4();
         await createNoteAction(uuid, note || "");
         router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/?noteId=${uuid}&toastType=newNote`);

         setLoading(false);
      }
   };

   return (
      <Button
         onClick={handleClickNewNoteButton}
         variant="secondary"
         className="w-24"
         disabled={loading}
      >
         {loading ? <Loader2 className="animate-spin" /> : "New Note"}
      </Button>
   );
}

export default NewNoteButton;