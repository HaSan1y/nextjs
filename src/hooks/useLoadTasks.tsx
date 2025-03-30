import { createSupabaseClient } from '@/auth/server';
import { Session } from '@supabase/supabase-js';
import { useCallback, useState } from 'react';

interface Task {
   id: number;
   title: string;
}

function useLoadTasks(session: Session) {
   const [tasks, setTasks] = useState<Task[]>([]);
   const [loading, setLoading] = useState(false);

   // Your task loading logic here

   // const loadTasks = useLoadTasks(session);
   const loadTasks = useCallback(async () => {
      // async function useLoadTasks() {
      setLoading(true);
      try {
         if (!session) {
            console.log('User not authenticated..');
            return;
         }

         const user = session?.user;
         // const session = await getSession();
         // const { data: { session } } = await supabase.auth.getSession();
         // if (!user) {
         //   console.log('User not authenticated..');
         //   return;
         // }
         // console.log(user);
         // const userId = users ? users.id : null;
         const supabase = await createSupabaseClient();
         const { data, error } = await supabase.from('Tasks').select('*').eq('user_Id', user?.id);
         if (error) return console.error('Error fetching tasks:', error);
         else setTasks(data || []);
      } catch (error) {
         console.error("Error loading tasks:", error);
      } finally {
         setLoading(false);
      }
   }, [session]);

   return {
      tasks,
      loading,
      loadTasks
   };
}

export default useLoadTasks;