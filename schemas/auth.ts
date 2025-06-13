import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  role: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  payload: z.object({
    token: z.string(),
    user: UserSchema,
  }),
});

export type User = z.infer<typeof UserSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type LoginRequest = {
  email: string;
  password: string;
}; 