import React from 'react';

import { ArtistCard, Error, Loader } from '../components';
import { useGetTopChartsQuery } from '../redux/services/spotifyApi';

const TopArtists = () => {
  const { data, isFetching, error } = useGetTopChartsQuery();

  if (isFetching) return <Loader title="Loading artists..." />;

  if (error) return <Error />;

  // Extract unique artists from the albums
  const albums = data?.albums?.items || [];
  const uniqueArtists = [];
  const artistIds = new Set();

  albums.forEach(album => {
    if (album?.artists) {
      album.artists.forEach(artist => {
        if (!artistIds.has(artist.id)) {
          artistIds.add(artist.id);
          uniqueArtists.push({
            id: artist.id,
            name: artist.name,
            images: { background: album.images[0]?.url },
            artists: [{ adamid: artist.id }]
          });
        }
      });
    }
  });

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">Top artists</h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {uniqueArtists.map((artist) => <ArtistCard key={artist.id} track={artist} />)}
      </div>
    </div>
  );
};

export default TopArtists;
