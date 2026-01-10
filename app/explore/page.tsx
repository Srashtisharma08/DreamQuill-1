import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Ghost, Rocket, Sword, Smile, Drama, Search, Coffee } from "lucide-react";
import Link from "next/link";

const genres = [
    { name: "Romance", icon: Heart, desc: "Love, passion, and emotional connections.", prompt: "Write a story about two rival bakers who fall in love during a competition." },
    { name: "Fantasy", icon: Sword, desc: "Magic, mythical creatures, and epic quests.", prompt: "A young wizard discovers a spell that can rewrite history." },
    { name: "Sci-Fi", icon: Rocket, desc: "Futuristic technology and space exploration.", prompt: "An AI wakes up 1000 years after humanity has vanished." },
    { name: "Horror", icon: Ghost, desc: "Fear, suspense, and the supernatural.", prompt: "A family moves into a house that reflects their darkest secrets." },
    { name: "Comedy", icon: Smile, desc: "Humor, satire, and lighthearted fun.", prompt: "A dog and a cat start a podcast about their owners." },
    { name: "Drama", icon: Drama, desc: "Intense character development and conflict.", prompt: "A prodigy pianist loses their hearing before the biggest concert." },
    { name: "Thriller", icon: Search, desc: "Mystery, tension, and high stakes.", prompt: "A detective realizes the killer is contacting them from the future." },
    { name: "Slice of Life", icon: Coffee, desc: "Everyday experiences and realism.", prompt: "A barista learns the stories of their regular customers." },
];

export default function ExplorePage() {
    return (
        <div className="container py-10 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-300 to-indigo-300 bg-clip-text text-transparent">
                    Explore Genres
                </h1>
                <p className="text-muted-foreground">Discover new worlds and inspiration.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {genres.map((genre) => (
                    <Card key={genre.name} className="group hover:-translate-y-1 transition-all duration-300 bg-white/5 border-white/10 hover:border-white/20 hover:shadow-xl">
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <genre.icon className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">{genre.name}</CardTitle>
                            </div>
                            <CardDescription>{genre.desc}</CardDescription>
                        </CardHeader>
                        <CardContent className="h-24">
                            <div className="bg-black/20 p-3 rounded-lg text-xs italic text-muted-foreground">
                                "{genre.prompt}"
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/?prompt=${encodeURIComponent(genre.prompt)}`} className="w-full">
                                <Button variant="secondary" className="w-full text-xs">Try this Genre</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
