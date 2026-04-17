import { Link } from 'react-router-dom';

import { formatPrice } from '@/utils/formatters';

export default function HomeCard({
  home,
  primaryAction,
  secondaryAction,
  showFavouriteButton,
  onFavourite,
}) {
  const resolvedPrimaryAction = typeof primaryAction === 'function' ? primaryAction(home) : primaryAction;
  const resolvedSecondaryAction = typeof secondaryAction === 'function' ? secondaryAction(home) : secondaryAction;

  return (
    <div className="overflow-hidden rounded-xl bg-gray-100 shadow-md transition duration-300 hover:shadow-lg">
      <img src={home.photo} alt={home.houseName} className="h-48 w-full object-cover" />
      <div className="p-4">
        <h3 className="mb-2 text-xl font-semibold text-yellow-600">{home.houseName}</h3>
        <p className="mb-1 text-gray-700">
          <strong>Location:</strong> {home.location}
        </p>
        <p className="text-gray-700">
          <strong>Price:</strong> Rs {formatPrice(home.price)} / night
        </p>

        {showFavouriteButton ? (
          <button
            type="button"
            onClick={() => onFavourite(home.id)}
            className="mt-6 w-full rounded-lg bg-yellow-400 px-6 py-2 font-semibold text-black shadow-md transition-transform hover:scale-105 hover:bg-yellow-500 sm:w-auto"
          >
            Add to Favourites
          </button>
        ) : null}

        {resolvedPrimaryAction?.to ? (
          <Link to={resolvedPrimaryAction.to} className="block">
            <button type="button" className={resolvedPrimaryAction.className}>
              {resolvedPrimaryAction.label}
            </button>
          </Link>
        ) : resolvedPrimaryAction ? (
          <button type="button" onClick={resolvedPrimaryAction.onClick} className={resolvedPrimaryAction.className}>
            {resolvedPrimaryAction.label}
          </button>
        ) : null}

        {resolvedSecondaryAction ? (
          <button type="button" onClick={resolvedSecondaryAction.onClick} className={resolvedSecondaryAction.className}>
            {resolvedSecondaryAction.label}
          </button>
        ) : null}
      </div>
    </div>
  );
}
