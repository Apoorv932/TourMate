import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <p className="p-8 text-center text-gray-600">Loading profile...</p>;
  }

  return (
    <main className="container mx-auto mt-10 max-w-xl p-6">
      <div className="rounded-xl bg-white p-6 text-center shadow-md">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
          </svg>
        </div>
        <h1 className="mb-1 text-2xl font-bold text-gray-800">{user.firstName} {user.lastName}</h1>
        <p className="mb-4 text-sm font-medium uppercase text-yellow-600">{user.role}</p>
        <div className="mt-4 space-y-3 text-left text-gray-700">
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">First Name:</span> {user.firstName}</p>
          <p><span className="font-medium">Last Name:</span> {user.lastName}</p>
        </div>
        <Link to="/favourites" className="mt-6 inline-block rounded-full bg-yellow-400 px-4 py-2 text-black transition hover:bg-yellow-500">
          View Favourites
        </Link>
      </div>
    </main>
  );
}
