import { z } from 'zod';

export const formSchema = z.object({
	task: z.string().min(2, { message: 'Task is required' }).max(50)
});

export type FormSchema = typeof formSchema;
