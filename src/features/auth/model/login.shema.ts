import * as z from 'zod';

export const loginSchema = z.object({
    email: z.email({ error: 'Invalid email' }),
    password: z
        .string()
        .min(1, { error: 'Введите пароль' })
        .min(3, { error: 'Password must be at least 3 characters' }),
    rememberMe: z.boolean().optional(),
    captcha: z.string().optional(),
});

export type LoginInputs = z.infer<typeof loginSchema>;
