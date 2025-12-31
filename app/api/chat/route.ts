export const runtime = 'edge';

export async function POST(req: Request) {
  // 1. Create a stream using standard Web APIs (No "ai" library needed)
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      const fullText = `👋 Hello! I am the Vinolin AI (Demo Mode).

Since we are running in a public demo environment, I am simulating the response to ensure stability.

Based on your request, I strictly recommend:

🍷 **Riesling Trocken 2022** - Weingut Meyer
💰 **12.50€**
🍽️ **Pairing:** Asian food, Fish.
💡 **Why this fits:** It has the perfect acidity to cut through the spice.`;

      // 2. Simulate typing effect by splitting text
      const chunks = fullText.split(/(?=[ ])/g); // Split by words

      for (const chunk of chunks) {
        // Small delay to look like AI is thinking
        await new Promise((r) => setTimeout(r, 30));
        controller.enqueue(encoder.encode(chunk));
      }
      
      controller.close();
    },
  });

  // 3. Return a standard Response
  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}