"use client"

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { SendHorizonal } from "lucide-react";
import {createCommentAction} from "@/src/app/feed/[symbol]/_components/comments/actions"; // npm install lucide-react if needed

const commentSchema = z.object({
    body: z.string().min(1, "Comment cannot be empty").max(500),
});

interface CreateCommentFormProps {
    postId: string;
    ticker: string;
}

export default function CreateCommentForm({ postId, ticker }: CreateCommentFormProps) {
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof commentSchema>>({
        resolver: zodResolver(commentSchema),
        defaultValues: { body: "" },
    });

    const onSubmit = (values: z.infer<typeof commentSchema>) => {
        const formData = new FormData();
        formData.append("body", values.body);
        formData.append("postId", postId);
        formData.append("ticker", ticker);

        startTransition(async () => {
            await createCommentAction(null, formData);
            form.reset();
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2 mt-4">
                <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl>
                                <Input
                                    placeholder="Write a comment..."
                                    className="h-9 text-sm"
                                    autoComplete="off"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    size="sm"
                    disabled={isPending || !form.formState.isValid}
                    className="h-9 w-9 p-0"
                >
                    <SendHorizonal className="h-4 w-4" />
                </Button>
            </form>
        </Form>
    );
}