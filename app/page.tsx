import { StoryGenerator } from "@/components/story-generator";
import { Suspense } from "react";

export default async function Home({ searchParams }: { searchParams: Promise<{ prompt?: string }> }) {
  const { prompt } = await searchParams;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] space-y-12 py-10">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-indigo-200 drop-shadow-2xl">
            DreamQuill
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 font-light drop-shadow-md">
          Weave magical stories with the power of Artificial Intelligence.
          <br className="hidden md:block" /> Simply describe your dream, and watch it come to life.
        </p>
      </div>

      <Suspense>
        <StoryGenerator initialPrompt={prompt || ""} />
      </Suspense>

      {/* Footer / Info */}
      <div className="pt-20 text-center text-sm text-muted-foreground/50">
        <p>Running on Gemini AI • Powered by Vercel SDK</p>
      </div>
    </div>
  );
}
