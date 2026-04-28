"use client";
import { useCallback, useEffect, useState } from 'react';
import { Tasks } from '@prisma/client';
import { useSession } from '@/providers/SessionProvider';

function useLoadTasks() {
   const [tasks, setTasks] = useState<Tasks[]>([]);
   const [loading, setLoading] = useState(true);
   const { session } = useSession();


   const loadTasks = useCallback(async () => {
      if (!session) {
         setTasks([]);
         setLoading(false);
         return;
      }

      try {
         const response = await fetch(`/api/retriev-tasks`);
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
         console.log("fetched tasks", task);
      } catch (error) {
         console.error("Error fetching tasks:", error);
      } finally {
         setLoading(false);
      }
   }, [session]);

   useEffect(() => {
      if (session) {
         loadTasks();
      } else {
         setTasks([]);
         setLoading(false);
      }
   }, [loadTasks, session]);

   return { tasks, loading, loadTasks };
}

export default useLoadTasks;
