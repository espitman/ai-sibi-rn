import { z } from 'zod';

export const TrackSchema = z.object({
  id: z.number(),
  title: z.string(),
  duration: z.number(),
  track_number: z.number(),
  url: z.string(),
  album_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Track = z.infer<typeof TrackSchema>;

export const TracksResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  payload: z.array(TrackSchema),
});

export type TracksResponse = z.infer<typeof TracksResponseSchema>; 