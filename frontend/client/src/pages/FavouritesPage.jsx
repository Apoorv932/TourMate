import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import HomesGrid from '@/components/home/HomesGrid';
import PageCard from '@/components/shared/PageCard';
import { fetchFavourites, removeFavourite } from '@/features/homes/homesSlice';

export default function FavouritesPage() {
  const dispatch = useDispatch();
  const { favourites } = useSelector((state) => state.homes);

  useEffect(() => {
    dispatch(fetchFavourites());
  }, [dispatch]);

  return (
    <main className="container mx-auto mt-10 max-w-xl p-8">
      <PageCard className="p-8">
        <h2 className="mb-6 text-center text-3xl font-bold text-yellow-600">Here are your favorite tours:</h2>
        <HomesGrid
          homes={favourites}
          primaryAction={{
            label: 'Book Now',
            className: 'my-5 w-full rounded-md bg-yellow-400 py-2 text-black transition duration-300 hover:bg-yellow-500',
          }}
          secondaryAction={(home) => ({
            label: 'Remove',
            className: 'w-full rounded-md bg-gray-300 py-2 text-gray-800 transition duration-300 hover:bg-gray-600 hover:text-white',
            onClick: () => dispatch(removeFavourite(home.id)),
          })}
        />
      </PageCard>
    </main>
  );
}
