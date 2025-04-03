"use client";
import { createSupabaseClient, getUser } from '../auth/server';
// import type { User } from "@prisma/client";
import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Tasks } from '@prisma/client';
// import type { Tasks } from '@prisma/client';
interface SimplifiedTask {
   id: string;
   title: string;
}

function useLoadTasks() {
   const [session, setSession] = useState<User | null>(null);
   const [tasks, setTasks] = useState<Tasks[]>([]);
   const [loading, setLoading] = useState(true);

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


   const loadTasks = useCallback(async () => {
      try {
         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/retriev-tasks?userId=${session?.id}`);
         // const response = await fetch(`<span class="math-inline">\{process\.env\.NEXT\_PUBLIC\_BASE\_URL\}/api/retriev\-tasks?userId\=</span>{session?.id}`);
         const task: Tasks = await response.json();

         // const dnote = JSON.parse(JSON.stringify(task));
         if (!task || task === null) {
            console.error("task not found", task);
            setTasks([]);
         } else {
            console.log(task, "serializedu tasks");
            setTasks(Array.isArray(task) ? task : [task]);
         }
         console.log("fetched notes", task);
      } catch (error) {
         console.error("Error fetching notes:", error);
      } finally {
         setLoading(false);
      }
   }, [session]);

   useEffect(() => {
      if (session) {
         loadTasks();
      }
   }, [loadTasks, session]);

   return { tasks, loading, loadTasks };
}

export default useLoadTasks;
