"use client";
import { getUser } from '../auth/server';
import { useCallback, useEffect, useState } from 'react';
// import type { User as PrismaUser } from "@prisma/client";  NO
// import type { User } from '@supabase/supabase-js';  //NO
import type { User } from '@supabase/auth-js';  // YES 
// interface Users extends PrismaUser {
//    createdAt: Date;
//    updatedAt: Date;
// }
//

// import { v4 as uuidv4 } from 'uuid'; // Import uuidv4

interface CudTasksResult {
   updateTask: (id: string, title: string) => Promise<void>;
   deleteTask: (id: string) => Promise<void>;
   createDummy: (title: string) => Promise<void>;
   createTask: (title: string) => Promise<void>;
   loading: boolean;
   error: string | null;
}

function useCudTasks(): CudTasksResult {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [session, setSession] = useState<User | null>(null);

   useEffect(() => {
      const fetchUser = async () => {
         try {
            const currentUser: User | null = await getUser();
            if (!currentUser) {
               /*  console.log("unauthenticated, session expired. Redirecting to login..");
                 //   window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;*/
               return null;
            } else if (currentUser) {
               // } else {
               setSession(currentUser);
            }
         } catch (error) {
            return console.error("Error fetching user:", error);
         }
      };
      fetchUser();
   }, []);
   //    if (currentUser) {
   //       setSession({...currentUser, createdAt: new Date(), updatedAt: new Date()})
   //   }
   const updateTask = useCallback(async (id: string, title: string) => {
      setLoading(true);
      setError(null);
      console.log('---------updating task', id, 'session', session);
      try {
         // let userId = session?.id;

         // if (!session) {
         //    setError("Usernd session is invalid",);
         //    return;
         // }
         // const supabase = await createSupabaseClient();
         // const { error: supabaseError } = await supabase.from('Tasks').update({ title }).eq('id', id);
         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/uptasks?userId=${session?.id}&title=${title}&Id=${id}`, {
            method: "GET",
            credentials: "include"
         });
         const { error: supabaseError } = await response.json();
         if (supabaseError) {
            setError(`Error updating task: ${supabaseError.message}`);
            // console.log(`Error updating task: ${supabaseError.message}, d:${data.x}d:${data.y}`);
         }
      } catch (err) {
         setError(`Error updating task: ${err}`);
      } finally {
         setLoading(false);
      }
   }, [session]);


   const deleteTask = useCallback(async (id: string) => {
      setLoading(true);
      setError(null);
      try {
         console.log('deleting task', id, 'session', session);
         // if (!session) {
         //    setError("Usergd session is invalid",);
         //    return;
         // }
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
   }, [session]);

   const createDummy = useCallback(async (title: string) => {
      setLoading(true);
      setError(null);
      try {
         // const supabase = await createSupabaseClient();
         // const { error: supabaseError } = await supabase.from('Tasks').delete().eq('id', id);
         console.log(session);
         if (!session || !session.id) {
            setError("Userd session is invalid",);
            return;
         }
         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/createDummy`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: session.id, title }),
         });

         if (!response.ok) {
            const { error: supabaseError } = await response.json();
            setError(`Error creating dummy: ${supabaseError.message}`);
         }
      } catch (err) {
         setError(`Error creating dummy: ${err}`);
      } finally {
         setLoading(false);
      }
   }, [session]);

   const createTask = useCallback(async (title: string) => {
      setLoading(true);
      setError(null);
      try {
         // const supabase = await createSupabaseClient();
         // const { error: supabaseError } = await supabase.from('Tasks').delete().eq('id', id);
         if (!session || !session.id) {
            setError("Users session is invalid");
            return;
         }
         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/createTask`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: session.id, title }),
         });

         if (!response.ok) {
            const { error: supabaseError } = await response.json();
            setError(`Error creating task: ${supabaseError.message}`);
         } else {
            console.log('Task created successfully');
         }
      } catch (err) {
         setError(`Error creating task: ${err}`);
      } finally {
         setLoading(false);
      }
   }, [session]);

   return { createTask, createDummy, updateTask, deleteTask, loading, error };
}
export default useCudTasks;

//    const cudloadTasks = useCallback(async (id: number) => {
//       try {
//          // const response = await fetch(`<span class="math-inline">\{process\.env\.NEXT\_PUBLIC\_BASE\_URL\}/api/retriev\-tasks?userId\=</span>{session?.id}`);

//           const task: Tasks = await response.json();
//           const dnote = JSON.parse(JSON.stringify(task));
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
