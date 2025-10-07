import { HeroCarousel } from "@/components/hero/hero-carousel"
import { FeaturedGrid } from "@/components/featured/featured-grid"
import { ContentSection } from "@/components/sections/content-section"
import { Navbar } from "@/components/navbar/navbar"
import {
  getFeaturedMovie,
  getTrendingMovies,
  getTopRatedMovies,
  getMoviesByGenre,
  getAllMovies,
  getHeroSectionMovies,
  getFeaturedContentMovies,
  getMostViewedMovies,
  getRecentlyAddedMovies
} from "@/lib/repos/movie-repo"

export default async function Home() {
  const [
    featuredMovie,
    heroMovies,
    featuredMovies,
    recentlyAddedMovies,
    trendingMovies,
    topRatedMovies,
    mostViewedMovies,
    actionMovies,
    comedyMovies,
    dramaMovies
  ] = await Promise.all([
    getFeaturedMovie(),
    getHeroSectionMovies(),
    getFeaturedContentMovies(),
    getRecentlyAddedMovies(),
    getTrendingMovies(),
    getTopRatedMovies(),
    getMostViewedMovies(),
    getMoviesByGenre("action"),
    getMoviesByGenre("comedy"),
    getMoviesByGenre("drama")
  ])

  return (
    <>
      <Navbar />

      <HeroCarousel movies={heroMovies} />

      <div className="content-container">
        <FeaturedGrid title="Featured Content" movies={featuredMovies} />

        <ContentSection title="Recently Added" movies={recentlyAddedMovies} count={recentlyAddedMovies.length} viewAllHref="/recently-added" />
        <ContentSection title="Trending Now" movies={trendingMovies} count={trendingMovies.length} viewAllHref="/trending" />
        <ContentSection title="Top Rated" movies={topRatedMovies} count={topRatedMovies.length} viewAllHref="/top-rated" />
        <ContentSection title="Most Viewed" movies={mostViewedMovies} count={mostViewedMovies.length} viewAllHref="/most-viewed" />
        <ContentSection title="Action Movies" movies={actionMovies} count={actionMovies.length} viewAllHref="/genre/action" />
        <ContentSection title="Comedy Movies" movies={comedyMovies} count={comedyMovies.length} viewAllHref="/genre/comedy" />
        <ContentSection title="Drama Movies" movies={dramaMovies} count={dramaMovies.length} viewAllHref="/genre/drama" />
      </div>
    </>
  )
}
