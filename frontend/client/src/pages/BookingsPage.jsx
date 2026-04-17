import EmptyState from '@/components/shared/EmptyState';

export default function BookingsPage() {
  return <EmptyState title="No Booking to show" description="Plan a trip soon!" actionLabel="Go Back Home" actionTo="/" />;
}
