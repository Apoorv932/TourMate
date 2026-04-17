import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ErrorAlert from '@/components/shared/ErrorAlert';
import { clearAuthErrors, signupUser } from '@/features/auth/authSlice';

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  terms: false,
};

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { errorMessages } = useSelector((state) => state.auth);
  const [formValues, setFormValues] = useState(initialValues);

  async function handleSubmit(event) {
    event.preventDefault();
    dispatch(clearAuthErrors());
    const result = await dispatch(signupUser(formValues));
    if (!result.error) {
      navigate('/login');
    }
  }

  return (
    <main className="container mx-auto mt-8 max-w-lg rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">Create your TourMate account</h1>
      <ErrorAlert messages={errorMessages} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="First name"
          value={formValues.firstName}
          onChange={(event) => setFormValues({ ...formValues, firstName: event.target.value })}
          className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <input
          type="text"
          placeholder="Last name"
          value={formValues.lastName}
          onChange={(event) => setFormValues({ ...formValues, lastName: event.target.value })}
          className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="email"
          placeholder="Email address"
          value={formValues.email}
          onChange={(event) => setFormValues({ ...formValues, email: event.target.value })}
          className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formValues.password}
          onChange={(event) => setFormValues({ ...formValues, password: event.target.value })}
          className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={formValues.confirmPassword}
          onChange={(event) => setFormValues({ ...formValues, confirmPassword: event.target.value })}
          className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <select
          value={formValues.role}
          onChange={(event) => setFormValues({ ...formValues, role: event.target.value })}
          className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        >
          <option value="" disabled>
            Sign up as
          </option>
          <option value="guest">Guest</option>
          <option value="host">Host</option>
        </select>
        <label className="flex items-center text-sm text-gray-600">
          <input
            type="checkbox"
            checked={formValues.terms}
            onChange={(event) => setFormValues({ ...formValues, terms: event.target.checked })}
            className="mr-2 cursor-pointer rounded"
            required
          />
          I agree to the <span className="ml-1 text-yellow-600">Terms &amp; Conditions</span>
        </label>
        <button type="submit" className="w-full cursor-pointer rounded-md bg-yellow-400 py-2 font-semibold text-black transition hover:bg-yellow-500">
          Sign up
        </button>
        <p className="mt-3 text-center text-sm">
          Already have an account? <Link to="/login" className="text-yellow-600 hover:underline">Log in</Link>
        </p>
      </form>
    </main>
  );
}
