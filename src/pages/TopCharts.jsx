import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useGetTopTracksQuery, useGetPlaylistTracksQuery } from '../redux/services/spotifyApi';

const TopCharts = () => {
  const [playlistId, setPlaylistId] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: featuredData, isFetching: isFetchingFeatured, error: featuredError } = useGetTopTracksQuery();
  const { data: playlistData, isFetching: isFetchingPlaylist, error: playlistError } =
    useGetPlaylistTracksQuery(playlistId, { skip: !playlistId });

  const { activeSong, isPlaying } = useSelector((state) => state.player);

  // Get the first featured playlist ID
  useEffect(() => {
    if (featuredData && featuredData.playlists && featuredData.playlists.items.length > 0) {
      setPlaylistId(featuredData.playlists.items[0].id);
    }
  }, [featuredData]);

  // Get tracks from the playlist
  useEffect(() => {
    if (playlistData && playlistData.tracks && playlistData.tracks.items) {
      const validTracks = playlistData.tracks.items
        .filter(item => item.track && item.track.preview_url)
        .map(item => item.track);
      setTracks(validTracks);
      setLoading(false);
    }
  }, [playlistData]);

  if (isFetchingFeatured || isFetchingPlaylist || loading)
    return <Loader title="Loading Top Tracks from India..." />;

  if (featuredError || playlistError) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">New Releases</h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {albums.map((album, i) => (
          <SongCard
            key={album.id}
            song={{
              id: album.id,
              title: album.name,
              images: { coverart: album.images[0]?.url },
              subtitle: album.artists?.map(artist => artist.name).join(', '),
              artists: album.artists?.map(artist => ({ adamid: artist.id })),
            }}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={albums}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default TopCharts;
