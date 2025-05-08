"use client"
import type { Note } from "@prisma/client"
// import { SidebarGroup, SidebarGroupLabel } from "./ui/sidebar"


// function SidebarGroupContent({ notes }: { notes: Note[] }) {
//    console.log("SidebarGroupContent notes:", notes)
//    if (!notes || notes.length === 0 || notes === undefined) { return <p>No notes available</p> }

//    return (
//       <SidebarGroup title="Notes">
//          <SidebarGroupLabel className="flex flex-col gap-2">
//             ur notes
//             {notes.length > 0 ?
//                (notes.map((note) => (
//                   <div key={note.id} className="p-2 bg-gray-100 text-gray-800 rounded-md">{note.text}</div>))) :
//                <p>No notes available</p>}
//          </SidebarGroupLabel>
//       </SidebarGroup>
//    )
// }

// export default SidebarGroupContent
import {
   SidebarGroupContent as SidebarGroupContentShadCN,
   SidebarMenu,
   SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import SelectNoteButton from "./SelectNoteButton";
import DeleteNoteButton from "./DeleteNoteButton";

type Props = {
   notes: Note[] | undefined;
};

function SidebarGroupContent({ notes }: Props) {
   const [searchText, setSearchText] = useState("");
   // Initialize with notes, defaulting to an empty array if notes is undefined
   const [localNotes, setLocalNotes] = useState<Note[]>(notes || []);

   useEffect(() => {
      setLocalNotes(notes || []);
   }, [notes]);

   const fuse = useMemo(() => {
      // localNotes is guaranteed to be an array here
      return new Fuse(localNotes, { // Fuse expects an array
         keys: ["text"],
         threshold: 0.4,
      });
   }, [localNotes]);

   // filteredNotes will always be an array
   const filteredNotes: Note[] = searchText
      ? fuse.search(searchText).map((result) => result.item)
      : localNotes;

   const deleteNoteLocally = (noteId: string) => {
      setLocalNotes((prevNotes) =>
         prevNotes.filter((note) => note.id !== noteId),
      );
   };

   return (
      <SidebarGroupContentShadCN>
         <div className="relative flex items-center">
            <SearchIcon className="absolute left-2 size-4" />
            <Input
               className="bg-muted pl-8"
               placeholder="Search your notes..."
               value={searchText}
               onChange={(e) => setSearchText(e.target.value)}
            />
         </div>

         <SidebarMenu className="mt-4">
            {filteredNotes.length > 0 ? (
               filteredNotes.map((note) => (
                  <SidebarMenuItem key={note.id} className="group/item">
                     <SelectNoteButton note={note} />

                     <DeleteNoteButton
                        noteId={note.id}
                        deleteNoteLocally={deleteNoteLocally}
                     />
                  </SidebarMenuItem>
               ))) : (
               <p className="p-2 text-sm text-muted-foreground">
                  {searchText ? "No notes match your search." :
                     (notes === undefined ? "Loading notes..." : "No notes available.")}
               </p>
            )
            }
         </SidebarMenu>
      </SidebarGroupContentShadCN>
   );
}

export default SidebarGroupContent;