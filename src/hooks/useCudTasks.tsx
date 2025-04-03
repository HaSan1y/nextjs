"use client";
import { createSupabaseClient, getUser } from '../auth/server';
import { useCallback, useEffect, useState } from 'react';
// import type { User } from "@prisma/client";
import type { User } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4

interface CudTasksResult {
   updateTask: (id: number, title: string) => Promise<void>;
   deleteTask: (id: number) => Promise<void>;
   createDummy: (dummy: Dummy) => Promise<void>;
   loading: boolean;
   error: string | null;
}
interface Dummy {
   id: 'generatedId',
   user_Id: 'user.id',
   title: '',
   first_name: "John",
   last_name: "Doe",
   email: "john.doe@example.com",
   phone: "123-456-7890",
   createdAt: 'new Date().toISOString()',
   updatedAt: 'new Date().toISOString()',
}
function useCudTasks(): CudTasksResult {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [session, setSession] = useState<User | null>(null);

   useEffect(() => {
      const fetchUser = async () => {
         const currentUser: User | null = await getUser();
         if (!currentUser) {
            /*  console.log("unauthenticated, session expired. Redirecting to login..");
              //   window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;*/
            return null;
         } else {
            setSession(currentUser);
         }
      };
      fetchUser();
   }, []);

   const updateTask = useCallback(async (id: number, title: string) => {
      setLoading(true);
      setError(null);
      try {
         // const supabase = await createSupabaseClient();
         // const { error: supabaseError } = await supabase.from('Tasks').update({ title }).eq('id', id);
         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/uptasks?userId=${session?.id}&title=${title}&Id=${id}`);
         const { error: supabaseError } = await response.json();
         if (supabaseError) {
            setError(`Error updating task: ${supabaseError.message}`);
         }
      } catch (err) {
         setError(`Error updating task: ${err}`);
      } finally {
         setLoading(false);
      }
   }, []);


   const deleteTask = useCallback(async (id: number) => {
      setLoading(true);
      setError(null);
      try {
         // const supabase = await createSupabaseClient();
         // const { error: supabaseError } = await supabase.from('Tasks').delete().eq('id', id);
         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks?userId=${session?.id}&Id=${id}`);
         const { error: supabaseError } = await response.json();
         if (supabaseError) {
            setError(`Error deleting task: ${supabaseError.message}`);
         }
      } catch (err) {
         setError(`Error deleting task: ${err}`);
      } finally {
         setLoading(false);
      }
   }, []);

   const createDummy = useCallback(async (dummy: Dummy) => {
      setLoading(true);
      setError(null);
      try {
         // const supabase = await createSupabaseClient();
         // const { error: supabaseError } = await supabase.from('Tasks').delete().eq('id', id);
         if (!session || !session.id) {
            setError("User session is invalid");
            return;
         }
         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/createDummy`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: session.id, dummy }),
         });

         if (!response.ok) {
            const { error: supabaseError } = await response.json();
            setError(`Error creating dummy: ${supabaseError}`);
         }
      } catch (err) {
         setError(`Error creating dummy: ${err}`);
      } finally {
         setLoading(false);
      }
   }, [session]);

   return { createDummy, updateTask, deleteTask, loading, error };
}
export default useCudTasks;

//    const cudloadTasks = useCallback(async (id: number) => {
//       try {
//          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks?userId=${session?.id}&Id=${id}`);
//          // const response = await fetch(`<span class="math-inline">\{process\.env\.NEXT\_PUBLIC\_BASE\_URL\}/api/retriev\-tasks?userId\=</span>{session?.id}`);

//          // const task: Tasks = await response.json();
//          // const dnote = JSON.parse(JSON.stringify(task));
//          if (!response || response === null) {
//             console.error("task not found", response);

//          } else {
//             console.log(response, "serializedu tasks");

//          }
//       } catch (error) {
//          console.error("Error fetching notes:", error);
//       } finally {
//          setLoading(false);
//       }
//    }, [session]);

//    useEffect(() => {
//       if (session) {
//          cudloadTasks(id);
//       }
//    }, [cudloadTasks, session]);

//    return { cudloadTasks, loadTasks };
// }
