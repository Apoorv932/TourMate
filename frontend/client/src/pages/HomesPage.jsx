import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import HomesGrid from '@/components/home/HomesGrid';
import ErrorAlert from '@/components/shared/ErrorAlert';
import PageCard from '@/components/shared/PageCard';
import { addFavourite, fetchHomes } from '@/features/homes/homesSlice';

export default function HomesPage() {
  const dispatch = useDispatch();
  const { homes, errorMessage } = useSelector((state) => state.homes);
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchHomes());
  }, [dispatch]);

  return (
    <main className="container mx-auto mt-10 max-w-xl p-8">
      <PageCard className="p-8">
        <h2 className="mb-6 text-center text-3xl font-bold text-yellow-600">Here are our registered tours:</h2>
        <ErrorAlert messages={errorMessage ? [errorMessage] : []} />
        <HomesGrid
          homes={homes}
          showFavouriteButton={isLoggedIn}
          onFavourite={(homeId) => dispatch(addFavourite(homeId))}
          primaryAction={(home) => ({
            label: 'Details',
            to: `/homes/${home.id}`,
            className: 'my-5 w-full rounded-md bg-yellow-400 py-2 text-black transition duration-300 hover:bg-yellow-500',
          })}
        />
      </PageCard>
    </main>
  );
}
