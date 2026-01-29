export interface Artist {
  id: string;
  name: string;
  medium: string; // e.g., "Painting", "Sculpture", "Digital Art"
  bio: string;
  nationality?: string;
  birthYear?: number;
  imageUrl?: string; // Artist portrait or signature artwork
  website?: string;
  style?: string; // e.g., "Abstract", "Contemporary", "Realism"
}
