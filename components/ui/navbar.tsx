"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BookOpen, Compass, Home, LogOut, Settings, Sparkles } from "lucide-react"

export function Navbar() {
    const pathname = usePathname()
    const { data: session } = useSession()

    const routes = [
        {
            href: "/",
            label: "Home",
            icon: Home,
            active: pathname === "/",
        },
        {
            href: "/library",
            label: "Library",
            icon: BookOpen,
            active: pathname === "/library",
        },
        {
            href: "/explore",
            label: "Explore",
            icon: Compass,
            active: pathname === "/explore",
        },
        {
            href: "/settings",
            label: "Settings",
            icon: Settings,
            active: pathname === "/settings",
        }
    ]

    return (
        <nav className="border-b border-white/10 bg-black/20 backdrop-blur-lg mb-8 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                        DreamQuill
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-white flex items-center gap-2",
                                route.active ? "text-white font-bold" : "text-white/70"
                            )}
                        >
                            <route.icon className="h-4 w-4" />
                            {route.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {session ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground hidden sm:inline-block">
                                {session.user?.email}
                            </span>
                            <Button variant="ghost" size="icon" onClick={() => signOut()}>
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className="bg-primary hover:bg-primary/90">Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
