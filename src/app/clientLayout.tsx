"use client";

import type { User } from '@supabase/auth-js';
// import type { User, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
// import type { User } from '@supabase/ssr';
// import type { Tasks, User } from "@prisma/client";
// import { useSearchParams } from "next/navigation";

import { SessionProvider } from "@/providers/SessionProvider";
import Header from "@/components/Header";
import React from "react";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import PageTwo from "./PageTwo";
import { AuthProvider } from "@/providers/RefreshProvider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/ThemeProvider";
import NoteProvider from "@/providers/NoteProvider";

type LayoutProps = {
  children: React.ReactNode;
  initialSession: User | null;
};
// all pages wrapper; suppressHydrationWarning used to prevent hydration errors
export default function ClientLayout({ children, initialSession }: LayoutProps) {
   //const searchParams = useSearchParams(); //on client access like so
   // const [session, setsession] = useState<User>();
   // const [tasks, setTasks] = useState<Tasks[]>([]);
   // const [loading, setLoading] = useState(true);
   // const userId = searchParams?.get("userId");
   // const noteId = searchParams?.get("noteId");;
   // const task = searchParams?.get("task");;


   // useEffect(() => {
   //    const fetchData = async () => {
   //       try {
   //          const response = await getUser();//fetch('/api/get-user');
   //          if (!response) {
   //             throw new Error("Failed to fetch user data");
   //          }
   //          setsession(response);
   //          const tasksResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks?task=${task}`);
   //          if (!tasksResponse.ok) {
   //             console.error("task not found or invalid");
   //          } else {
   //             const tasksData: Tasks[] = await tasksResponse.json();
   //             // const serializedTasks = JSON.parse(tasksData.serializedTasks);
   //             console.log("fetchmmmed tasks", tasksData);
   //             setTasks(tasksData);
   //          } // Parse the JSON string into an array of objectstasksData);
   //          // setTasks(JSON.parse(tasksData.serializedTasks)); // Parse the JSON string into an array of objectstasksData);
   //       } catch (error) {
   //          console.error("Error fetching data:", error);
   //       } finally {
   //          setLoading(false);
   //       }
   //    };

   //    fetchData();
   // }, []);

   // useEffect(() => {
   //    if (userId && noteId && task) {
   //       console.log("userId from layout:", userId);
   //       console.log("noteId from layout:", noteId);
   //       console.log(tasks, "taskkkks", task, "task");
   //    }
   // }, [userId, noteId, task]);
   // if (loading) {
   //    return <div>Loading..tasks.</div>;
   // }
   // console.log("user from layout:", user);
   return (
      <AuthProvider>
         <SessionProvider initialSession={initialSession}>
            <ThemeProvider
               attribute="class"
               defaultTheme="system"
               enableSystem
               disableTransitionOnChange
            >
               <NoteProvider>
                  <SidebarProvider>
                     <div className="flex min-h-screen w-full flex-col relative">
                        <Header />
                        {initialSession ? <AppSidebar /> : null}
                        <main className="flex flex-1 flex-col justify-between px-4 pt-10 relative">
                           <SidebarTrigger className="place-self-end" />
                           {children}
                           {initialSession ?
                              <PageTwo />
                              : (<div>Please log in to see your tasks.</div>)}
                        </main>
                     </div>
                  </SidebarProvider >
                  <Toaster />
               </NoteProvider >
            </ThemeProvider >
         </SessionProvider>
      </AuthProvider>
   );
}


// const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks`);
// const text = await response.text();
// console.log("Raw response:", text);
// if (!response.ok) {
//   throw new Error(`HTTP error! status: ${response.status}`);
// }
// const tasks = JSON.parse(text);
// console.log("Parsed data:", tasks);


// const supabase = createServerComponentClient({ cookies })
// const { data: { user }, error: authError } = await supabase.auth.getUser()
// if (authError) { console.log('session', authError); }
// const session = await getSession();
// const [session, setSession] = useState<Session | null>(null);  
// const cookieStore = cookies()
// const { data: { user }, error } = await supabase.auth.getUser()
// const supabase = await createClient(cookieStore);
// const user = session?.user;

// useEffect(() => {
//   const fetchSession = async () => {
// const sessionData = await getSession();
//     const sessionContext = await useSession();
//     setSession(sessionContext?.session ?? null);
//   };
//   fetchSession();
// }, []);
// if (!session) {
//   console.log('session', session);
// }
// useEffect(() => {
//   console.log('session', session);
// }, [session]);

{/* <Head>     htmx
 <title>HTMX CRUD with Supabase</title> 
 <script src="" strategy="afterInteractive" /> //or async v //| beforeInteractive|lazyOnload
 <script src="https://unpkg.com/htmx.org@1.6.1" async></script> 
 </Head> */ }
