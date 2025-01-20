import { Button } from "@/components/ui/button";
import { Play, Pencil, Trash2, Link } from "lucide-react";
import { Video } from "@/types/video";
import { useCdn } from "@/hooks/useCdn";

type VideoCardProps = {
  video: Video;
  onPlay: (video: Video) => void;
  onEdit: (video: Video) => void;
  onDelete: (video: Video) => void;
  onLink: (video: Video) => void;
};

export function VideoCard({ video, onPlay, onEdit, onDelete, onLink }: VideoCardProps) {
  const { data: cdnUrl, isLoading } = useCdn(video.video_url);

  return (
    <div className="group relative rounded-lg border bg-card p-4 hover:shadow-lg transition-all">
      <div className="aspect-video bg-muted rounded-md mb-3 overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onPlay(video)}
          >
            <Play className="h-8 w-8" />
          </Button>
        </div>
        {!isLoading && (
          <video
            src={cdnUrl || video.video_url}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold line-clamp-1">{video.name}</h3>
          {video.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {video.description}
            </p>
          )}
          <div className="mt-2 text-xs text-muted-foreground">
            Status: {video.status}
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onLink(video)}
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onEdit(video)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onDelete(video)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}