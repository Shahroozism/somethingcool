import { Artist } from '../types/Artist';
import { ARTISTS_DATABASE, searchArtists, getAllArtists } from '../data/artistsDatabase';

class ArtistService {
  // Get all featured artists
  getFeaturedArtists(): Artist[] {
    return getAllArtists().map(data => ({
      id: data.id,
      name: data.name,
      medium: data.medium,
      bio: data.bio,
      nationality: data.nationality,
      birthYear: data.birthYear,
      imageUrl: data.imageUrl,
      website: data.website,
      style: data.style
    }));
  }

  // Search artists by name, medium, style, or nationality
  searchArtists(query: string): Artist[] {
    if (!query.trim()) {
      return this.getFeaturedArtists();
    }

    return searchArtists(query).map(data => ({
      id: data.id,
      name: data.name,
      medium: data.medium,
      bio: data.bio,
      nationality: data.nationality,
      birthYear: data.birthYear,
      imageUrl: data.imageUrl,
      website: data.website,
      style: data.style
    }));
  }

  // Get total number of artists in database
  getTotalArtistCount(): number {
    return ARTISTS_DATABASE.length;
  }

  // Get artist by ID
  getArtistById(id: string): Artist | undefined {
    const data = ARTISTS_DATABASE.find(a => a.id === id);
    if (!data) return undefined;

    return {
      id: data.id,
      name: data.name,
      medium: data.medium,
      bio: data.bio,
      nationality: data.nationality,
      birthYear: data.birthYear,
      imageUrl: data.imageUrl,
      website: data.website,
      style: data.style
    };
  }
}

export const artistService = new ArtistService();
