import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import * as React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import * as playlistMutations from "@/features/playlist/api/playlist-mutations"
import * as playlistQueries from "@/features/playlist/api/playlist-queries"
import { usePlaylists } from "@/features/playlist/hooks/usePlaylists"
import { usePlaylistStore } from "@/features/playlist/store/usePlaylistStore"

vi.mock("@/features/playlist/api/playlist-queries", () => ({
  getUserPlaylistsAction: vi.fn(),
  getPlaylistTrackMapAction: vi.fn(),
}))

vi.mock("@/features/playlist/api/playlist-mutations", () => ({
  createPlaylistAction: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const mockPlaylists = [
  {
    id: "p1",
    userId: "u1",
    name: "Chill",
    description: null,
    isLiked: false,
    trackCount: 2,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "p2",
    userId: "u1",
    name: "Liked Songs",
    description: null,
    isLiked: true,
    trackCount: 3,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
]

describe("usePlaylists hook", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    act(() => {
      usePlaylistStore.getState().reset()
    })
  })

  it("should fetch playlists and hydrate the track map", async () => {
    vi.mocked(playlistQueries.getUserPlaylistsAction).mockResolvedValue({ success: true, data: mockPlaylists })
    vi.mocked(playlistQueries.getPlaylistTrackMapAction).mockResolvedValue({
      success: true,
      data: { p1: [100, 200], p2: [300] },
    })

    const { result } = renderHook(() => usePlaylists(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.playlists).toEqual(mockPlaylists)
    expect(usePlaylistStore.getState().isTrackInPlaylist("p1", 100)).toBe(true)
    expect(usePlaylistStore.getState().isTrackInPlaylist("p1", 200)).toBe(true)
    expect(usePlaylistStore.getState().isTrackInPlaylist("p2", 300)).toBe(true)
  })

  it("should reset store on playlists fetch failure", async () => {
    act(() => {
      usePlaylistStore.getState().markTrackAsAdded("stale", 1)
    })

    vi.mocked(playlistQueries.getUserPlaylistsAction).mockResolvedValue({
      success: false,
      error: "Server error",
    })

    const { result } = renderHook(() => usePlaylists(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(usePlaylistStore.getState().addedTracks).toEqual({})
  })

  it("should reset store when track map fetch fails", async () => {
    act(() => {
      usePlaylistStore.getState().markTrackAsAdded("stale", 1)
    })

    vi.mocked(playlistQueries.getUserPlaylistsAction).mockResolvedValue({ success: true, data: mockPlaylists })
    vi.mocked(playlistQueries.getPlaylistTrackMapAction).mockResolvedValue({ success: false, error: "DB error" })

    const { result } = renderHook(() => usePlaylists(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.playlists).toEqual(mockPlaylists)
    expect(usePlaylistStore.getState().addedTracks).toEqual({})
  })

  it("should create a playlist via createPlaylist", async () => {
    vi.mocked(playlistQueries.getUserPlaylistsAction).mockResolvedValue({ success: true, data: [] })
    vi.mocked(playlistQueries.getPlaylistTrackMapAction).mockResolvedValue({ success: true, data: {} })

    const newPlaylist = {
      id: "p3",
      userId: "u1",
      name: "New",
      description: null,
      isLiked: false,
      trackCount: 0,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    }
    vi.mocked(playlistMutations.createPlaylistAction).mockResolvedValue({
      success: true,
      data: newPlaylist,
    })

    const { result } = renderHook(() => usePlaylists(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      const created = await result.current.createPlaylist({ name: "New" })
      expect(created).toEqual(newPlaylist)
    })
  })
})
