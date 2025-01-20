export type Video = {
  id: string;
  name: string;
  description: string | null;
  video_url: string;
  status: 'processing' | 'ready' | 'error' | 'deleted';
};