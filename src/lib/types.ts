export type MediaType = "MOVIE" | "TV_SHOW"

export type CreditRole = "ACTOR" | "DIRECTOR"

export interface Movie {
  id: string
  title: string
  overview: string
  year: number
  durationMin: number
  rating: number
  type: MediaType
  posterUrl?: string
  backdropUrl?: string
  genres: Genre[]
  credits: Credit[]
  streamingUrls?: StreamingUrl[]
  featuredContent?: FeaturedContent
  heroSection?: HeroSection
  viewCount?: number
}

export interface Genre {
  id: string
  name: string
}

export interface Person {
  id: string
  name: string
  profileUrl?: string
}

export interface Credit {
  id: string
  movieId: string
  personId: string
  role: CreditRole
  character?: string
  person: Person
}

export interface User {
  id: string
  email: string
  name?: string
}

export interface StreamingUrl {
  id: string
  movieId: string
  url: string
  quality?: string
  platform?: string
  isActive: boolean
  createdAt: Date
}

export interface UserList {
  id: string
  userId: string
  movieId: string
  movie: Movie
}

export interface FeaturedContent {
  id: string
  movieId: string
  sequence: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface HeroSection {
  id: string
  movieId: string
  sequence: number
  isActive: boolean
  title?: string
  subtitle?: string
  createdAt: Date
  updatedAt: Date
}