import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { generateStoryContinuation } from "@/lib/ai"

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const { storyId, followupPrompt } = await req.json()

        if (!storyId || !followupPrompt) {
            return NextResponse.json({ message: "Story ID and follow-up prompt are required." }, { status: 400 })
        }

        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized. Please sign in." }, { status: 401 })
        }

        const user = await db.user.findUnique({ where: { email: session.user.email } })
        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 })
        }

        const story = await db.story.findUnique({ where: { id: storyId } })
        if (!story || story.userId !== user.id) {
            return NextResponse.json({ message: "Story not found or unauthorized." }, { status: 404 })
        }

        const { updatedContent } = await generateStoryContinuation(
            story.content,
            story.title,
            followupPrompt,
            story.genre
        )

        const updatedStory = await db.story.update({
            where: { id: storyId },
            data: {
                content: updatedContent
            }
        })

        return NextResponse.json({
            title: updatedStory.title,
            content: updatedStory.content
        })
    } catch (error) {
        console.error("Story Continuation Error:", error)
        return NextResponse.json({
            message: error instanceof Error ? error.message : "Failed to continue story",
            details: String(error)
        }, { status: 500 })
    }
}
