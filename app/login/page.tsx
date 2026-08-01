"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card"
import { Feather } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false
            })

            if (res?.error) {
                setError("Invalid email or password. Please try again.")
            } else {
                router.push("/")
                router.refresh()
            }
        } catch (error) {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[75vh]">
            <Card className="w-full max-w-md bg-white border-stone-200/90 shadow-md rounded-3xl p-2">
                <CardHeader className="text-center pb-2">
                    <div className="h-12 w-12 rounded-2xl bg-amber-100/70 flex items-center justify-center mx-auto mb-3 border border-amber-200/70">
                        <Feather className="h-5 w-5 text-amber-800" />
                    </div>
                    <CardTitle className="text-3xl font-serif font-bold text-stone-900">Welcome Back</CardTitle>
                    <p className="text-sm text-stone-500 font-serif">Sign in to continue your story journey</p>
                </CardHeader>
                <CardContent className="pt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-stone-700 font-serif">Email</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="dreamer@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-stone-700 font-serif">Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-rose-600 text-center font-serif">{error}</p>}

                        <Button className="w-full bg-stone-900 hover:bg-stone-800 text-stone-50 font-medium rounded-xl h-11 font-serif" type="submit" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center pt-2">
                    <p className="text-sm text-stone-500 font-serif">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-amber-800 font-semibold hover:underline">Sign up</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
