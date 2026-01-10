"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="container py-10 max-w-2xl space-y-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                Settings
            </h1>

            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize how DreamQuill looks on your device.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Theme</span>
                        <div className="flex bg-black/20 p-1 rounded-lg">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-md bg-white/10"><Sun className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Monitor className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Moon className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle>Writing Preferences</CardTitle>
                    <CardDescription>Adjust default parameters for your stories.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div>
                            <div className="font-medium">Story Length</div>
                            <div className="text-xs text-muted-foreground">Default length for generated stories</div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="bg-transparent border-white/20">Short</Button>
                            <Button variant="secondary" size="sm">Medium</Button>
                            <Button variant="outline" size="sm" className="bg-transparent border-white/20">Long</Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <div>
                            <div className="font-medium">Creativity Level</div>
                            <div className="text-xs text-muted-foreground">How imaginative the AI should be</div>
                        </div>
                        <Button variant="outline" size="sm" className="bg-transparent border-white/20">Balanced</Button>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button>Save Changes</Button>
            </div>
        </div>
    );
}
