"use client"
import type { Note } from "@prisma/client"
import { SidebarGroup, SidebarGroupLabel } from "./ui/sidebar"


function SidebarGroupContent({ notes }: { notes: Note[] }) {
   console.log("SidebarGroupContent notes:", notes)

   if (!notes || notes.length === 0 || notes === undefined) { return <p>No notes available</p> }

   return (

      // <div className="flex flex-col gap-2">ur notes
      //    {notes.length > 0 ? (
      //       notes.map((note) => (
      //          <div key={note.id} className="p-2 bg-gray-100 text-gray-800 rounded-md">
      //             {note.text}
      //          </div>
      //       ))
      //    ) : (
      //       <p>No notes available</p>
      //    )}
      // </div>
      <SidebarGroup title="Notes">
         <SidebarGroupLabel className="flex flex-col gap-2">
            ur notes
            {notes.length > 0 ?
               (notes.map((note) => (
                  <div key={note.id} className="p-2 bg-gray-100 text-gray-800 rounded-md">{note.text}</div>))) :
               <p>No notes available</p>}
         </SidebarGroupLabel>
      </SidebarGroup>
   )
}

export default SidebarGroupContent