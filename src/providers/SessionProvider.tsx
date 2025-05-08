"use client";
import { createContext, useContext, useEffect, useState } from "react";
// import type { User } from "@supabase/auth-helpers-nextjs";
// import type { User } from '@supabase/auth-js';
// import type { User } from "@prisma/client";
import { getUser } from "./../auth/server";
// import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/supabase-js";

interface SessionContextType {
   session: User | null;
   setSession: React.Dispatch<React.SetStateAction<User | null>>;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({
   children,
   initialSession,
}: React.PropsWithChildren<{ initialSession: User | null }>) {
   console.log("SessionProvider is rendering...");

   const [session, setSession] = useState<User | null>(initialSession);
   // const supabase = useSupabaseClient();
   // const supabase = createPagesBrowserClient();
   console.log("Supabase client initialized: success");

   useEffect(() => {
      console.log("SessionProvider useEffect is running...");
      if (!initialSession) {
         const fetchSession = async () => {
            try {
               // const { data, error } = await supabase.auth.getSession();
               const data = await getUser();
               if (data) {
                  setSession(data);
                  console.log('successful dataset sessprovider');
               } else {
                  console.log('err dataset sessprovider not logged in');
               }
            } catch (err) {
               console.error("Error fetching user:", err);
            }
            // const currentSession = await getUser();
            // if (currentSession) {
            //    setSession(currentSession);
            // } else {
            //    console.warn("No user session found");
            // }
         };
         fetchSession();
      }
   }, [initialSession]);

   return (
      <SessionContext.Provider value={{ session, setSession }}>
         {children}
      </SessionContext.Provider>
   );
}

//export const useSess = () => useContext(SessionContext); no, i prefer hoisted fn
export function useSession() {
   const context = useContext(SessionContext);
   if (!context) {
      throw new Error("useSession must be used within a SessionProvider");
   }
   return context;
}

// export const refreshSession = async () => {
//    const supabase = createPagesBrowserClient();
//    console.log("refreshSession is rendering...");

//    const [session, setSession] = useState<User | null>(null);

//    useEffect(() => {
//       const refreshSession = async () => {
//          const { data, error } = await supabase.auth.refreshSession();
//          if (error) {
//             console.error("Error refreshing session:", error);
//          } else {
//             console.log("Refreshed session:", data);
//             setSession(data.user);
//          }
//       };
//       refreshSession();
//    }, []);
// }
