import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getAccessToken = async () => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(import.meta.env.VITE_SPOTIFY_CLIENT_ID + ':' + import.meta.env.VITE_SPOTIFY_CLIENT_SECRET)
    },
    body: 'grant_type=client_credentials'
  });
  const data = await response.json();
  return data.access_token;
};

export const spotifyApi = createApi({
  reducerPath: 'spotifyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.spotify.com/v1',
    prepareHeaders: async (headers) => {
      const token = await getAccessToken();
      headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTopCharts: builder.query({
      query: () => 'browse/new-releases?country=IN&limit=20' // New releases for India
    }),
    getSongsByGenre: builder.query({
      query: (genre) => `browse/categories/${genre}/playlists`
    }),
    getSongsBySearch: builder.query({
      query: (searchTerm) => `search?q=${searchTerm}&type=track,artist`
    }),
    getArtistDetails: builder.query({
      query: (artistId) => `artists/${artistId}`
    }),
    getSongDetails: builder.query({
      query: (trackId) => `tracks/${trackId}`
    }),
    getArtistTopTracks: builder.query({
      query: (artistId) => `artists/${artistId}/top-tracks?market=IN`
    }),
    getRelatedArtists: builder.query({
      query: (artistId) => `artists/${artistId}/related-artists`
    }),
    getTopTracks: builder.query({
      query: () => `browse/featured-playlists?country=IN&limit=1`
    }),
    getPlaylistTracks: builder.query({
      query: (playlistId) => `playlists/${playlistId}`
    }),
  }),
});

export const {
  useGetTopChartsQuery,
  useGetSongsByGenreQuery,
  useGetSongsBySearchQuery,
  useGetArtistDetailsQuery,
  useGetSongDetailsQuery,
  useGetArtistTopTracksQuery,
  useGetRelatedArtistsQuery,
  useGetTopTracksQuery,
  useGetPlaylistTracksQuery,
} = spotifyApi;

// Aliases for compatibility with previous code
export const useGetSongsByCountryQuery = useGetTopChartsQuery;
export const useGetSongRelatedQuery = useGetArtistTopTracksQuery;