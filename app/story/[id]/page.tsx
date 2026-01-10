import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import Link from "next/link";
import { Story } from "@prisma/client";

export const dynamic = 'force-dynamic';

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.email) {
        redirect("/login");
    }

    const story: Story | null = await db.story.findUnique({
        where: {
            id: id
        },
        include: {
            user: true
        }
    });

    if (!story || story.user.email !== session.user.email) {
        return (
            <div className="container py-20 text-center space-y-4">
                <h1 className="text-2xl font-bold">Story not found</h1>
                <p className="text-muted-foreground">The story you are looking for does not exist or you do not have permission to view it.</p>
                <Link href="/library">
                    <Button>Back to Library</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="container py-10 max-w-4xl space-y-8">
            <Link href="/library">
                <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Library
                </Button>
            </Link>

            <Card className="overflow-hidden border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-2xl">
                <CardHeader className="bg-white/10 border-b border-white/10 text-center py-10">
                    <div className="space-y-4">
                        <div className="flex justify-center gap-2 text-sm text-muted-foreground uppercase tracking-widest">
                            <span>{story.genre}</span>
                            <span>•</span>
                            <span>{story.tone}</span>
                        </div>
                        <CardTitle className="text-4xl md:text-5xl font-serif bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent pb-2">
                            {story.title}
                        </CardTitle>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {story.createdAt.toLocaleDateString()}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 md:p-12 prose prose-lg dark:prose-invert max-w-none font-serif leading-relaxed text-lg">
                    {story.content.split('\n').map((paragraph: string, i: number) => (
                        <p key={i} className="mb-6 indent-8 text-primary-foreground/90">{paragraph}</p>
                    ))}
                </CardContent>
                <CardFooter className="bg-white/5 border-t border-white/10 flex justify-between p-6">
                    <div className="text-sm text-muted-foreground italic">
                        Prompt: "{story.prompt}"
                    </div>
                    {/* <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" /> Share
            </Button> */}
                </CardFooter>
            </Card>
        </div>
    );
}
