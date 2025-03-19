"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Head from 'next/head';

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

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      console.error('User not authenticated');
      return;
    }
    const userId = user ? user.id : null;
    // const userId = users ? users.id : null;
    const { data, error } = await supabase.from('tasks').select('*').eq('user_id', userId);
    if (error) console.error('Error fetching tasks:', error);
    else setTasks(data || []);
  }

  async function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
    const { data, error } = await supabase.from('tasks').insert({ title });
    if (error) console.error('Error adding task:', error);
    else {
      console.log('Task added:', data);
      loadTasks();
      form.reset();
    }
  }
  // clear the form-inputs (not the modified js),same as pressing input type="reset"
  async function updateTask(id: number, title: string) {
    const { error } = await supabase.from('tasks').update({ title }).eq('id', id);
    if (error) console.error('Error updating task:', error);
    else loadTasks();
  }

  async function deleteTask(id: number) {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) console.error('Error deleting task:', error);
    else loadTasks();
  }

  async function addDummy() {
    // Authenticate the user
    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
      email: 'user@example.com',
      password: 'your-password'
    });

    if (authError) {
      console.error('Error signing in:', authError);
    } else {
      console.log('User signed in:', user);

      // Now that the user is authenticated, insert dummy data
      const { data: insertData, error: insertError } = await supabase
        .from('Tasks')
        .insert([
          {
            id: supabase.rpc('gen_random_uuid'), // Generate a new UUID for the task ID
            user_id: user?.id, // Use the authenticated user's ID
            Title: 'Sample Task Title',
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
      }
    }
  }
  async function signIn() {
    const { data, error } = await supabase.auth.signUp({
      email: 'user@example.com',
      password: 'your-password'
    })
    if (error) console.error('Error adding task:', error);
    if (data) console.error('Task added:', data);
  }
  return (
    <>
      <Head>
        {/* <title>HTMX CRUD with Supabase</title> */}
        <title>nextjs with Supabase</title>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        {/* <Script src="" strategy="afterInteractive" /> either async or this way*/}
        {/* <script src="https://unpkg.com/htmx.org@1.6.1" async></script> */}
      </Head>
      <main className="transparent max-w-md m-auto">
        <div className="container mx-auto p-2 border-2">
          {/* <h1>HTMX CRUD with Supabase</h1> */}
          <h1 className="text-2xl font-bold text-center">NextJS with Supabase</h1>

          <form onSubmit={addTask} className="flex justify-evenly mt-2 mb-3 px-5 gap-1">
            <input type="text" name="title" placeholder="New Task" required className="border-2 border-slate-800 text-black" />
            <button type="submit" className="border-2 border-dashed hover:border-slate-800">Add Task</button>
            <button onClick={() => addDummy()} className="mt-3 w-1/2 border-2 border-dashed border-red-400 hover:text-neutral-700">addDummy</button>
            <button onClick={() => signIn()} className="mt-3 w-1/2 border-2 border-dashed border-red-400 hover:text-neutral-700">signIn</button>
          </form>

          <div id="task-list" className="space-y-2 border-2">
            {tasks.map((task, i) => (
              <div key={task.id || i} className="mx-auto bg-black text-white font-extrabold">
                <span className="mx-auto flex justify-evenly">{task.title}</span>
                <button onClick={() => updateTask(task.id, prompt('New title:', task.title) || task.title)} className="mt-2 w-1/2 border-dotted border-2 border-cyan-700 hover:text-neutral-700">
                  Edit
                </button>
                <button onClick={() => deleteTask(task.id)} className="mt-3 w-1/2 border-2 border-dashed border-red-400 hover:text-neutral-700">Delete</button>
              </div>
            ))}
          </div>
          <div className="mt-2"></div>
        </div>
      </main>
    </>
  );
}

