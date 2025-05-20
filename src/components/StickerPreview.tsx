
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { StickerData } from '../types';
import { useStickers } from '../contexts/StickersContext';
import { Copy, Download, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

interface StickerPreviewProps {
  sticker: StickerData;
  onClose: () => void;
}

const StickerPreview: React.FC<StickerPreviewProps> = ({ sticker, onClose }) => {
  const { trackStickerUsage } = useStickers();
  const { toast } = useToast();
  
  const copyToClipboard = async () => {
    try {
      const response = await fetch(sticker.url);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      
      trackStickerUsage(sticker);
      toast({
        title: "Copied!",
        description: `${sticker.filename} copied to clipboard`,
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to copy image: ', error);
      toast({
        title: "Failed to copy",
        description: "Could not copy the sticker to clipboard",
        variant: "destructive",
      });
    }
  };
  
  const downloadSticker = () => {
    const link = document.createElement('a');
    link.href = sticker.url;
    link.download = sticker.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    trackStickerUsage(sticker);
    toast({
      title: "Downloaded!",
      description: `${sticker.filename} downloaded successfully`,
      duration: 2000,
    });
  };
  
  const copyUrl = () => {
    navigator.clipboard.writeText(sticker.url);
    toast({
      title: "URL Copied!",
      description: "Sticker URL copied to clipboard",
      duration: 2000,
    });
  };
  
  return (
    <Dialog open={!!sticker} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{sticker.filename}</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
              <X size={16} />
            </Button>
          </DialogTitle>
          <DialogDescription>
            {sticker.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-medical-100 text-medical-800 mr-2">
                {sticker.category}
              </span>
            )}
            Category: {sticker.category || 'Uncategorized'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md">
          <img 
            src={sticker.url} 
            alt={sticker.tags.join(', ')} 
            className="max-w-full max-h-[300px] object-contain"
          />
        </div>
        
        <div className="mt-2">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Tags:</h4>
          <div className="flex flex-wrap gap-1">
            {sticker.tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <DialogFooter className="sm:justify-start gap-2 mt-4">
          <Button onClick={copyToClipboard} className="bg-medical-600 hover:bg-medical-700">
            <Copy size={16} className="mr-2" />
            Copy to Clipboard
          </Button>
          <Button onClick={downloadSticker} variant="outline">
            <Download size={16} className="mr-2" />
            Download
          </Button>
          <Button onClick={copyUrl} variant="ghost">
            Copy URL
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StickerPreview;
