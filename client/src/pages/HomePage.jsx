import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import HomesGrid from '@/components/home/HomesGrid';
import PageCard from '@/components/shared/PageCard';
import { fetchHomes } from '@/features/homes/homesSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const { homes } = useSelector((state) => state.homes);

  useEffect(() => {
    dispatch(fetchHomes());
  }, [dispatch]);

  return (
    <main className="container mx-auto mt-10 max-w-xl p-8">
      <PageCard className="p-8">
        <h2 className="mb-6 text-center text-3xl font-bold text-yellow-600">BOOK YOUR DREAM TOUR WITH TOURMATE</h2>
        <HomesGrid
          homes={homes}
          primaryAction={{
            label: 'Book Now',
            className: 'my-5 w-full rounded-md bg-yellow-400 py-2 text-black transition duration-300 hover:bg-yellow-500',
          }}
        />
      </PageCard>
    </main>
  );
}
