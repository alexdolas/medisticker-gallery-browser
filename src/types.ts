
export interface StickerData {
  id: string;          // Unique identifier
  filename: string;    // Original filename (e.g., "6_6.png")
  tags: string[];      // Array of tags associated with this sticker
  url: string;         // URL to the sticker image
  category?: string;   // Optional primary category
}

export interface StickerContextType {
  stickers: StickerData[];
  filteredStickers: StickerData[];
  searchTerm: string;
  selectedTags: string[];
  recentStickers: StickerData[];
  allTags: string[];
  popularTags: string[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  setSearchTerm: (term: string) => void;
  addSelectedTag: (tag: string) => void;
  removeSelectedTag: (tag: string) => void;
  clearSelectedTags: () => void;
  trackStickerUsage: (sticker: StickerData) => void;
}

export type ActionType = 
  | { type: 'SET_STICKERS'; payload: StickerData[] }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'ADD_SELECTED_TAG'; payload: string }
  | { type: 'REMOVE_SELECTED_TAG'; payload: string }
  | { type: 'CLEAR_SELECTED_TAGS' }
  | { type: 'TRACK_STICKER_USAGE'; payload: StickerData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };
