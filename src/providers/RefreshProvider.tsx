// "use client";

// import * as React from "react";

// const RefreshContext = React.createContext<{ refresh: boolean; setRefresh: React.Dispatch<React.SetStateAction<boolean>> }>({
//    refresh: false,
//    setRefresh: () => { },
// });

// export function RefreshProvider({ children }: React.PropsWithChildren) {
//    const [refresh, setRefresh] = React.useState(false);

//    return (
//       <RefreshContext.Provider value={{ refresh, setRefresh }}>
//          {children}
//       </RefreshContext.Provider>
//    );
// }

// export function useRefresh() {
//    const context = React.useContext(RefreshContext);
//    if (!context) {
//       throw new Error("useRefresh must be used within a RefreshProvider");
//    }
//    return context;
// }
import type { User } from "@supabase/supabase-js";
type AuthState = {
   authenticated: boolean;
   user: User | null; // Replace `any` with your user type if available
};

type AuthContextType = {
   authState: AuthState;
   setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
};
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
   const [authState, setAuthState] = useState<AuthState>({ authenticated: false, user: null });

   return (
      <AuthContext.Provider value={{ authState, setAuthState }}>
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
}

// Usage in a component:
// const { authState, setAuthState } = useAuth();