import { useState, useEffect } from 'react';

export function useAuth() {
   const [authState, setAuthState] = useState({ authenticated: false, user: null });

   useEffect(() => {
      async function fetchAuthState() {
         const response = await fetch('/api/auth-state');
         if (response.ok) {
            const data = await response.json();
            setAuthState(data);
         }
      }
      fetchAuthState();
   }, []);

   return authState;
}