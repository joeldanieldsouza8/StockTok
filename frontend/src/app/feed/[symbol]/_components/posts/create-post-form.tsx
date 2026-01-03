"use client"

import { useState, useTransition } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {createPostAction} from "@/src/app/feed/[symbol]/_components/posts/actions"; // Import the Server Action

// Zod Schema Definition
const formSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100),
    body: z.string().min(10, "Content must be at least 10 characters"),
});

interface CreatePostFormProps {
    symbol: string;
}

export default function CreatePostForm({ symbol }: CreatePostFormProps) {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition(); // Handle server action loading state

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: "", body: "" },
    });

    if (!user) {
        return (
            <div className="flex justify-end mb-4">
                <Button variant="ghost" disabled>Log in to post</Button>
            </div>
        );
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // Prepare FormData for Server Action
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("body", values.body);
        formData.append("ticker", symbol);

        startTransition(async () => {
            const result = await createPostAction(null, formData);

            if (result.success) {
                form.reset();
                setIsOpen(false);
            } else {
                form.setError("root", { message: result.message });
            }
        });
    };

    return (
        <div className="mb-6">
            <div className="flex justify-end mb-4">
                <Button onClick={() => setIsOpen(!isOpen)} variant={isOpen ? "outline" : "default"}>
                    {isOpen ? "Cancel" : "Create Post"}
                </Button>
            </div>

            {isOpen && (
                <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <CardHeader>
                        <CardTitle>Create Post for ${symbol}</CardTitle>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="space-y-4">
                                {form.formState.errors.root && (
                                    <div className="text-red-500 text-sm">{form.formState.errors.root.message}</div>
                                )}

                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Market Outlook..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="body"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Content</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="What's on your mind?" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Publishing..." : "Publish"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            )}
        </div>
    );
}