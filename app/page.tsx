import { StoryGenerator } from "@/components/story-generator";
import { Suspense } from "react";

export default async function Home({ searchParams }: { searchParams: Promise<{ prompt?: string }> }) {
  const { prompt } = await searchParams;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] space-y-10 py-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl animate-in fade-in duration-500">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 tracking-tight">
          Craft Stories That <span className="italic text-amber-800 font-normal">Connect & Stay</span> With You
        </h1>
        <p className="text-lg md:text-xl text-stone-600 font-serif leading-relaxed">
          Bring your characters, settings, and ideas to life.
          <br className="hidden md:block" /> Describe a premise, and read a story filled with heart and emotion.
        </p>
      </div>

      <Suspense>
        <StoryGenerator initialPrompt={prompt || ""} />
      </Suspense>

      {/* Footer */}
      <div className="pt-12 text-center text-xs text-stone-400 font-serif">
        <p>DreamQuill Studio • Bingeable & Comforting Storytelling</p>
      </div>
    </div>
  );
}
