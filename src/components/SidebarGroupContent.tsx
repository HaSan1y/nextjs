"use client"

import { Note } from "@prisma/client"

type Props = {
   notes: Note[]
}

function SidebarGroupContent({ notes }: Props) {
   // console.log("SidebarGroupContent notes:", notes)

   if (!notes) {
      return <p>No notes available</p>
   }
   if (notes.length === 0) {
      return <p>No notes available</p>
   }

   return (

      <div className="flex flex-col gap-2">ur notes
         {notes.length > 0 ? (
            notes.map((note) => (
               <div key={note.id} className="p-2 bg-gray-100 text-gray-800 rounded-md">
                  {note.text}
               </div>
            ))
         ) : (
            <p>No notes available</p>
         )}
      </div>
   )
}

export default SidebarGroupContent