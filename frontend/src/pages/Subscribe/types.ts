import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(7, "A senha deve ter pelo menos 7 caracteres.")
  .max(128, "A senha deve ter no máximo 128 caracteres.")
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
  .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula.")
  .regex(/[0-9]/, "A senha deve conter pelo menos um número.")
  .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial.")
  .refine((value) => !/\s/.test(value), "A senha não pode conter espaços.");

const subscribeSchema = z
.object({
    username: z.string()
        .min(5, "O usuário deve ter pelo menus 5 caracteres.")
        .max(30, "O usuário deve ter no máximo 30 caracteres."),
    name: z.string()
        .min(5, "O nome deve ter pelo menus 5 caracteres.")
        .max(125, "O nome deve ter no máximo 125 caracteres."),
    password: passwordSchema,
    passwordRepeat: passwordSchema
})
.refine(
    (data) => data.password === data.passwordRepeat, 
    {
        message: "As senhas não coincidem",
        path: ["passwordRepeat"]
    }
)

type SubscribeForm = z.infer<typeof subscribeSchema>;

export { subscribeSchema };
export type { SubscribeForm };

