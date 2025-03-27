"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
// import Head from 'next/head';

import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Task {
  id: number;
  title: string;
}
//([]) initialized as an empty array, <Task[]>generic typed as an array of Task objects
export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        console.log('User not authenticated..');
        return;
      }
      // const userId = users ? users.id : null;
      const { data, error } = await supabase.from('tasks').select('*').eq('user_id', user.id);
      if (error) console.error('Error fetching tasks:', error);
      else setTasks(data || []);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;

    // const first_name = "John";
    // const last_name = "Doe";
    // const email = "john.doe@example.com";
    // const phone = "123-456-7890";

    // useEffect(() => {
    //   supabase.auth.getSession().then(({ data: { session } }) => {
    //     if (!session) {
    //       console.log("User not authenticated");
    //     }
    //   });
    // }, []);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        return;
      }
      const user = session?.user;
      // console.log("Session:", session);

      if (!user) {
        console.error("User not authenticated#");
        return;
      }
      const { data, error } = await supabase.from('tasks').insert([
        {
          userId: user?.id,
          title,
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          phone: "123-456-7890",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),

        },
      ]);
      if (error) console.error('Error adding task:', error);
      else {
        console.log('Task added:', data);
        loadTasks();
        form.reset();
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }
  // clear the form-inputs (not the modified js),same as pressing input type="reset"
  async function updateTask(id: number, title: string) {
    try {
      const { error } = await supabase.from('tasks').update({ title }).eq('id', id);
      if (error) console.error('Error updating task:', error);
      else loadTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  async function deleteTask(id: number) {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) console.error('Error deleting task:', error);
      else loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  async function addDummy() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email: 'aaa@aa.aa',
        password: 'asdfghjk'
      });

      if (authError) {
        console.error('Error signing in:', authError);
      } else {
        console.log('User signed in:', user);

        const { data: insertData, error: insertError } = await supabase
          .from('tasks')
          .insert([
            {
              id: supabase.rpc('gen_random_uuid'),
              user_id: user?.id,
              title: 'Sample Task Title',
              FirstName: 'John',
              LastName: 'Doe',
              Email: 'john.doe@example.com',
              Phone: '123-456-7890'
            }
          ]);

        if (insertError) {
          console.error('Error inserting data:', insertError);
        } else {
          console.log('Data inserted successfully:', insertData);
          loadTasks();
        }
      }
    } catch (error) {
      console.error("Error adding dummy data:", error);
    }
  }

  async function signIn() {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        // const { data, error } = await supabase.auth.signUp({
        email: 'aaa@aa.aa',
        password: 'asdfghjk'
      })

      if (error) { console.error('Error adding task:', error); }
      else {
        console.log("User signed up:", data);
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  }
  // {/* <Head> */}
  {/* <title>HTMX CRUD with Supabase</title> */ }
  {/* <title>nextjs with Supabase</title> */ }
  {/* eslint-disable-next-line @next/next/no-sync-scripts */ }
  {/* <Script src="" strategy="afterInteractive" /> either async or this way*/ }
  {/* <script src="https://unpkg.com/htmx.org@1.6.1" async></script> */ }
  {/* </Head> */ }
  return (
    <main className="transparent max-w-md m-auto">
      <div className="container mx-auto p-2 border-2">
        <h1 className="text-2xl font-bold text-center">NextJS with Supabase</h1>

        <form onSubmit={addTask} className="flex justify-evenly mt-2 mb-3 px-5 gap-1">
          <input type="text" name="title" placeholder="New Task" required className="border-2 border-slate-800 text-black" />
          <button type="submit" className="border-2 border-dashed hover:border-slate-800">Add Task</button>
          <button onClick={() => addDummy()} className="mt-3 w-1/2 border-2 border-dashed border-red-400 hover:text-neutral-700">addDummy</button>
          <button onClick={() => signIn()} className="mt-3 w-1/2 border-2 border-dashed border-red-400 hover:text-neutral-700">signIn</button>
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

