import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { deleteHostHome, fetchHostHomes } from '@/features/homes/homesSlice';
import { formatPrice } from '@/utils/formatters';

export default function HostHomesPage() {
  const dispatch = useDispatch();
  const { hostHomes } = useSelector((state) => state.homes);

  useEffect(() => {
    dispatch(fetchHostHomes());
  }, [dispatch]);

  return (
    <main className="container mx-auto max-w-3xl p-6">
      <div className="rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="mb-8 text-center text-3xl font-bold text-yellow-600">Tours Registered by YOU!</h2>
        <div className="space-y-8">
          {hostHomes.map((home) => (
            <div key={home.id} className="overflow-hidden rounded-xl bg-gray-100 shadow-md transition duration-300 hover:shadow-lg">
              <img src={home.photo} alt={home.houseName} className="h-56 w-full object-cover" />
              <div className="space-y-3 p-5">
                <h3 className="text-2xl font-semibold text-yellow-700">{home.houseName}</h3>
                <p className="text-gray-700"><strong>Location:</strong> {home.location}</p>
                <p className="text-gray-700"><strong>Price:</strong> Rs {formatPrice(home.price)} / night</p>
                <div className="flex justify-between gap-4 pt-4">
                  <Link to={`/host/edit-home/${home.id}`} className="w-full">
                    <button type="button" className="w-full rounded-md bg-yellow-400 py-2 text-black transition duration-300 hover:bg-yellow-500">
                      Edit
                    </button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => dispatch(deleteHostHome(home.id))}
                    className="w-full rounded-md bg-black py-2 text-yellow-100 transition duration-300 hover:bg-yellow-500 hover:text-black"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
