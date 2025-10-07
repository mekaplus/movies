"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Play, Plus, ThumbsUp, ChevronDown, Eye } from "@/components/common/icons"
import { Button } from "@/components/common/button"
import { Movie } from "@/lib/types"
import { formatDuration, formatYear, cn } from "@/lib/utils"

interface TitleCardProps {
  movie: Movie
  priority?: boolean
}

export function TitleCard({ movie, priority = false }: TitleCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isTouched, setIsTouched] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation()
    setIsTouched(!isTouched)
  }

  const isExpanded = isHovered || isTouched

  return (
    <div
      className="group relative w-full transition-transform duration-300 ease-out hover:scale-105 hover:z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
    >
      <Link href={`/title/${movie.id}`}>
        <div className="relative w-full overflow-hidden rounded-md bg-gray-800">
          {movie.posterUrl ? (
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              width={300}
              height={450}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex w-full min-h-[300px] items-center justify-center bg-gray-700 p-4">
              <span className="text-sm text-gray-400 text-center">{movie.title}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />
        </div>
      </Link>

      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 translate-y-full mx-1 rounded-md bg-xflix-dark p-3 opacity-0 shadow-2xl transition-all duration-300 z-20",
          isExpanded && "opacity-100"
        )}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button size="icon" variant="ghost" className="h-8 w-8 bg-white text-black hover:bg-gray-200">
                <Play className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 border border-gray-600 hover:border-white">
                <Plus className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 border border-gray-600 hover:border-white">
                <ThumbsUp className="h-4 w-4" />
              </Button>
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8 border border-gray-600 hover:border-white">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-white truncate">{movie.title}</h3>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>⭐ {movie.rating}</span>
              <span>•</span>
              <span>{formatYear(movie.year)}</span>
              <span>•</span>
              <span>{formatDuration(movie.durationMin)}</span>
              {movie.viewCount !== undefined && (
                <>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>{movie.viewCount.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
              {movie.genres.map((genre, index) => (
                <React.Fragment key={genre.id}>
                  <Link
                    href={`/genre/${genre.id}`}
                    className="text-xs text-gray-400 hover:text-white transition-colors duration-200 underline-offset-2 hover:underline whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {genre.name}
                  </Link>
                  {index < movie.genres.length - 1 && (
                    <span className="text-xs text-gray-500">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}