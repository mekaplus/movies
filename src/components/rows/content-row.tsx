"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "@/components/common/icons"
import { Button } from "@/components/common/button"
import { TitleCard } from "@/components/cards/title-card"
import { Movie } from "@/lib/types"

interface ContentRowProps {
  title: string
  movies: Movie[]
}

export function ContentRow({ title, movies }: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.8
      rowRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (!movies || movies.length === 0) {
    return null
  }

  return (
    <div className="group relative px-4 md:px-8 lg:px-12">
      <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
        {title}
      </h2>

      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 z-10 h-12 w-12 -translate-y-1/2 bg-black/50 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 group-hover:opacity-100"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div
          ref={rowRef}
          className="flex space-x-2 overflow-x-auto scrollbar-hide pb-4 md:space-x-4"
        >
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className="w-48 flex-shrink-0 md:w-64"
            >
              <TitleCard movie={movie} priority={index < 6} />
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 z-10 h-12 w-12 -translate-y-1/2 bg-black/50 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 group-hover:opacity-100"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}