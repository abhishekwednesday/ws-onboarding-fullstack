import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import * as React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { type CatalogItemType } from "@/features/catalog/types/catalog-types"
import * as playlistMutations from "@/features/playlist/api/playlist-mutations"
import * as playlistQueries from "@/features/playlist/api/playlist-queries"
import { usePlaylistDetail } from "@/features/playlist/hooks/usePlaylistDetail"
import { usePlaylistStore } from "@/features/playlist/store/usePlaylistStore"

vi.mock("@/features/playlist/api/playlist-queries", () => ({
  getPlaylistDetailAction: vi.fn(),
}))

vi.mock("@/features/playlist/api/playlist-mutations", () => ({
  addTrackToPlaylistAction: vi.fn(),
  removeTrackFromPlaylistAction: vi.fn(),
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

const mockTrack: CatalogItemType = {
  id: 100,
  title: "Test Song",
  artist: "Test Artist",
  album: "Test Album",
}

const mockPlaylistDetail = {
  id: "p1",
  userId: "u1",
  name: "Chill",
  description: null,
  isLiked: false,
  trackCount: 1,
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  tracks: [
    {
      id: 100,
      title: "Test Song",
      artist: "Test Artist",
      album: "Test Album",
      artworkUrl: "http://example.com/art.jpg",
      previewUrl: "http://example.com/preview.mp3",
      genre: "Pop",
      duration: 200000,
      trackViewUrl: "http://example.com",
      addedAt: "2024-01-01",
    },
  ],
}

describe("usePlaylistDetail hook", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    act(() => {
      usePlaylistStore.getState().reset()
    })
  })

  it("should fetch playlist details", async () => {
    vi.mocked(playlistQueries.getPlaylistDetailAction).mockResolvedValue({
      success: true,
      data: mockPlaylistDetail,
    })

    const { result } = renderHook(() => usePlaylistDetail("p1"), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.playlist).toEqual(mockPlaylistDetail)
  })

  it("should return null and not fetch when no playlistId is given", async () => {
    const { result } = renderHook(() => usePlaylistDetail(undefined), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.playlist).toBeNull()
    expect(playlistQueries.getPlaylistDetailAction).not.toHaveBeenCalled()
  })

  it("should skip query when skipQuery option is true", async () => {
    const { result } = renderHook(() => usePlaylistDetail("p1", { skipQuery: true }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(playlistQueries.getPlaylistDetailAction).not.toHaveBeenCalled()
  })

  it("should add a track and update the store optimistically", async () => {
    vi.mocked(playlistQueries.getPlaylistDetailAction).mockResolvedValue({
      success: true,
      data: mockPlaylistDetail,
    })
    vi.mocked(playlistMutations.addTrackToPlaylistAction).mockResolvedValue({
      success: true,
      data: undefined,
    })

    const { result } = renderHook(() => usePlaylistDetail("p1"), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.addTrack(mockTrack)
    })

    expect(playlistMutations.addTrackToPlaylistAction).toHaveBeenCalledWith("p1", mockTrack)
    expect(usePlaylistStore.getState().isTrackInPlaylist("p1", 100)).toBe(true)
  })

  it("should rollback optimistic add on server failure", async () => {
    vi.mocked(playlistQueries.getPlaylistDetailAction).mockResolvedValue({
      success: true,
      data: mockPlaylistDetail,
    })
    vi.mocked(playlistMutations.addTrackToPlaylistAction).mockResolvedValue({
      success: false,
      error: "Server error",
    })

    const { result } = renderHook(() => usePlaylistDetail("p1"), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.addTrack(mockTrack)
    })

    // After rollback, track should not be in store
    expect(usePlaylistStore.getState().isTrackInPlaylist("p1", 100)).toBe(false)
  })

  it("should remove a track and update the store optimistically", async () => {
    act(() => {
      usePlaylistStore.getState().markTrackAsAdded("p1", 100)
    })

    vi.mocked(playlistQueries.getPlaylistDetailAction).mockResolvedValue({
      success: true,
      data: mockPlaylistDetail,
    })
    vi.mocked(playlistMutations.removeTrackFromPlaylistAction).mockResolvedValue({
      success: true,
      data: undefined,
    })

    const { result } = renderHook(() => usePlaylistDetail("p1"), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.removeTrack(100)
    })

    expect(playlistMutations.removeTrackFromPlaylistAction).toHaveBeenCalledWith("p1", 100)
    expect(usePlaylistStore.getState().isTrackInPlaylist("p1", 100)).toBe(false)
  })

  it("should rollback optimistic remove on server failure", async () => {
    act(() => {
      usePlaylistStore.getState().markTrackAsAdded("p1", 100)
    })

    vi.mocked(playlistQueries.getPlaylistDetailAction).mockResolvedValue({
      success: true,
      data: mockPlaylistDetail,
    })
    vi.mocked(playlistMutations.removeTrackFromPlaylistAction).mockResolvedValue({
      success: false,
      error: "Server error",
    })

    const { result } = renderHook(() => usePlaylistDetail("p1"), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.removeTrack(100)
    })

    // After rollback, track should be back in store
    expect(usePlaylistStore.getState().isTrackInPlaylist("p1", 100)).toBe(true)
  })
})
