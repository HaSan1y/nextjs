"use client";

import * as React from "react";

const RefreshContext = React.createContext<{ refresh: boolean; setRefresh: React.Dispatch<React.SetStateAction<boolean>> }>({
   refresh: false,
   setRefresh: () => { },
});

export function RefreshProvider({ children }: React.PropsWithChildren) {
   const [refresh, setRefresh] = React.useState(false);

   return (
      <RefreshContext.Provider value={{ refresh, setRefresh }}>
         {children}
      </RefreshContext.Provider>
   );
}

export function useRefresh() {
   const context = React.useContext(RefreshContext);
   if (!context) {
      throw new Error("useRefresh must be used within a RefreshProvider");
   }
   return context;
}