export default function PageCard({ className = '', children }) {
  return <div className={`rounded-lg bg-white shadow-lg ${className}`}>{children}</div>;
}
