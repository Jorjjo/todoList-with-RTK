import * as z from 'zod';

export const loginSchema = z.object({
    email: z.email({ error: 'Invalid email' }),
    password: z.string().min(1, { error: 'Введите пароль' }),
    rememberMe: z.boolean(),
});

export type LoginInputs = z.infer<typeof loginSchema>;
