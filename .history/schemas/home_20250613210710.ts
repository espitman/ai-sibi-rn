import { z } from "zod";

export const artistSchema = z.object({
  id: z.number(),
  name: z.string(),
  avatar: z.string().url(),
});

export const albumSchema = z.object({
  id: z.number(),
  title: z.string(),
  artist: z.object({
    id: z.number(),
    name: z.string(),
  }),
  cover: z.string().url(),
});

export const homeSchema = z.object({
  payload: z.object({
    favoriteArtists: z.array(artistSchema),
    recentAlbums: z.array(albumSchema),
    randomAlbums: z.array(albumSchema),
    mostPlayedAlbums: z.array(albumSchema),
  }),
});

export type HomeData = z.infer<typeof homeSchema>;
export type Artist = z.infer<typeof artistSchema>;
export type Album = z.infer<typeof albumSchema>; 