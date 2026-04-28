"use client";

import type { User } from "@supabase/supabase-js";
import { Button } from "../components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "./ui/dialog";
import { Fragment, useRef, useState, useTransition } from "react";
import { Textarea } from "./ui/textarea";
import { ArrowUpIcon, Sparkles } from "lucide-react";

type Props = {
   session: User | null;
};

function AskAIButton({ session }: Props) {
   const [isPending, startTransition] = useTransition();

   const [open, setOpen] = useState(false);
   const [questionText, setQuestionText] = useState("");
   const [questions, setQuestions] = useState<string[]>([]);
   const [responses, setResponses] = useState<string[]>([]);

   const handleOnOpenChange = (isOpen: boolean) => {
      if (!session) {
         return;
      } else {
         if (isOpen) {
            setQuestionText("");
            setQuestions([]);
            setResponses([]);
         }
         setOpen(isOpen);
      }
   };

   const textareaRef = useRef<HTMLTextAreaElement>(null);
   const contentRef = useRef<HTMLDivElement>(null);

   const handleInput = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
   };

   const handleClickInput = () => {
      textareaRef.current?.focus();
   };

   const handleSubmit = () => {
      if (!questionText.trim()) return;

      const currentQuestion = questionText;
      const newQuestions = [...questions, currentQuestion];
      setQuestions(newQuestions);
      setQuestionText("");
      setTimeout(scrollToBottom, 100);

      startTransition(async () => {
         try {
            const res = await fetch("/api/generate-ai-idea", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({ prompt: currentQuestion }),
            });
            const data = await res.json();
            
            if (data.response) {
               setResponses((prev) => [...prev, data.response]);
            }
         } catch (error) {
            console.error("AI fetch error:", error);
            setResponses((prev) => [...prev, "Oops! AI is currently taking a nap. Try again later."]);
         }
         setTimeout(scrollToBottom, 100);
      });
   };

   const scrollToBottom = () => {
      contentRef.current?.scrollTo({
         top: contentRef.current.scrollHeight,
         behavior: "smooth",
      });
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
         e.preventDefault();
         handleSubmit();
      }
   };

   return (
      <Dialog open={open} onOpenChange={handleOnOpenChange}>
         <DialogTrigger asChild>
            <Button variant="secondary" className="glass-panel text-primary shadow-lg border border-white/40 hover:bg-white/40 transition-all rounded-full flex items-center gap-2 group fixed bottom-6 right-6 z-50 p-4 h-auto">
               <Sparkles className="size-5 text-indigo-500 group-hover:animate-pulse" />
               <span className="font-semibold">Ask AI</span>
            </Button>
         </DialogTrigger>
         <DialogContent
            className="custom-scrollbar flex h-[85vh] max-w-4xl flex-col overflow-y-auto glass-panel border-white/20"
            ref={contentRef}
         >
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2 text-2xl">
                  <Sparkles className="text-indigo-500" />
                  Ask AI
               </DialogTitle>
               <DialogDescription>
                  Our AI assistant can help you brainstorm tasks and summarize ideas!
               </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex flex-col gap-6 flex-1 overflow-y-auto pr-2">
               {questions.map((question, index) => (
                  <Fragment key={index}>
                     <p className="bg-indigo-500 text-white ml-auto max-w-[70%] rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                        {question}
                     </p>
                     {responses[index] && (
                        <p
                           className="bg-white/60 dark:bg-black/40 text-foreground mr-auto max-w-[70%] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-white/20"
                        >
                           {responses[index]}
                        </p>
                     )}
                  </Fragment>
               ))}
               {isPending && <div className="mr-auto flex gap-2 items-center bg-white/40 dark:bg-black/20 px-4 py-3 rounded-2xl rounded-tl-sm animate-pulse">
                  <span className="size-2 bg-indigo-500 rounded-full animate-bounce"></span>
                  <span className="size-2 bg-purple-500 rounded-full animate-bounce delay-75"></span>
                  <span className="size-2 bg-pink-500 rounded-full animate-bounce delay-150"></span>
               </div>}
            </div>

            <div
               className="mt-4 flex cursor-text flex-col rounded-2xl border border-white/30 bg-white/50 dark:bg-black/50 p-3 shadow-inner transition-colors focus-within:bg-white/80 dark:focus-within:bg-black/80"
               onClick={handleClickInput}
            >
               <Textarea
                  ref={textareaRef}
                  placeholder="Ask me for task ideas..."
                  className="placeholder:text-muted-foreground resize-none rounded-none border-none bg-transparent p-1 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  style={{
                     minHeight: "0",
                     lineHeight: "normal",
                  }}
                  rows={1}
                  onInput={handleInput}
                  onKeyDown={handleKeyDown}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  disabled={isPending}
               />
               <Button onClick={handleSubmit} disabled={isPending || !questionText.trim()} className="ml-auto size-10 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-md transition-transform hover:scale-105 active:scale-95 mt-2">
                  <ArrowUpIcon className="size-5" />
               </Button>
            </div>
         </DialogContent>
      </Dialog>
   );
}

export default AskAIButton;