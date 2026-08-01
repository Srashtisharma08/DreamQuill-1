import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, ArrowRight, Feather } from "lucide-react";
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
        <div className="container py-10 space-y-8 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-stone-900">
                        Your Story Library
                    </h1>
                    <p className="text-stone-500 font-serif text-sm mt-1">All your created stories and chapters in one place.</p>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/60 text-amber-900 text-xs font-semibold border border-amber-200/70">
                    <BookOpen className="h-4 w-4 text-amber-800" />
                    <span>{stories.length} {stories.length === 1 ? "Story" : "Stories"} Written</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => {
                    // Count how many chapters exist in the story
                    const chapterCount = (story.content.match(/--- Chapter/g) || []).length + 1;
                    return (
                        <Card key={story.id} className="group hover:-translate-y-1 transition-all duration-300 bg-white border-stone-200/90 shadow-sm hover:shadow-md hover:border-amber-200 rounded-2xl flex flex-col justify-between">
                            <CardHeader className="pb-3">
                                <div className="space-y-2">
                                    <CardTitle className="text-lg font-serif font-bold text-stone-900 line-clamp-2 group-hover:text-amber-900 transition-colors">
                                        {story.title}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2 text-xs">
                                        <span className="bg-amber-100/60 text-amber-900 font-semibold px-2.5 py-0.5 rounded-full border border-amber-200/60">
                                            {story.genre}
                                        </span>
                                        <span className="text-stone-300">•</span>
                                        <span className="flex items-center gap-1 text-stone-500 font-serif">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(story.createdAt).toLocaleDateString()}
                                        </span>
                                    </CardDescription>
                                    {chapterCount > 1 && (
                                        <span className="inline-flex items-center gap-1 text-xs text-stone-500 font-serif mt-1">
                                            <Feather className="h-3 w-3" />
                                            {chapterCount} chapters
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="py-2">
                                <p className="text-stone-600 line-clamp-4 text-sm font-serif leading-relaxed">
                                    {story.content.replace(/--- Chapter.+?---/g, '').trim()}
                                </p>
                            </CardContent>
                            <CardFooter className="pt-4 border-t border-stone-100">
                                <Link href={`/story/${story.id}`} className="w-full">
                                    <Button variant="ghost" size="sm" className="text-xs font-semibold text-amber-900 hover:text-stone-900 hover:bg-amber-100/60 w-full justify-between rounded-xl">
                                        <span>Read & Continue</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    );
                })}
                {stories.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4 bg-white border border-stone-200/80 rounded-3xl p-8">
                        <div className="h-12 w-12 rounded-2xl bg-amber-100/60 text-amber-900 flex items-center justify-center mx-auto border border-amber-200/60">
                            <Feather className="h-6 w-6 text-amber-800" />
                        </div>
                        <p className="text-xl font-serif font-bold text-stone-800">Your library is empty</p>
                        <p className="text-stone-500 text-sm font-serif max-w-sm mx-auto">Start creating stories on the home page. Each story is saved here and you can return to continue writing new chapters anytime.</p>
                        <Link href="/" className="inline-block pt-2">
                            <Button className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-medium rounded-xl">Start Writing</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
