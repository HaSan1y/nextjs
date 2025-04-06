"use client";
import dotenv from 'dotenv';
dotenv.config();
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
  console.log('task props retriev page2:success', 'user: also success');
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

  if (loading || bload) return (<div>Loading...</div>)
  return (
    <main className="transparent max-w-md m-auto">
      <div className="container mx-auto p-2 border-2">
        <h1 className="text-2xl font-bold text-center">NextJS with Supabase</h1>

        <form name='addTask' onSubmit={handleCreateTask} className="flex justify-evenly mt-2 mb-3 px-5 gap-1">
          <input type="text" name="title" placeholder="New Task" required className="border-2 border-slate-800 text-black" />
          <button type="submit" className="border-2 border-dashed hover:border-slate-800">Add Task</button>
          {/* <button onClick={() => addDummy()} className="mt-3 border-2 border-dashed border-red-400 hover:text-neutral-700">addDummy</button> */}
        </form>

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <div id="task-list" className="space-y-2 border-2">
            {tasks.length === 0 && <p>No tasks found.</p>}
            {tasks.map((task) => (

              <div key={task.id + task.title} className="mx-auto bg-black text-white font-extrabold">
                <span className="mx-auto flex justify-evenly">{task.title}</span>
                <button onClick={() => handleUpdate(task.id, prompt('New title:', task.title) || task.title)} className="mt-2 w-1/2 border-dotted border-2 border-cyan-700 hover:text-neutral-700">Update Task</button>
                <button onClick={() => handleDelete(task.id)} className="mt-3 w-1/2 border-2 border-dashed border-red-400 hover:text-neutral-700">Delete Task</button>
                <button onClick={() => handleCreateDummy(task.title)} className="mt-3 w-1/2 border-2 border-dashed border-red-400 hover:text-neutral-700">create dummy Task</button>

                {loading && <div>Loading...</div>}
                {error && <div>{error}</div>}
                {/* <button onClick={() => updateTask(Number(task.id), prompt('New title:', task.title) || task.title)} className="mt-2 w-1/2 border-dotted border-2 border-cyan-700 hover:text-neutral-700">                  Edit                </button>
            */}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
export default PageTwo
