"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BookOpen, Compass, Home, LogOut, Settings, Feather } from "lucide-react"

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
        <nav className="border-b border-stone-200/90 bg-stone-50/90 backdrop-blur-md mb-8 sticky top-0 z-50 shadow-2xs">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="h-9 w-9 rounded-xl bg-amber-100/70 flex items-center justify-center border border-amber-200/80 text-amber-800 transition-colors">
                        <Feather className="h-4.5 w-4.5 text-amber-800" />
                    </div>
                    <span className="text-2xl font-bold font-serif text-stone-900 tracking-tight">
                        DreamQuill
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-1.5">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm font-medium transition-all px-3.5 py-1.5 rounded-xl flex items-center gap-2",
                                route.active
                                    ? "text-stone-900 bg-amber-100/60 border border-amber-200/80 font-semibold shadow-2xs"
                                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
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
                            <span className="text-sm font-medium text-stone-600 hidden sm:inline-block">
                                {session.user?.email}
                            </span>
                            <Button variant="ghost" size="icon" onClick={() => signOut()} className="text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="text-stone-700 hover:bg-stone-200/60 rounded-xl">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className="bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-xl font-medium shadow-xs">Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
