import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ErrorAlert from '@/components/shared/ErrorAlert';
import { clearHomesError, fetchHomeDetail, saveHostHome } from '@/features/homes/homesSlice';

export default function HostHomeFormPage({ mode }) {
  const isEdit = mode === 'edit';
  const { homeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedHome = useSelector((state) => state.homes.selectedHome);
  const errorMessage = useSelector((state) => state.homes.errorMessage);

  const initialForm = useMemo(
    () => ({
      houseName: selectedHome?.houseName || '',
      price: selectedHome?.price || '',
      location: selectedHome?.location || '',
      photo: null,
      rulesPdf: null,
    }),
    [selectedHome]
  );

  const [formValues, setFormValues] = useState(initialForm);

  useEffect(() => {
    dispatch(clearHomesError());
    if (isEdit && homeId) {
      dispatch(fetchHomeDetail(homeId));
    }
  }, [dispatch, homeId, isEdit]);

  useEffect(() => {
    setFormValues(initialForm);
  }, [initialForm]);

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await dispatch(saveHostHome({ homeId, values: formValues }));
    if (!result.error) {
      navigate('/host/success');
    }
  }

  return (
    <main className="container mx-auto mt-8 max-w-lg rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">{isEdit ? 'Edit Your Tour' : 'Register Your Tour on TourMate'}</h1>
      <ErrorAlert messages={errorMessage ? [errorMessage] : []} />
      <form onSubmit={handleSubmit} className="mx-auto max-w-md">
        <input
          type="text"
          placeholder="Enter your Tour Name"
          value={formValues.houseName}
          onChange={(event) => setFormValues({ ...formValues, houseName: event.target.value })}
          className="mb-4 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <input
          type="text"
          placeholder="Enter price per night"
          value={formValues.price}
          onChange={(event) => setFormValues({ ...formValues, price: event.target.value })}
          className="mb-4 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <input
          type="text"
          placeholder="Enter your tour location"
          value={formValues.location}
          onChange={(event) => setFormValues({ ...formValues, location: event.target.value })}
          className="mb-4 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <label className="mb-2 block text-sm font-medium text-yellow-700" htmlFor="photo">
          Upload Tour Photo
        </label>
        <input
          id="photo"
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={(event) => setFormValues({ ...formValues, photo: event.target.files?.[0] || null })}
          className="my-4 block w-full rounded-md border border-black-300 text-sm text-gray-900 file:mr-4 file:cursor-pointer file:border-0 file:bg-yellow-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <label className="mb-2 block text-sm font-medium text-yellow-700" htmlFor="rulesPdf">
          Upload rules and regulations for the tour (if any)
        </label>
        <input
          id="rulesPdf"
          type="file"
          accept="application/pdf"
          onChange={(event) => setFormValues({ ...formValues, rulesPdf: event.target.files?.[0] || null })}
          className="my-4 block w-full rounded-md border border-black-300 text-sm text-gray-900 file:mr-4 file:cursor-pointer file:border-0 file:bg-yellow-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button type="submit" className="w-full cursor-pointer rounded-md bg-yellow-400 py-2 text-black transition duration-300 hover:bg-yellow-500">
          {isEdit ? 'UPDATE' : 'SUBMIT'}
        </button>
      </form>
    </main>
  );
}
