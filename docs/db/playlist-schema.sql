-- Playlist Table: Stores user-created playlists
CREATE TABLE IF NOT EXISTS "playlist" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isLiked" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE "playlist" ENABLE ROW LEVEL SECURITY;

-- Playlist Track Table: Stores only the iTunes track ID reference.
-- Full track metadata (title, artist, artwork, etc.) is fetched from
-- the iTunes API at read time using the existing itunesLookupAction.
CREATE TABLE IF NOT EXISTS "playlist_track" (
    "id" TEXT PRIMARY KEY,
    "playlistId" TEXT NOT NULL REFERENCES "playlist"("id") ON DELETE CASCADE,
    "trackId" INTEGER NOT NULL,
    "addedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE("playlistId", "trackId")
);
ALTER TABLE "playlist_track" ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS "idx_playlist_userId" ON "playlist"("userId");
CREATE INDEX IF NOT EXISTS "idx_playlist_track_playlistId" ON "playlist_track"("playlistId");
