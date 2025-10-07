-- AlterEnum
ALTER TYPE "public"."CreditRole" ADD VALUE 'WRITER';

-- CreateTable
CREATE TABLE "public"."hero_sections" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT,
    "subtitle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."seasons" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "seasonNumber" INTEGER NOT NULL,
    "title" TEXT,
    "overview" TEXT,
    "posterUrl" TEXT,
    "episodeCount" INTEGER NOT NULL DEFAULT 0,
    "airDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."episodes" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT,
    "durationMin" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION,
    "airDate" TIMESTAMP(3),
    "stillUrl" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "episodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."episode_streaming_urls" (
    "id" TEXT NOT NULL,
    "episodeId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "quality" TEXT,
    "platform" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "episode_streaming_urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hero_sections_movieId_key" ON "public"."hero_sections"("movieId");

-- CreateIndex
CREATE UNIQUE INDEX "hero_sections_sequence_key" ON "public"."hero_sections"("sequence");

-- CreateIndex
CREATE UNIQUE INDEX "seasons_movieId_seasonNumber_key" ON "public"."seasons"("movieId", "seasonNumber");

-- CreateIndex
CREATE UNIQUE INDEX "episodes_seasonId_episodeNumber_key" ON "public"."episodes"("seasonId", "episodeNumber");

-- AddForeignKey
ALTER TABLE "public"."hero_sections" ADD CONSTRAINT "hero_sections_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."seasons" ADD CONSTRAINT "seasons_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."episodes" ADD CONSTRAINT "episodes_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "public"."seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."episode_streaming_urls" ADD CONSTRAINT "episode_streaming_urls_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "public"."episodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
