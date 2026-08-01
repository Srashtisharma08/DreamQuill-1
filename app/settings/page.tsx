"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor, Feather } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="container py-10 max-w-2xl space-y-8 mx-auto">
            <div>
                <h1 className="text-4xl font-serif font-bold text-stone-900">
                    Settings
                </h1>
                <p className="text-stone-500 font-serif text-sm mt-1">Manage workspace appearance and story engine preferences.</p>
            </div>

            <Card className="bg-white border-stone-200/90 shadow-sm rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl font-serif font-bold text-stone-900">Appearance</CardTitle>
                    <CardDescription className="text-stone-500 font-serif">Customize how DreamQuill looks on your device.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-stone-700 font-serif">Theme</span>
                        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg bg-white shadow-xs text-amber-800 border border-stone-200">
                                <Sun className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-stone-500 hover:text-stone-900">
                                <Monitor className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-stone-500 hover:text-stone-900">
                                <Moon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white border-stone-200/90 shadow-sm rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
                        <Feather className="h-5 w-5 text-amber-800" />
                        <span>Story Engine Preferences</span>
                    </CardTitle>
                    <CardDescription className="text-stone-500 font-serif">Adjust default narrative parameters for your stories.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                        <div>
                            <div className="font-medium text-stone-800 text-sm font-serif">Story Depth</div>
                            <div className="text-xs text-stone-400 font-serif">Target emotional depth for generated narratives</div>
                        </div>
                        <div className="flex gap-1.5">
                            <Button variant="outline" size="sm" className="border-stone-200 text-xs text-stone-600 rounded-lg font-serif">Short</Button>
                            <Button size="sm" className="bg-stone-900 text-stone-50 font-medium text-xs rounded-lg font-serif">Full Story</Button>
                            <Button variant="outline" size="sm" className="border-stone-200 text-xs text-stone-600 rounded-lg font-serif">Novel</Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <div>
                            <div className="font-medium text-stone-800 text-sm font-serif">Writing Style</div>
                            <div className="text-xs text-stone-400 font-serif">Wattpad-style character-driven narratives</div>
                        </div>
                        <Button variant="outline" size="sm" className="border-amber-200 bg-amber-100/60 text-amber-900 font-semibold text-xs rounded-lg font-serif">
                            Wattpad Mode
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-medium rounded-xl px-6">Save Changes</Button>
            </div>
        </div>
    );
}
