"use client";
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { createSupabaseClient } from '@/auth/server';
dotenv.config();

//seems need to pass auth from login by layout, else ve proplems
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// const supabase = createClient(supabaseUrl, supabaseAnonKey);


//   useEffect(() => {
//     useLoadTasks();
//   }, [useLoadTasks]);
// }
//([]) initialized as an empty array, <Task[]>generic typed as an array of Task objects
import { Session } from '@supabase/supabase-js';
import useLoadTasks from '../hooks/useLoadTasks';


export default function PageTwo({ session }: { session: Session }) {
  const { tasks, loading, loadTasks } = useLoadTasks(session);
  const addTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
    // useEffect(() => {
    //   supabase.auth.getSession().then(({ data: { session } }) => {
    //     if (!session) {
    //       console.log("User not authenticated");
    //     }
    //   });
    // }, []);
    try {
      // const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
      //   email: 'wiesosowieso@outlook.de',
      //   password: 'asdfghjk'
      // });
      const supabase = await createSupabaseClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        return;
      }
      const user = session?.user;
      const generatedId = uuidv4();
      if (!user) {
        console.error("User not authenticated", session);
        return;
      }
      const { data, error } = await supabase.from('Tasks').insert([
        {
          id: generatedId,
          user_Id: user?.id,
          title,
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          phone: "123-456-7890",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
      if (error) { console.log('Error adding task:', error); }
      else {
        console.log('Task added:', data);
        loadTasks();
        form.reset();
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }
  const updateTask = async (id: number, title: string) => {
    try {
      const supabase = await createSupabaseClient();
      const { error } = await supabase.from('Tasks').update({ title }).eq('id', id);
      if (error) console.error('Error updating task:', error);
      else loadTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  // async function deleteTask(id: number) {
  const deleteTask = async (id: number) => {
    try {
      const supabase = await createSupabaseClient();
      const { error } = await supabase.from('Tasks').delete().eq('id', id);
      if (error) console.error('Error deleting task:', error);
      else loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  // async function addDummy() {
  //   try {
  //     // const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  //     // if (sessionError) {
  //     //   console.error("Error fetching session:", sessionError);
  //     //   return;
  //     // }
  //     // const user = session?.user;
  //     // if (!user) {
  //     //   console.error("User not authenticated", session);
  //     //   return;
  //     // }
  //     const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
  //       email: 'aaa@aa.aa',
  //       password: 'asdfghjk'
  //     });

  //     if (authError) {
  //       console.error('Error signing in:', authError);

  //     } else {

  //       const generatedId = uuidv4(); // Extract the generated UUID
  //       console.log('User signed in:', user);

  //       const { data: insertData, error: insertError } = await supabase
  //         .from('Tasks')
  //         .insert([
  //           {
  //             id: generatedId,
  //             user_Id: user?.id,
  //             title: 'Sample Task Title',
  //             first_name: 'John',
  //             last_name: 'Doe',
  //             email: 'john.doe@example.com',
  //             phone: '123-456-7890'
  //           }
  //         ]);

  //       if (insertError) {
  //         console.error('Error inserting data:', insertError);
  //       } else {
  //         console.log('Data inserted successfully:', insertData);
  //         useLoadTasks();
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error adding dummy data:", error);
  //   }
  // }

  return (
    <main className="transparent max-w-md m-auto">
      <div className="container mx-auto p-2 border-2">
        <h1 className="text-2xl font-bold text-center">NextJS with Supabase</h1>

        <form onSubmit={addTask} className="flex justify-evenly mt-2 mb-3 px-5 gap-1">
          <input type="text" name="title" placeholder="New Task" required className="border-2 border-slate-800 text-black" />
          <button type="submit" className="border-2 border-dashed hover:border-slate-800">Add Task</button>
          {/* <button onClick={() => addDummy()} className="mt-3 border-2 border-dashed border-red-400 hover:text-neutral-700">addDummy</button> */}
        </form>

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <div id="task-list" className="space-y-2 border-2">
            {tasks.map((task) => (
              <div key={task.id} className="mx-auto bg-black text-white font-extrabold">
                <span className="mx-auto flex justify-evenly">{task.title}</span>
                <button onClick={() => updateTask(task.id, prompt('New title:', task.title) || task.title)} className="mt-2 w-1/2 border-dotted border-2 border-cyan-700 hover:text-neutral-700">
                  Edit
                </button>
                <button onClick={() => deleteTask(task.id)} className="mt-3 w-1/2 border-2 border-dashed border-red-400 hover:text-neutral-700">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
