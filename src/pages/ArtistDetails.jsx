import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';

import { useGetArtistDetailsQuery, useGetArtistTopTracksQuery } from '../redux/services/spotifyApi';
import { setActiveSong, playPause } from '../redux/features/playerSlice';

const ArtistDetails = () => {
  const dispatch = useDispatch();
  const { id: artistId } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data: artistData, isFetching: isFetchingArtistDetails, error: artistError } = useGetArtistDetailsQuery(artistId);
  const { data: topTracksData, isFetching: isFetchingTopTracks, error: topTracksError } = useGetArtistTopTracksQuery(artistId);

  if (isFetchingArtistDetails || isFetchingTopTracks) return <Loader title="Loading artist details..." />;

  if (artistError || topTracksError) return <Error />;

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: topTracksData?.tracks, i }));
    dispatch(playPause(true));
  };

  // Format artist data for the UI
  const formattedArtistData = {
    name: artistData?.name,
    images: { background: artistData?.images?.[0]?.url },
    genres: artistData?.genres || [],
    followers: artistData?.followers?.total,
    popularity: artistData?.popularity,
  };

  return (
    <div className="flex flex-col">
      <DetailsHeader
        artistId={artistId}
        artistData={formattedArtistData}
      />

      <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Artist Details:</h2>
        <div className="mt-5">
          <p className="text-gray-400 text-base my-1">Name: {artistData?.name}</p>
          <p className="text-gray-400 text-base my-1">Followers: {artistData?.followers?.total?.toLocaleString()}</p>
          <p className="text-gray-400 text-base my-1">Popularity: {artistData?.popularity}/100</p>
          <p className="text-gray-400 text-base my-1">Genres: {artistData?.genres?.join(', ') || 'No genres listed'}</p>
        </div>
      </div>

      <RelatedSongs
        data={topTracksData?.tracks?.map(track => ({
          id: track.id,
          title: track.name,
          images: { coverart: track.album?.images[0]?.url },
          subtitle: track.artists?.map(artist => artist.name).join(', '),
          preview_url: track.preview_url,
          artists: track.artists?.map(artist => ({ adamid: artist.id })),
        }))}
        artistId={artistId}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePauseClick={handlePauseClick}
        handlePlayClick={handlePlayClick}
      />
    </div>
  );
};

export default ArtistDetails;
