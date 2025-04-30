import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';

import { setActiveSong, playPause } from '../redux/features/playerSlice';
import { useGetSongDetailsQuery, useGetArtistTopTracksQuery as useGetSongRelatedQuery } from '../redux/services/spotifyApi';

const SongDetails = () => {
  const dispatch = useDispatch();
  const { songid, id: artistId } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  // Get artist's top tracks as related songs
  const { data: relatedData, isFetching: isFetchinRelatedSongs, error: relatedError } = useGetSongRelatedQuery(artistId);
  const { data: songData, isFetching: isFetchingSongDetails, error: songError } = useGetSongDetailsQuery(songid);

  if (isFetchingSongDetails || isFetchinRelatedSongs) return <Loader title="Searching song details" />;

  if (songError || relatedError) return <Error />;

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: relatedData?.tracks, i }));
    dispatch(playPause(true));
  };

  // Format song data for the UI
  const formattedSongData = {
    title: songData?.name,
    subtitle: songData?.artists?.map(artist => artist.name).join(', '),
    images: { coverart: songData?.album?.images[0]?.url },
    genres: songData?.album?.genres || [],
  };

  return (
    <div className="flex flex-col">
      <DetailsHeader
        artistId={artistId}
        songData={formattedSongData}
      />

      <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Song Details:</h2>

        <div className="mt-5">
          <p className="text-gray-400 text-base my-1">Title: {songData?.name}</p>
          <p className="text-gray-400 text-base my-1">Album: {songData?.album?.name}</p>
          <p className="text-gray-400 text-base my-1">Release Date: {songData?.album?.release_date}</p>
          <p className="text-gray-400 text-base my-1">Duration: {Math.floor(songData?.duration_ms / 60000)}:{((songData?.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}</p>
          <p className="text-gray-400 text-base my-1">Popularity: {songData?.popularity}/100</p>
          {songData?.preview_url ? (
            <p className="text-gray-400 text-base my-1">Preview available</p>
          ) : (
            <p className="text-gray-400 text-base my-1">No preview available</p>
          )}
        </div>
      </div>

      <RelatedSongs
        data={relatedData?.tracks?.map(track => ({
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

export default SongDetails;
