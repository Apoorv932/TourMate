import { Link } from 'react-router-dom';

export default function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <main className="container mx-auto mt-20 text-center">
      <h2 className="mb-4 text-6xl font-bold text-yellow-600">{title}</h2>
      <p className="mb-8 text-2xl text-gray-700">{description}</p>
      {actionLabel && actionTo ? (
        <Link to={actionTo} className="rounded-lg bg-yellow-400 px-6 py-2 text-black transition duration-300 hover:bg-yellow-500">
          {actionLabel}
        </Link>
      ) : null}
    </main>
  );
}
