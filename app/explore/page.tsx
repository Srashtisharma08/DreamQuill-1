import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Ghost, Rocket, Sword, Smile, Drama, Search, Coffee } from "lucide-react";
import Link from "next/link";

const genres = [
    { name: "Romance", icon: Heart, desc: "Love, longing, and emotional connections.", prompt: "Write a story about two rival bakers who fall in love during a competition.", color: "bg-rose-100/60 border-rose-200/60 text-rose-800" },
    { name: "Fantasy", icon: Sword, desc: "Magic, mythical creatures, and epic quests.", prompt: "A young wizard discovers a spell that can rewrite history.", color: "bg-violet-100/60 border-violet-200/60 text-violet-800" },
    { name: "Sci-Fi", icon: Rocket, desc: "Futuristic technology and space exploration.", prompt: "An AI wakes up 1000 years after humanity has vanished.", color: "bg-blue-100/60 border-blue-200/60 text-blue-800" },
    { name: "Horror", icon: Ghost, desc: "Fear, suspense, and the supernatural.", prompt: "A family moves into a house that reflects their darkest secrets.", color: "bg-stone-200/60 border-stone-300/60 text-stone-700" },
    { name: "Comedy", icon: Smile, desc: "Humor, satire, and lighthearted fun.", prompt: "A dog and a cat start a podcast about their owners.", color: "bg-yellow-100/60 border-yellow-200/60 text-yellow-800" },
    { name: "Drama", icon: Drama, desc: "Intense character development and raw conflict.", prompt: "A prodigy pianist loses their hearing before the biggest concert.", color: "bg-orange-100/60 border-orange-200/60 text-orange-800" },
    { name: "Thriller", icon: Search, desc: "Mystery, tension, and high stakes.", prompt: "A detective realizes the killer is contacting them from the future.", color: "bg-slate-100/60 border-slate-200/60 text-slate-700" },
    { name: "Slice of Life", icon: Coffee, desc: "Everyday experiences and quiet realism.", prompt: "A barista learns the stories of their regular customers.", color: "bg-amber-100/60 border-amber-200/60 text-amber-800" },
];

export default function ExplorePage() {
    return (
        <div className="container py-10 space-y-8 max-w-6xl mx-auto">
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-serif font-bold text-stone-900">
                    Explore Story Genres
                </h1>
                <p className="text-stone-500 font-serif">Choose a genre to discover instant story premises and inspiration.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {genres.map((genre) => (
                    <Card key={genre.name} className="group hover:-translate-y-1 transition-all duration-300 bg-white border-stone-200/90 shadow-sm hover:shadow-md hover:border-stone-300 rounded-2xl flex flex-col justify-between">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2.5 mb-1.5">
                                <div className={`h-9 w-9 rounded-xl flex items-center justify-center border ${genre.color} transition-colors`}>
                                    <genre.icon className="h-4 w-4" />
                                </div>
                                <CardTitle className="text-lg font-serif font-bold text-stone-900">{genre.name}</CardTitle>
                            </div>
                            <CardDescription className="text-stone-500 font-serif text-xs leading-relaxed">{genre.desc}</CardDescription>
                        </CardHeader>
                        <CardContent className="py-2">
                            <div className="bg-stone-50 border border-stone-100 p-3 rounded-xl text-xs font-serif italic text-stone-600 leading-relaxed">
                                "{genre.prompt}"
                            </div>
                        </CardContent>
                        <CardFooter className="pt-3">
                            <Link href={`/?prompt=${encodeURIComponent(genre.prompt)}`} className="w-full">
                                <Button variant="secondary" className="w-full text-xs font-semibold bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-200 rounded-xl">
                                    Write This Story
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
