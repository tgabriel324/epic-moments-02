import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Video } from "@/types/video";

type VideoPreviewDialogProps = {
  video: Video | null;
  onClose: () => void;
};

export function VideoPreviewDialog({ video, onClose }: VideoPreviewDialogProps) {
  return (
    <Dialog open={!!video} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{video?.name}</DialogTitle>
        </DialogHeader>
        {video && (
          <div className="aspect-video w-full">
            <video
              src={video.video_url}
              controls
              className="w-full h-full"
            >
              Seu navegador não suporta a reprodução de vídeos.
            </video>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}