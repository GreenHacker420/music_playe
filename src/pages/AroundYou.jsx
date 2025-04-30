import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useGetSongsByCountryQuery } from '../redux/services/spotifyApi';

const CountryTracks = () => {
  const [loading, setLoading] = useState(false);
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetSongsByCountryQuery();

  // We're using global top charts from Spotify since there's no direct country endpoint
  useEffect(() => {
    // Set loading to false after component mounts
    setLoading(false);
  }, []);

  if (isFetching && loading) return <Loader title="Loading Top Tracks..." />;

  if (error) return <Error />;

  // Handle Spotify's new releases data structure
  const albums = data?.albums?.items || [];

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

export default CountryTracks;
