export interface ArtistData {
  id: string;
  name: string;
  medium: string;
  bio: string;
  nationality?: string;
  birthYear?: number;
  imageUrl?: string;
  website?: string;
  style?: string;
}

// Gallery directory of contemporary and influential visual artists
export const ARTISTS_DATABASE: ArtistData[] = [
  // Contemporary Masters
  {
    id: '1',
    name: 'Yayoi Kusama',
    medium: 'Installation & Sculpture',
    bio: 'Known for infinity rooms and polka dot patterns, exploring themes of infinity and self-obliteration',
    nationality: 'Japanese',
    birthYear: 1929,
    style: 'Contemporary Art',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    name: 'Banksy',
    medium: 'Street Art',
    bio: 'Anonymous England-based street artist, political activist, and film director known for satirical works',
    nationality: 'British',
    style: 'Street Art',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    name: 'Kehinde Wiley',
    medium: 'Painting',
    bio: 'Portrait painter known for vibrant, large-scale depictions of African Americans',
    nationality: 'American',
    birthYear: 1977,
    style: 'Contemporary Portraiture',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop'
  },
  {
    id: '4',
    name: 'Anish Kapoor',
    medium: 'Sculpture',
    bio: 'British-Indian sculptor specializing in large-scale installations and public art',
    nationality: 'British-Indian',
    birthYear: 1954,
    style: 'Contemporary Sculpture',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
  },
  {
    id: '5',
    name: 'Kara Walker',
    medium: 'Installation & Silhouette',
    bio: 'American artist exploring race, gender, sexuality, and violence through silhouettes and installations',
    nationality: 'American',
    birthYear: 1969,
    style: 'Contemporary Installation',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
  },
  {
    id: '6',
    name: 'Jeff Koons',
    medium: 'Sculpture',
    bio: 'Known for large-scale reproductions of banal objects and balloon animals in stainless steel',
    nationality: 'American',
    birthYear: 1955,
    style: 'Neo-Pop',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop'
  },
  {
    id: '7',
    name: 'Ai Weiwei',
    medium: 'Installation & Activism',
    bio: 'Chinese contemporary artist and activist, known for politically charged sculptures and installations',
    nationality: 'Chinese',
    birthYear: 1957,
    style: 'Contemporary Activism',
    imageUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop'
  },
  {
    id: '8',
    name: 'Marina Abramović',
    medium: 'Performance Art',
    bio: 'Pioneer of performance art, exploring the relationship between performer and audience',
    nationality: 'Serbian',
    birthYear: 1946,
    style: 'Performance Art',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop'
  },
  {
    id: '9',
    name: 'Takashi Murakami',
    medium: 'Painting & Sculpture',
    bio: 'Japanese artist blending fine art and Japanese pop culture, known for colorful anime-inspired works',
    nationality: 'Japanese',
    birthYear: 1962,
    style: 'Superflat',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop'
  },
  {
    id: '10',
    name: 'Gerhard Richter',
    medium: 'Painting',
    bio: 'German visual artist known for abstract and photorealistic painted works',
    nationality: 'German',
    birthYear: 1932,
    style: 'Abstract & Photorealism',
    imageUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop'
  }
];

// Helper functions for database operations
export const getArtistById = (id: string): ArtistData | undefined => {
  return ARTISTS_DATABASE.find(artist => artist.id === id);
};

export const getArtistsByMedium = (medium: string): ArtistData[] => {
  return ARTISTS_DATABASE.filter(artist => 
    artist.medium.toLowerCase().includes(medium.toLowerCase())
  );
};

export const searchArtists = (query: string): ArtistData[] => {
  const lowerQuery = query.toLowerCase();
  return ARTISTS_DATABASE.filter(artist =>
    artist.name.toLowerCase().includes(lowerQuery) ||
    artist.medium.toLowerCase().includes(lowerQuery) ||
    (artist.style && artist.style.toLowerCase().includes(lowerQuery)) ||
    (artist.nationality && artist.nationality.toLowerCase().includes(lowerQuery)) ||
    artist.bio.toLowerCase().includes(lowerQuery)
  );
};

export const getAllArtists = (): ArtistData[] => {
  return ARTISTS_DATABASE;
};

// Get random subset of artists
export const getRandomArtists = (count: number): ArtistData[] => {
  const shuffled = [...ARTISTS_DATABASE].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};