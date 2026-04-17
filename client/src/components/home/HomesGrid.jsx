import HomeCard from './HomeCard';

export default function HomesGrid({ homes = [], ...cardProps }) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {homes.map((home) => (
        <HomeCard key={home.id} home={home} {...cardProps} />
      ))}
    </div>
  );
}
