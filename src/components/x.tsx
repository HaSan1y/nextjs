// import { getUser } from "@/auth/server"
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { prisma } from "@/db/prisma"
import { Note } from "@prisma/client"
import Link from "next/link"
import SidebarGroupContent from "./SidebarGroupContent"
import { getSession } from "@/auth/server";
// import { cookies } from 'next/headers'

export async function AppSidebar() {
   // const user = await getUser()
   // const cookieStore = cookies()
   // const supabase = await createClient(cookieStore);
   // const { data: { user } } = await supabase.auth.getUser()
   const session = await getSession();
   if (!session) {
      console.log('session', session);
   }
   const user = session && 'user' in session ? session.user : undefined;
   if (!user) {
      console.log('user', user);
   }

   let notes: Note[] = []
   if (user) {
      notes = await prisma.note.findMany({
         where: { authorId: user.id },
         orderBy: { updatedAt: "desc" },
      }) as Note[]
   }

   return (
      <Sidebar>
         <SidebarContent /*className="custom-scrollbar"*/>
            <SidebarGroup title="Notes">
               <SidebarGroupLabel className="flex flex-col gap-2">
                  {user ? ("Your Notes") : (
                     <p>
                        <Link href="/login" className="underline">Log in</Link> to see your notes
                     </p>)}
               </SidebarGroupLabel>
               {user && <SidebarGroupContent notes={notes} />}
            </SidebarGroup>
         </SidebarContent>
      </Sidebar>
   )
}
