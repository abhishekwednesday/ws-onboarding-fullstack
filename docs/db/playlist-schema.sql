-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Playlist Table: Stores user-created playlists
CREATE TABLE IF NOT EXISTS "playlist" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isLiked" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS and add owner-based policies
ALTER TABLE "playlist" ENABLE ROW LEVEL SECURITY;

-- Idempotent policy creation for playlist
DROP POLICY IF EXISTS "Users can manage own playlists" ON "playlist";
CREATE POLICY "Users can manage own playlists" ON "playlist"
    FOR ALL
    USING ("userId" = current_setting('app.current_user_id', true));

-- Auto-update "updatedAt" on every row modification
CREATE OR REPLACE FUNCTION playlist_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_playlist_updated_at ON "playlist";
CREATE TRIGGER update_playlist_updated_at
    BEFORE UPDATE ON "playlist"
    FOR EACH ROW EXECUTE FUNCTION playlist_update_updated_at_column();

-- Enforce at most one "Liked Songs" playlist per user at the database level
CREATE UNIQUE INDEX IF NOT EXISTS "idx_playlist_user_liked_unique"
    ON "playlist"("userId")
    WHERE "isLiked" = TRUE;

-- Playlist Track Table: Stores only the iTunes track ID reference.
CREATE TABLE IF NOT EXISTS "playlist_track" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "playlistId" UUID NOT NULL REFERENCES "playlist"("id") ON DELETE CASCADE,
    "trackId" INTEGER NOT NULL,
    "addedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE("playlistId", "trackId")
);

ALTER TABLE "playlist_track" ENABLE ROW LEVEL SECURITY;

-- Policy for tracks relies on the parent playlist's ownership
DROP POLICY IF EXISTS "Users can manage tracks in own playlists" ON "playlist_track";
CREATE POLICY "Users can manage tracks in own playlists" ON "playlist_track"
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM "playlist" p 
            WHERE p."id" = "playlistId" 
            AND p."userId" = current_setting('app.current_user_id', true)
        )
    );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS "idx_playlist_userId" ON "playlist"("userId");
CREATE INDEX IF NOT EXISTS "idx_playlist_track_playlistId" ON "playlist_track"("playlistId");