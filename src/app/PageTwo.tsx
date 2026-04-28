"use client";
// import { v4 as uuidv4 } from 'uuid';
// import { createSupabaseClient, getUser } from '../auth/server';
// import { useState, useEffect } from "react";
// import type { Note, Tasks } from "@prisma/client";
import useLoadTasks from '../hooks/useLoadTasks';
import useCudTasks from '@/hooks/useCudTasks';
// import type { User } from '@supabase/auth-js';
// import type { User } from '@supabase/auth-helpers-nextjs';
// import { User } from '@prisma/client';
// import { User } from '@supabase/supabase-js';
// import { useSession } from '@/providers/SessionProvider';
// import { useEffect, useState } from 'react';

//([]) initialized as an empty array, <Task[]>generic typed as an array of Task objects
// const PageTwo = ({ tasks: initialTasks, session }: { tasks: { id: string; title: string; session: Session }[] },) => {

const PageTwo = () => {
  // console.log('task props retriev page2:success', 'user: also success');
  const { tasks, loading, loadTasks } = useLoadTasks();
  const { createTask, createDummy, updateTask, deleteTask, loading: bload, error } = useCudTasks();


  if (!tasks) { return <div>No tasks found.</div>; }

  // const [tasks, setTasks] = useState(initialTasks);
  // useEffect(() => {
  //   async function fetchTasks() {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks`);
  //     const data = await response.json();
  //     setTasks(data);
  //   }
  //   fetchTasks();
  // }, []);

  // const addTask = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const form = event.target as HTMLFormElement;
  //   const title = (form.elements.namedItem('title') as HTMLInputElement).value;

  //   // const newTask = { id: crypto.randomUUID(), title };
  //   // setTasks([...tasks, newTask]);
  //   // form.reset();
  //   // useEffect(() => {
  //   //   supabase.auth.getSession().then(({ data: { session } }) => {
  //   //     if (!session) {
  //   //       console.log("User not authenticated");
  //   //     }
  //   //   });
  //   // }, []);
  //   // const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
  //   //   email: 'kkk@kkk.kk',
  //   //   password: 'asdfghjk'
  //   // });

  //   try {
  //     const supabase = await createSupabaseClient();
  //     const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  //     const user = session?.user
  //     if (sessionError || !session || !user) {
  //       console.error("Error fetching session:", sessionError);
  //       return;
  //     }

  //     const generatedId = uuidv4();
  //     const { data, error } = await supabase.from('Tasks').insert([
  //       {
  //         id: generatedId,
  //         user_Id: user.id,
  //         title,
  //         first_name: "John",
  //         last_name: "Doe",
  //         email: "john.doe@example.com",
  //         phone: "123-456-7890",
  //         createdAt: new Date().toISOString(),
  //         updatedAt: new Date().toISOString(),
  //       },
  //     ]);
  //     if (error) { console.log('Error adding taskf:', error); }
  //     else {
  //       console.log('Task added:', data);
  //       loadTasks();
  //       form.reset();
  //     }
  //   } catch (error) {
  //     console.error('Task add err:', error);
  //   }
  // }

  const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;      //.target as HTMLFormElement;
    const formData = new FormData(form);
    const titleEntry = formData.get('title')     //never use 'as' assert, bad practice((form.elements.namedItem('title') as HTMLInputElement).value);
    if (typeof titleEntry !== 'string') {
      console.error('Title is not a string or is missing.');
      // Handle the error (e.g., show an error message to the user)
      return;
    }

    const title = titleEntry;
    try {
      await createTask(title);

      if (error) { console.log('Error adding taskf:', error); }
      else {
        console.log('Task added:');
        loadTasks();
        form.reset();
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  }

  const handleCreateDummy = async (title: string) => {
    try {
      await createDummy(title);
      // await createDummy({ userId: dummy.user_Id, title: dummy.title });
      loadTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  const handleUpdate = async (id: string, title: string) => {
    console.log('<<<<<<<<<<<<<<id:', id, 'title:', title);
    try {
      await updateTask(id, title);
      loadTasks();
      // const supabase = await createSupabaseClient();
      // const { error } = await supabase.from('Tasks').update({ title }).eq('id', id);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }


  //   try {
  //      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  //      if (sessionError) {
  //        console.error("Error fetching session:", sessionError);
  //        return;
  //      }
  //      const user = session?.user;
  //      if (!user) {
  //        console.error("User not authenticated", session);
  //        return;
  //      }}

  //     const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
  //       email: 'aaa@aa.aa',
  //       password: 'asdfghjk'
  //     });

  if (loading || bload) return (<div className="flex justify-center items-center h-full text-white animate-pulse">Loading...</div>)
  return (
    <main className="transparent max-w-lg w-full mx-auto mt-10">
      <div className="container mx-auto p-6 glass-panel rounded-3xl border-none">
        <h1 className="text-3xl font-bold text-center text-white drop-shadow-md mb-8">Tasks Dashboard</h1>

        <form name='addTask' onSubmit={handleCreateTask} className="flex mb-8 gap-3">
          <input type="text" name="title" placeholder="What needs to be done?" required className="flex-1 rounded-xl px-4 py-3 bg-white/10 dark:bg-black/20 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md shadow-inner transition-all" />
          <button type="submit" className="rounded-xl px-6 py-3 bg-white/20 hover:bg-white/30 text-slate-800 dark:text-white font-semibold transition-all shadow-lg border border-white/30 backdrop-blur-md">Add</button>
        </form>

        {loading ? (
          <p className="text-slate-800 dark:text-white/80 text-center animate-pulse">Loading tasks...</p>
        ) : (
          <div id="task-list" className="space-y-4">
            {tasks.length === 0 && <p className="text-slate-800 dark:text-white/80 text-center italic py-4">No tasks found. Create one!</p>}
            {tasks.map((task) => (
              <div key={task.id + task.title} className="glass-panel p-5 rounded-2xl text-slate-800 dark:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-white/30 dark:hover:bg-white/10 group">
                <span className="block text-xl font-medium mb-4">{task.title}</span>
                <div className="flex gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleUpdate(task.id, prompt('New title:', task.title) || task.title)} className="flex-1 py-2 rounded-xl bg-white/20 hover:bg-white/40 transition-colors text-sm font-medium border border-white/30 shadow-sm">Update</button>
                  <button onClick={() => handleDelete(task.id)} className="flex-1 py-2 rounded-xl bg-red-400/30 hover:bg-red-500/50 transition-colors text-sm font-medium border border-red-400/30 shadow-sm">Delete</button>
                  <button onClick={() => handleCreateDummy(task.title)} className="flex-1 py-2 rounded-xl bg-white/20 hover:bg-white/40 transition-colors text-sm font-medium border border-white/30 shadow-sm">Clone</button>
                </div>
                {error && <div className="mt-3 text-red-400 text-sm font-medium">{error}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
export default PageTwo
