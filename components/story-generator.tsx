"use client"

import * as React from "react" 
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2, Sparkles, Copy, Share2, Check, BookOpen } from "lucide-react"

interface StoryGeneratorProps {
    initialPrompt?: string
}

export function StoryGenerator({ initialPrompt = "" }: StoryGeneratorProps) {
    const [prompt, setPrompt] = useState(initialPrompt)
    const [loading, setLoading] = useState(false)
    const [story, setStory] = useState<{ title: string; content: string } | null>(null)
    const [copied, setCopied] = useState(false)

    const handleGenerate = async () => {
        if (!prompt) return
        setLoading(true)
        setStory(null)

        try {
            const res = await fetch("/api/stories/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, genre: "Romance", tone: "Emotional" })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Failed to generate story")
            }

            if (!data.content) {
                throw new Error("Invalid response format")
            }

            setStory(data)
        } catch (error) {
            console.error(error)
            setStory({
                title: "Error",
                content: error instanceof Error ? error.message : "An unexpected error occurred."
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = () => {
        if (!story?.content) return
        navigator.clipboard.writeText(story.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            {/* Input Section */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                <div className="relative flex items-center">
                    <Input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your story idea... (e.g. Maya reunites with Kabir after years apart)"
                        className="pr-36 h-16 text-lg shadow-sm border-stone-200 bg-white/95 rounded-full px-8 text-stone-900 placeholder:text-stone-400 focus-visible:ring-amber-700/60"
                        onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    />
                    <div className="absolute right-2 top-2 bottom-2">
                        <Button
                            size="lg"
                            className="h-full rounded-full px-6 bg-stone-900 hover:bg-stone-800 text-stone-50 font-medium shadow-xs transition-all"
                            onClick={handleGenerate}
                            disabled={loading || !prompt}
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                                <span className="flex items-center gap-2">Write Story <Sparkles className="h-4 w-4" /></span>
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Output Section */}
            {story && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="overflow-hidden border-stone-200 bg-white shadow-md rounded-3xl">
                        <CardHeader className="bg-stone-50/60 border-b border-stone-100 p-8 text-center">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 text-amber-900 text-xs font-semibold mx-auto mb-3 border border-amber-200/60">
                                <BookOpen className="h-3.5 w-3.5" />
                                <span>Wattpad Chapter 1</span>
                            </div>
                            <CardTitle className="text-3xl md:text-4xl font-serif font-bold text-stone-900 pb-1">
                                {story.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 md:p-12 font-serif text-lg leading-relaxed text-stone-800">
                            {story.content ? (
                                story.content.split('\n\n').map((paragraph, i) => (
                                    <p key={i} className="mb-5 text-stone-800 leading-relaxed">{paragraph}</p>
                                ))
                            ) : (
                                <p className="text-rose-600 font-sans">No content generated.</p>
                            )}
                        </CardContent>
                        <CardFooter className="bg-stone-50/80 border-t border-stone-100 flex justify-between items-center p-4 px-8">
                            <span className="text-xs text-stone-400 font-serif">DreamQuill Story Studio</span>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={handleCopy} className="text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl">
                                    {copied ? <Check className="h-4 w-4 mr-2 text-emerald-600" /> : <Copy className="h-4 w-4 mr-2" />}
                                    {copied ? "Copied!" : "Copy"}
                                </Button>
                                <Button variant="ghost" size="sm" className="text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl">
                                    <Share2 className="h-4 w-4 mr-2" /> Share
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            )}
        </div>
    )
}
