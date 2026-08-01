"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Calendar, Sparkles, Loader2, BookOpen, PlusCircle } from "lucide-react"
import Link from "next/link"

interface StoryReaderProps {
    story: {
        id: string
        title: string
        genre: string
        tone: string
        prompt: string
        content: string
        createdAt: string
    }
}

export function StoryReaderView({ story: initialStory }: StoryReaderProps) {
    const [storyContent, setStoryContent] = useState(initialStory.content)
    const [followupPrompt, setFollowupPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleContinue = async () => {
        if (!followupPrompt.trim()) return
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/stories/continue", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    storyId: initialStory.id,
                    followupPrompt: followupPrompt.trim()
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Failed to add next chapter.")
            }

            setStoryContent(data.content)
            setFollowupPrompt("")
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container py-8 max-w-4xl space-y-6 mx-auto">
            <Link href="/library" className="inline-block">
                <Button variant="ghost" className="pl-2 text-stone-600 hover:text-stone-900 font-semibold hover:bg-stone-200/60 rounded-xl">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Library
                </Button>
            </Link>

            <Card className="overflow-hidden border-stone-200 bg-white shadow-md rounded-3xl">
                <CardHeader className="bg-stone-50/70 border-b border-stone-100 text-center py-10 px-8">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-900 uppercase tracking-wider bg-amber-100/70 px-3.5 py-1 rounded-full border border-amber-200/60">
                            <BookOpen className="h-3.5 w-3.5 text-amber-800" />
                            <span>{initialStory.genre} • {initialStory.tone}</span>
                        </div>
                        <CardTitle className="text-4xl md:text-5xl font-serif font-bold text-stone-900 pb-1">
                            {initialStory.title}
                        </CardTitle>
                        <div className="flex items-center justify-center gap-1.5 text-xs text-stone-400 font-serif">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(initialStory.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-8 md:p-12 font-serif text-lg leading-relaxed text-stone-800 space-y-4">
                    {storyContent.split('\n\n').map((paragraph, i) => {
                        if (paragraph.startsWith('--- Chapter')) {
                            return (
                                <div key={i} className="my-8 pt-6 border-t border-stone-200 text-center">
                                    <h3 className="text-xl font-serif font-bold text-amber-900 italic">{paragraph.replace(/---/g, '').trim()}</h3>
                                </div>
                            )
                        }
                        return (
                            <p key={i} className="text-stone-800 leading-relaxed indent-4">{paragraph}</p>
                        )
                    })}
                </CardContent>

                <CardFooter className="bg-stone-50/80 border-t border-stone-100 p-6 px-8 flex flex-col items-start gap-4">
                    <div className="text-xs text-stone-500 italic font-serif">
                        Original Premise: "{initialStory.prompt}"
                    </div>

                    {/* Follow-up Prompt Box for Chapter Continuation */}
                    <div className="w-full pt-4 border-t border-stone-200/80 space-y-3">
                        <label className="text-sm font-semibold text-stone-800 flex items-center gap-2">
                            <PlusCircle className="h-4 w-4 text-amber-800" />
                            <span>Continue Story / Write Follow-up Chapter</span>
                        </label>
                        <div className="flex gap-2">
                            <Input
                                value={followupPrompt}
                                onChange={(e) => setFollowupPrompt(e.target.value)}
                                placeholder="Enter follow-up prompt (e.g. Maya finds Julian's hidden letter the next morning...)"
                                className="bg-white border-stone-200 text-stone-900 rounded-xl focus-visible:ring-amber-700/60"
                                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                            />
                            <Button
                                className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-medium rounded-xl px-5 whitespace-nowrap"
                                onClick={handleContinue}
                                disabled={loading || !followupPrompt.trim()}
                            >
                                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : (
                                    <span className="flex items-center gap-1.5">Add Chapter <Sparkles className="h-4 w-4" /></span>
                                )}
                            </Button>
                        </div>
                        {error && <p className="text-xs text-rose-600 font-sans">{error}</p>}
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
