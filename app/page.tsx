'use client';

import { useState } from 'react';
import { analyzeLabel } from './actions';
import { Camera, Send, Loader2, Wine, ScanLine } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'vision'>('chat');

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <nav className="p-4 bg-white shadow-sm flex justify-center gap-8 border-b border-stone-200 sticky top-0 z-10">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition font-medium ${
            activeTab === 'chat' ? 'bg-red-900 text-white shadow-md' : 'text-stone-500 hover:bg-stone-100'
          }`}
        >
          <Wine size={18} /> Digital Cellar
        </button>
        <button
          onClick={() => setActiveTab('vision')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition font-medium ${
            activeTab === 'vision' ? 'bg-red-900 text-white shadow-md' : 'text-stone-500 hover:bg-stone-100'
          }`}
        >
          <ScanLine size={18} /> LabelLens
        </button>
      </nav>

      <div className="max-w-md mx-auto mt-6 p-4">
        {activeTab === 'chat' ? <ChatComponent /> : <VisionComponent />}
      </div>
    </main>
  );
}

function ChatComponent() {
  // MANUAL STATE MANAGEMENT (No AI SDK Hooks)
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message immediately
    const userMsg = { id: Date.now(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // 2. FORCE the fetch request
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      // 3. Read the stream manually
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiMsg = { id: Date.now() + 1, role: 'assistant', content: '' };
      
      // Add empty AI message placeholder
      setMessages((prev) => [...prev, aiMsg]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        
        // Update the AI message with new text
        aiMsg.content += chunk;
        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { ...aiMsg };
          return newMsgs;
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Error connecting to server. check console.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2">
        {messages.length === 0 && (
          <div className="text-center text-stone-400 mt-20 p-6 border-2 border-dashed border-stone-200 rounded-xl">
            <Wine className="mx-auto mb-2 opacity-50" size={32} />
            <p>Try asking:</p>
            <p className="font-mono text-xs mt-2 bg-stone-100 p-1 inline-block rounded">"I need a white wine for pasta"</p>
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-lg text-sm leading-relaxed ${
              m.role === 'user' ? 'bg-stone-200 self-end ml-10 rounded-tr-none' : 'bg-white border border-stone-200 mr-10 shadow-sm rounded-tl-none'
            }`}
          >
            <strong className="block text-xs text-red-900 mb-1 uppercase tracking-wider font-bold">
              {m.role === 'user' ? 'You' : 'Vinolin AI'}
            </strong>
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about our wines..."
          className="flex-1 p-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-red-900 shadow-sm"
        />
        <button type="submit" disabled={isLoading} className="bg-red-900 hover:bg-red-800 text-white p-3 rounded-lg transition disabled:opacity-50">
          {isLoading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
}

function VisionComponent() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const result = await analyzeLabel(base64);
        setData(result);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="text-center space-y-6 mt-4">
      <div className="bg-red-900 text-white p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-1">Scan Your Bottle</h2>
        <p className="text-red-100 text-sm opacity-90">Instant sommelier analysis</p>
      </div>

      <div className="border-2 border-dashed border-stone-300 rounded-xl p-10 hover:bg-stone-50 transition relative cursor-pointer group">
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="absolute inset-0 opacity-0 cursor-pointer z-20"
        />
        <div className="group-hover:scale-110 transition duration-300">
           <Camera className="mx-auto text-red-900 mb-2" size={48} />
        </div>
        <p className="text-stone-500 font-medium group-hover:text-red-900">Tap to take photo</p>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-2 mt-8">
            <Loader2 className="animate-spin text-red-900" size={32} />
            <span className="text-xs text-stone-400 animate-pulse">Analyzing vintage & region...</span>
        </div>
      )}

      {data && (
        <div className="bg-white p-6 rounded-xl shadow-xl text-left border-t-4 border-red-900 animate-in fade-in slide-in-from-bottom-4 mt-8">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-stone-900 leading-tight">{data.name}</h2>
            <span className="bg-red-100 text-red-900 text-xs font-bold px-2 py-1 rounded">{data.vintage}</span>
          </div>
          
          <p className="text-stone-500 mb-4 text-sm flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
            {data.region}
          </p>

          <div className="bg-red-50 p-3 rounded text-red-900 text-sm border border-red-100">
            <strong className="block text-xs uppercase mb-1 opacity-70">Suggested Pairing</strong> 
            {data.food_pairing}
          </div>
        </div>
      )}
    </div>
  );
}