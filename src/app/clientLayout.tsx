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
import AskAIButton from "@/components/AskAiButton";

type LayoutProps = {
  children: React.ReactNode;
  initialSession: User | null;
};

export default function ClientLayout({ children, initialSession }: LayoutProps) {

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
                     <div className="flex min-h-screen w-full flex-col relative bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-950/40 dark:via-purple-900/40 dark:to-pink-950/40 animate-gradient">
                        <Header />
                        {initialSession ? <AppSidebar /> : null}
                        <main className="flex flex-1 flex-col justify-between px-4 pt-10 relative">
                           <SidebarTrigger className="place-self-end glass-panel rounded-full" />
                           {children}
                           {initialSession ?
                              <PageTwo />
                              : (<div>Please log in to see your tasks.</div>)}
                        </main>
                     </div>
                  </SidebarProvider >
                  <AskAIButton session={initialSession} />
                  <Toaster />
               </NoteProvider >
            </ThemeProvider >
         </SessionProvider>
      </AuthProvider>
   );
}

{/* <Head>     htmx
 <title>HTMX CRUD with Supabase</title> 
 <script src="" strategy="afterInteractive" /> //or async v //| beforeInteractive|lazyOnload
 <script src="https://unpkg.com/htmx.org@1.6.1" async></script> 
 </Head> */ }
