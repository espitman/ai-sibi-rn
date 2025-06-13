import { z } from "zod";

export const ArtistSchema = z.object({
  id: z.number(),
  name: z.string(),
  avatar: z.string(),
  birth_day: z.number(),
  birth_month: z.number(),
  birth_year: z.number(),
  albums_count: z.number(),
  tracks_count: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ArtistResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  payload: ArtistSchema,
});

export type Artist = z.infer<typeof ArtistSchema>;
export type ArtistResponse = z.infer<typeof ArtistResponseSchema>; 