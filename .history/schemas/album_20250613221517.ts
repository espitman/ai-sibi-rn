import { z } from "zod";
import { ArtistSchema } from "./artist";

export const AlbumSchema = z.object({
  id: z.number(),
  title: z.string(),
  artist_id: z.number(),
  artist: ArtistSchema.optional(),
  release_year: z.number(),
  genre: z.string(),
  cover: z.string(),
  duration: z.number(),
  tracks_count: z.number(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const ArtistAlbumsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  payload: z.array(AlbumSchema),
});

export type Album = z.infer<typeof AlbumSchema>;
export type ArtistAlbumsResponse = z.infer<typeof ArtistAlbumsResponseSchema>; 