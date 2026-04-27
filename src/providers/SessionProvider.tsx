"use client";
import { createContext, useContext, useEffect, useState } from "react";
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
   const [session, setSession] = useState<User | null>(initialSession);

   useEffect(() => {
      setSession(initialSession);
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
