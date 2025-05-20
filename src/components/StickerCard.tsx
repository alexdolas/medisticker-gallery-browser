
import React, { useState } from 'react';
import { useStickers } from '../contexts/StickersContext';
import { StickerData } from '../types';
import { Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StickerCardProps {
  sticker: StickerData;
  onClick: (sticker: StickerData) => void;
}

const StickerCard: React.FC<StickerCardProps> = ({ sticker, onClick }) => {
  const { trackStickerUsage } = useStickers();
  const { toast } = useToast();
  const [isHovering, setIsHovering] = useState(false);
  
  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
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
  
  const downloadSticker = (e: React.MouseEvent) => {
    e.stopPropagation();
    
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
  
  return (
    <div
      className="relative bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onClick(sticker)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="w-full aspect-square flex items-center justify-center p-2">
        <img
          src={sticker.url}
          alt={sticker.tags.join(', ')}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      
      {/* Actions overlay */}
      <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={copyToClipboard}
          className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100"
          title="Copy to clipboard"
        >
          <Copy size={14} className="text-medical-700" />
        </button>
        <button
          onClick={downloadSticker}
          className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100"
          title="Download sticker"
        >
          <Download size={14} className="text-medical-700" />
        </button>
      </div>
      
      {/* Tags tooltip on hover */}
      {isHovering && sticker.tags.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          {sticker.tags.slice(0, 3).join(', ')}
          {sticker.tags.length > 3 && '...'}
        </div>
      )}
    </div>
  );
};

export default StickerCard;
