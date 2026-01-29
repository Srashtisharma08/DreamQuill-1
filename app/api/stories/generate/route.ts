import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { generateStory } from "@/lib/ai"

export const dynamic = 'force-dynamic'; 

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const { prompt, genre, tone } = await req.json()

        if (!prompt) {
            return NextResponse.json({ message: "Prompt is required" }, { status: 400 })
        }

        // Generate story using AI (or mock)
        const generatedStory = await generateStory(prompt, genre || "General", tone || "Neutral")

        // If user is logged in, save the story
        if (session?.user?.email) {
            const user = await db.user.findUnique({ where: { email: session.user.email } })
            if (user) {
                await db.story.create({
                    data: {
                        title: generatedStory.title,
                        content: generatedStory.content,
                        prompt,
                        genre: genre || "General",
                        tone: tone || "Neutral",
                        userId: user.id
                    }
                })
            }
        }

        return NextResponse.json(generatedStory)
    } catch (error) {
        console.error("Story Generation Error:", error)
        return NextResponse.json({
            message: error instanceof Error ? error.message : "Failed to generate story",
            details: String(error)
        }, { status: 500 })
    }
}
