import { z } from 'zod';

const loginSchema = z
.object({
    username: z.string()
    .min(5, "O usuário deve ter pelo menus 5 caracteres.")
    .max(30, "O usuário deve ter no máximo 30 caracteres."),
    password: z.string()
        .min(7, "A senha deve ter pelo menos 7 caracteres.")
        .max(128, "A senha deve ter no máximo 128 caracteres.")
});

type LoginForm = z.infer<typeof loginSchema>;

export { loginSchema };
export type { LoginForm };

