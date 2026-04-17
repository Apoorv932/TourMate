import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { addFavourite, fetchHomeDetail } from '@/features/homes/homesSlice';
import { formatPrice } from '@/utils/formatters';

export default function HomeDetailPage() {
  const { homeId } = useParams();
  const dispatch = useDispatch();
  const home = useSelector((state) => state.homes.selectedHome);
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchHomeDetail(homeId));
  }, [dispatch, homeId]);

  if (!home) {
    return <p className="p-8 text-center text-gray-600">Loading home...</p>;
  }

  return (
    <main className="container mx-auto mt-10 px-4">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="h-64 w-full">
          <img src={home.photo} alt={home.houseName} className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105" />
        </div>
        <div className="p-8">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-wide text-yellow-600">{home.houseName}</h2>
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="text-lg font-medium text-gray-600">Location</p>
              <p className="text-xl text-gray-800">{home.location}</p>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-600">Price</p>
              <p className="text-xl text-gray-800">Rs {formatPrice(home.price)} / night</p>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-lg font-medium text-gray-600">Description</p>
            <p className="mt-2 leading-relaxed text-gray-700">{home.description || 'No description provided.'}</p>
          </div>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <button type="button" className="w-full rounded-lg bg-yellow-400 px-6 py-2 text-black shadow-md transition-all hover:scale-105 hover:bg-yellow-500 sm:w-auto">
              Book This Tour
            </button>
            <Link to="/homes" className="w-full rounded-lg bg-gray-200 px-6 py-2 text-center text-gray-800 shadow-md transition-all hover:scale-105 hover:bg-gray-300 sm:w-auto">
              Back to Listings
            </Link>
          {home.rulesPdf ? (
              <a href={home.rulesPdf} target="_blank" rel="noreferrer" className="py-2 text-blue-500 underline">
                View Rules (PDF)
              </a>
            ) : null}
          </div>
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => dispatch(addFavourite(home.id))}
              className="mt-6 w-full rounded-lg bg-yellow-400 px-6 py-2 font-semibold text-black shadow-md transition-transform hover:scale-105 hover:bg-yellow-500 sm:w-auto"
            >
              Add to Favourites
            </button>
          ) : null}
        </div>
      </div>
    </main>
  );
}
