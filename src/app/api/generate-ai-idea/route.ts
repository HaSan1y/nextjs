import { NextResponse } from "next/server";

export async function POST(request: Request) {
   try {
      const { prompt } = await request.json();

      // Simulated AI Responses to keep it completely free and not require API keys
      const simulatedResponses = [
         "Here's an idea: Organize your most important tasks by priority and tackle the hardest one first!",
         "AI Suggestion: Take a 5-minute break and stretch. It improves productivity!",
         "How about summarizing your latest notes into a quick bulleted list?",
         "Idea for a task: Review your goals for this week and see if you are on track.",
         "AI Tip: Use tags in your notes to find them faster next time.",
         "I suggest breaking down your large tasks into smaller, more manageable sub-tasks.",
         "Here's a creative task: Write a reflective note about what you accomplished today."
      ];

      // Simulate a small delay for "AI thinking"
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const randomResponse = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];
      
      return NextResponse.json({ 
         response: `${randomResponse}\n\n*(Simulated AI response based on: "${prompt}")*` 
      }, { status: 200 });

   } catch (error) {
      console.error("AI Generation Error:", error);
      return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 });
   }
}
