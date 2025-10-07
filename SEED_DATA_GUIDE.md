# Seed Data Generation Guide

This guide explains how to generate seed data for the Mini Netflix application, including movies, TV shows, genres, and people.

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Seed Data Structure](#seed-data-structure)
- [Running Seed Scripts](#running-seed-scripts)
- [Generating New Seed Data](#generating-new-seed-data)
- [Seed Data Files](#seed-data-files)

## Overview

The application uses JSON files to seed the database with initial data. The seed data includes:
- **Genres**: Movie and TV show categories
- **People**: Actors, directors, and writers
- **Movies**: Feature films with streaming URLs
- **TV Shows**: Series with seasons, episodes, and streaming URLs

## Prerequisites

Before seeding the database:

1. Ensure your database is set up and running
2. Run Prisma migrations:
   ```bash
   pnpm prisma migrate dev
   ```
3. Generate Prisma client:
   ```bash
   pnpm prisma generate
   ```

## Seed Data Structure

### Directory Structure
```
src/seed/
├── genres.json           # Genre definitions
├── people.json           # Actors, directors, writers
├── movies.json           # Feature films
├── tv-shows.json         # TV series
├── additional-movies.json # Extra movies
└── movie-series.json     # Movie franchises/series
```

## Running Seed Scripts

### Seed All Data (Movies, Genres, People)
```bash
pnpm seed
```
This runs `src/scripts/seed.ts` which seeds:
- Genres
- People
- Movies with their credits and streaming URLs

### Seed TV Shows
```bash
pnpm tsx src/scripts/seed-tv-shows.ts
```
This seeds TV shows with seasons and episodes.

### Seed Movie Series
```bash
pnpm tsx src/scripts/seed-movie-series.ts
```
This seeds movie franchises/series.

## Generating New Seed Data

### Using AI (Claude, ChatGPT, etc.)

You can use AI assistants to generate seed data in the correct format. Here are detailed prompts for each type:

---

### 1. Generate Movies Seed Data

**Prompt:**
```
Generate a JSON array of 20 popular movies for a Netflix-style streaming platform. For each movie, include:

1. title: Movie title
2. overview: A compelling 2-3 sentence description
3. year: Release year
4. durationMin: Runtime in minutes
5. rating: IMDb-style rating (0-10, one decimal)
6. posterUrl: Use TMDB image URL format: https://image.tmdb.org/t/p/w500/[poster_path]
7. backdropUrl: Use TMDB image URL format: https://image.tmdb.org/t/p/original/[backdrop_path]
8. tmdbId: Actual TMDB ID for the movie

Format the output as a valid JSON array. Include a mix of recent blockbusters, classics, and critically acclaimed films across various genres (action, drama, comedy, sci-fi, horror, thriller).

Example format:
[
  {
    "title": "Inception",
    "overview": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    "year": 2010,
    "durationMin": 148,
    "rating": 8.8,
    "posterUrl": "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    "tmdbId": 27205
  }
]
```

---

### 2. Generate TV Shows Seed Data

**Prompt:**
```
Generate a JSON array of 10 popular TV shows for a Netflix-style streaming platform. For each TV show, include:

1. title: Show title
2. overview: A compelling 2-3 sentence description
3. year: First air year
4. rating: IMDb-style rating (0-10, one decimal)
5. posterUrl: Use TMDB image URL format: https://image.tmdb.org/t/p/w500/[poster_path]
6. backdropUrl: Use TMDB image URL format: https://image.tmdb.org/t/p/original/[backdrop_path]
7. tmdbId: Actual TMDB ID for the TV show
8. totalSeasons: Number of seasons (1-10)
9. episodesPerSeason: Average episodes per season (6-22)

The seeding script will automatically generate seasons and episodes with streaming URLs using the pattern:
- https://vidsrc.xyz/embed/tv/{tmdbId}/{season}/{episode}
- https://vidsrc.to/embed/tv/{tmdbId}/{season}/{episode}

Include popular shows across genres (drama, comedy, sci-fi, crime, fantasy).

Example format:
[
  {
    "title": "Breaking Bad",
    "overview": "A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family's future as he battles terminal cancer.",
    "year": 2008,
    "rating": 9.5,
    "posterUrl": "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    "tmdbId": 1396,
    "totalSeasons": 5,
    "episodesPerSeason": 13
  }
]
```

---

### 3. Generate Genres Seed Data

**Prompt:**
```
Generate a JSON array of movie/TV show genres for a streaming platform. Include:

1. name: Genre name
2. slug: URL-friendly version (lowercase, hyphenated)

Include 15-20 genres covering all major categories.

Example format:
[
  {
    "name": "Action",
    "slug": "action"
  },
  {
    "name": "Science Fiction",
    "slug": "science-fiction"
  }
]
```

---

### 4. Generate People (Actors/Directors) Seed Data

**Prompt:**
```
Generate a JSON array of 30 famous actors, directors, and writers for a movie database. For each person, include:

1. name: Full name
2. profileUrl: Use TMDB image URL format: https://image.tmdb.org/t/p/w500/[profile_path]
3. tmdbId: Actual TMDB ID for the person

Include a diverse mix of:
- 15 popular actors (male and female)
- 10 renowned directors
- 5 acclaimed writers/screenwriters

Example format:
[
  {
    "name": "Leonardo DiCaprio",
    "profileUrl": "https://image.tmdb.org/t/p/w500/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
    "tmdbId": 6193
  }
]
```

---

### 5. Generate Movie Series/Franchises Seed Data

**Prompt:**
```
Generate a JSON array of 5 popular movie franchises/series. For each movie in the series, include:

1. title: Movie title (with series identifier, e.g., "The Matrix Reloaded")
2. overview: A compelling 2-3 sentence description
3. year: Release year
4. durationMin: Runtime in minutes
5. rating: IMDb-style rating (0-10, one decimal)
6. posterUrl: Use TMDB image URL format
7. backdropUrl: Use TMDB image URL format
8. tmdbId: Actual TMDB ID
9. seriesName: Name of the franchise (e.g., "The Matrix Trilogy")
10. seriesOrder: Position in the series (1, 2, 3, etc.)

Include franchises like Marvel, DC, Star Wars, Harry Potter, Lord of the Rings, etc.

Example format:
[
  {
    "title": "The Matrix",
    "overview": "A computer hacker learns about the true nature of reality and his role in the war against its controllers.",
    "year": 1999,
    "durationMin": 136,
    "rating": 8.7,
    "posterUrl": "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    "tmdbId": 603,
    "seriesName": "The Matrix Trilogy",
    "seriesOrder": 1
  }
]
```

---

## How to Use Generated Data

### Step 1: Generate Data Using AI
1. Copy one of the prompts above
2. Paste into your AI assistant (Claude, ChatGPT, etc.)
3. Review and validate the generated JSON

### Step 2: Save to JSON Files
Save the generated data to the appropriate file:
- Movies → `src/seed/movies.json` or `src/seed/additional-movies.json`
- TV Shows → `src/seed/tv-shows.json`
- Genres → `src/seed/genres.json`
- People → `src/seed/people.json`
- Movie Series → `src/seed/movie-series.json`

### Step 3: Update Seed Scripts (if needed)

If you're adding new data types, update the relevant seed script:

**For Movies** (`src/scripts/seed.ts`):
```typescript
// Add genre mapping logic
const genreMapping: Record<number, string[]> = {
  27205: ['sci-fi', 'action', 'thriller'], // Inception
  // Add more mappings
}

// Add credits mapping
const creditsMapping: Record<number, any[]> = {
  27205: [ // Inception
    { personId: leonardoId, role: 'ACTOR', character: 'Cobb' },
    { personId: nolanId, role: 'DIRECTOR' },
  ],
  // Add more mappings
}
```

**For TV Shows** (`src/scripts/seed-tv-shows.ts`):
```typescript
// Add genre mapping
const tvGenreMapping: Record<number, string[]> = {
  1396: ['crime', 'drama', 'thriller'], // Breaking Bad
  // Add more mappings
}
```

### Step 4: Run Seed Scripts
```bash
# Seed movies, genres, and people
pnpm seed

# Seed TV shows
pnpm tsx src/scripts/seed-tv-shows.ts

# Seed movie series
pnpm tsx src/scripts/seed-movie-series.ts
```

## Seed Data Files

### movies.json
Contains the main collection of movies with:
- Basic information (title, overview, year, duration)
- Rating and TMDB ID
- Image URLs (poster, backdrop)

### tv-shows.json
Contains TV series with:
- Show information
- Number of seasons and episodes
- TMDB ID for generating streaming URLs

### genres.json
Contains genre definitions:
- Genre name
- URL-friendly slug

### people.json
Contains cast and crew:
- Actor/Director/Writer names
- Profile images
- TMDB IDs

### additional-movies.json
Extra movies to expand the catalog.

### movie-series.json
Movie franchises with series ordering.

## Streaming URLs

The application uses two streaming providers:

### For Movies:
- `https://vidsrc.xyz/embed/movie/{tmdbId}`
- `https://vidsrc.to/embed/movie/{tmdbId}`

### For TV Shows:
- `https://vidsrc.xyz/embed/tv/{tmdbId}/{season}/{episode}`
- `https://vidsrc.to/embed/tv/{tmdbId}/{season}/{episode}`

These URLs are automatically generated during seeding based on the TMDB IDs.

## Tips for Quality Seed Data

1. **Use Real TMDB IDs**: This ensures streaming URLs work correctly
2. **Validate JSON**: Use a JSON validator before saving
3. **Diverse Content**: Include various genres, years, and ratings
4. **Accurate Metadata**: Double-check release years and ratings
5. **Quality Images**: Use high-resolution poster and backdrop URLs
6. **Consistent Formatting**: Follow the exact structure in examples

## Troubleshooting

### Seed Script Fails
- Check database connection
- Ensure migrations are up to date
- Validate JSON syntax
- Check for duplicate TMDB IDs

### Missing Streaming URLs
- Verify TMDB IDs are correct
- Check if movie/show exists on streaming providers

### Genre/People Not Found
- Ensure genres.json and people.json are seeded first
- Check slug/name matching in mapping objects

## Example Workflow

Here's a complete workflow for adding new content:

```bash
# 1. Generate data using AI prompts (copy prompts from above)

# 2. Save generated JSON to files
# - Save to src/seed/movies.json, src/seed/tv-shows.json, etc.

# 3. Update seed scripts with genre and credits mappings
# - Edit src/scripts/seed.ts for movies
# - Edit src/scripts/seed-tv-shows.ts for TV shows

# 4. Reset database (optional, for clean slate)
pnpm prisma migrate reset --force

# 5. Run seeds
pnpm seed                              # Seed movies, genres, people
pnpm tsx src/scripts/seed-tv-shows.ts  # Seed TV shows
pnpm tsx src/scripts/seed-movie-series.ts # Seed movie series

# 6. Verify in browser
# Visit http://localhost:3000
```

## Additional Resources

- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [Prisma Seeding Guide](https://www.prisma.io/docs/guides/database/seed-database)
- [VidSrc Streaming Service](https://vidsrc.to/)

## Notes

- TMDB IDs are crucial for streaming URLs to work
- Always backup existing seed data before major changes
- Test seeded data in the application before committing
- Keep seed files in version control for team collaboration
