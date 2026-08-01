import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { StoryReaderView } from "@/components/story-reader-view";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.email) {
        redirect("/login");
    }

    const currentUser = await db.user.findUnique({
        where: { email: session.user.email }
    });

    if (!currentUser) {
        redirect("/login");
    }

    const story = await db.story.findUnique({
        where: { id }
    });

    if (!story || story.userId !== currentUser.id) {
        return (
            <div className="container py-20 text-center space-y-4 max-w-md mx-auto">
                <h1 className="text-2xl font-serif font-bold text-stone-900">Story not found</h1>
                <p className="text-stone-500 text-sm font-serif">The story you are looking for does not exist or you do not have permission to view it.</p>
                <Link href="/library">
                    <Button className="bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-xl font-medium">Back to Library</Button>
                </Link>
            </div>
        );
    }

    return (
        <StoryReaderView
            story={{
                id: story.id,
                title: story.title,
                genre: story.genre,
                tone: story.tone,
                prompt: story.prompt,
                content: story.content,
                createdAt: story.createdAt.toISOString()
            }}
        />
    );
}
