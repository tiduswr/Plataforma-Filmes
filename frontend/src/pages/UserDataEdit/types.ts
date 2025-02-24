import { z } from 'zod';

import { passwordSchema } from "@/pages/Subscribe/types";

const userEditSchema = z
  .object({
    username: z
      .union([z.string().min(5).max(30), z.literal("")])
      .nullish(),
    name: z
      .union([z.string().min(5).max(125), z.literal("")])
      .nullish(),
    password: z
      .union([passwordSchema, z.literal("")])
      .nullish(),
    passwordRepeat: z
      .union([passwordSchema, z.literal("")])
      .nullish(),
  })
  .refine(
    ({ password, passwordRepeat }) => {
      if (!password && !passwordRepeat) {
        return true;
      }
      return password === passwordRepeat;
    },
    {
      message: "As senhas não coincidem",
      path: ["passwordRepeat"],
    }
  );

interface UserEditResponse {
    user_id: string;
    username: string;
    name: string;
}

type UserEditForm = z.infer<typeof userEditSchema>;

export { userEditSchema };
export type { UserEditForm, UserEditResponse };

