import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ErrorAlert from '@/components/shared/ErrorAlert';
import { clearAuthErrors, loginUser } from '@/features/auth/authSlice';
import { getGoogleAuthUrl } from '@/utils/apiClient';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { errorMessages } = useSelector((state) => state.auth);
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const oauthStatus = searchParams.get('oauth');

  async function handleSubmit(event) {
    event.preventDefault();
    dispatch(clearAuthErrors());
    const result = await dispatch(loginUser(formValues));
    if (!result.error) {
      navigate(location.state?.from || '/');
    }
  }

  return (
    <main className="container mx-auto mt-8 max-w-lg rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">Log in to TourMate</h1>
      <ErrorAlert messages={errorMessages} />
      <form onSubmit={handleSubmit} className="mx-auto max-w-md">
        <input
          type="email"
          placeholder="Enter your email"
          value={formValues.email}
          onChange={(event) => setFormValues({ ...formValues, email: event.target.value })}
          className="mb-4 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <input
          type="password"
          placeholder="Enter password"
          value={formValues.password}
          onChange={(event) => setFormValues({ ...formValues, password: event.target.value })}
          className="mb-4 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <button type="submit" className="w-full cursor-pointer rounded-md bg-yellow-400 py-2 text-black transition duration-300 hover:bg-yellow-500">
          Login
        </button>
        <button
          type="button"
          onClick={() => {
            window.location.href = getGoogleAuthUrl();
          }}
          className="mt-3 flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white py-2 text-gray-700 transition duration-300 hover:bg-gray-50"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>
        {oauthStatus === 'error' ? <p className="mt-3 text-center text-sm text-red-500">Google sign-in failed. Please try again.</p> : null}
        {oauthStatus === 'disabled' ? <p className="mt-3 text-center text-sm text-amber-600">Google sign-in is added, but it still needs your Google client ID and secret in `Backend/.env`.</p> : null}
        <p className="mt-3 text-center text-sm">
          Don not have an account? <Link to="/signup" className="text-yellow-600 hover:underline">Sign up</Link>
        </p>
      </form>
    </main>
  );
}
