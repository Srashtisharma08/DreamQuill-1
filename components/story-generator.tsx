"use client"

import * as React from "react" 
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2, Sparkles, Send, Copy, Share2 } from "lucide-react"

interface StoryGeneratorProps {
    initialPrompt?: string
}

export function StoryGenerator({ initialPrompt = "" }: StoryGeneratorProps) {
    const [prompt, setPrompt] = useState(initialPrompt)
    const [loading, setLoading] = useState(false)
    const [story, setStory] = useState<{ title: string; content: string } | null>(null)

    const handleGenerate = async () => {
        if (!prompt) return
        setLoading(true)
        setStory(null)

        try {
            const res = await fetch("/api/stories/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, genre: "Fantasy", tone: "Dreamy" })
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
            // Ideally show a toast here, for now using story object to show error
            setStory({
                title: "Error",
                content: error instanceof Error ? error.message : "An unexpected error occurred."
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            {/* Input Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                <div className="relative flex items-center">
                    <Input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your story idea... (e.g. A robot who learns to dream)"
                        className="pr-32 h-16 text-lg shadow-2xl border-white/20 bg-white/10 backdrop-blur-md rounded-full px-8"
                        onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    />
                    <div className="absolute right-2 top-2 bottom-2">
                        <Button
                            size="lg"
                            className="h-full rounded-full px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg"
                            onClick={handleGenerate}
                            disabled={loading || !prompt}
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                                <span className="flex items-center gap-2">Generate <Sparkles className="h-4 w-4" /></span>
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Output Section */}
            {story && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="overflow-hidden border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-2xl">
                        <CardHeader className="bg-white/10 border-b border-white/10">
                            <CardTitle className="text-3xl text-center font-serif bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                                {story.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 prose prose-lg dark:prose-invert max-w-none font-serif leading-relaxed">
                            {story.content ? (
                                story.content.split('\n').map((paragraph, i) => (
                                    <p key={i} className="mb-4 text-primary-foreground/90">{paragraph}</p>
                                ))
                            ) : (
                                <p className="text-destructive">No content generated.</p>
                            )}
                        </CardContent>
                        <CardFooter className="bg-white/5 border-t border-white/10 flex justify-end gap-2 p-4">
                            <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(story.content)}>
                                <Copy className="h-4 w-4 mr-2" /> Copy
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4 mr-2" /> Share
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            )}
        </div>
    )
}
