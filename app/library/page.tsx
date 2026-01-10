import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Story } from "@prisma/client";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const stories: Story[] = await db.story.findMany({
        where: {
            user: {
                email: session.user.email
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="container py-10 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                    Your Library
                </h1>
                <p className="text-muted-foreground">{stories.length} Stories Collected</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                    <Card key={story.id} className="group hover:scale-105 transition-transform duration-300 bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl line-clamp-1">{story.title}</CardTitle>
                                    <CardDescription className="flex items-center gap-1 text-xs">
                                        <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full">{story.genre}</span>
                                        <span className="text-muted-foreground/60">•</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {story.createdAt.toLocaleDateString()}
                                        </span>
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground line-clamp-4 text-sm font-serif">
                                {story.content}
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t border-white/5 pt-4">
                            <Link href={`/story/${story.id}`} className="w-full">
                                <Button variant="ghost" size="sm" className="text-xs w-full justify-start">Read More</Button>
                            </Link>
                            {/* <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                </Button> */}
                        </CardFooter>
                    </Card>
                ))}
                {stories.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4 text-muted-foreground">
                        <p className="text-xl">No stories yet.</p>
                        <p>Start dreaming to fill your library.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
