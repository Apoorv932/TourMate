import EmptyState from '@/components/shared/EmptyState';

export default function NotFoundPage() {
  return <EmptyState title="404" description="Oops! Page Not Found" actionLabel="Go Back Home" actionTo="/" />;
}
