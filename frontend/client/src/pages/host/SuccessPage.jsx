import { Link } from 'react-router-dom';

export default function SuccessPage() {
  return (
    <main className="container mx-auto mt-8 p-4">
      <div className="rounded-lg bg-white p-6 text-center shadow-md">
        <h1 className="mb-4 text-3xl font-bold text-yellow-600">Tour Registered Successfully</h1>
        <p className="text-lg text-gray-600">Your tour has been added to our listings.</p>
        <Link to="/" className="mt-6 inline-block rounded bg-yellow-400 px-4 py-2 text-black transition duration-300 hover:bg-yellow-500">
          Return to Home
        </Link>
      </div>
    </main>
  );
}
