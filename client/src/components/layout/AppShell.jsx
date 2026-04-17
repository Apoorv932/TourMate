import AppNavbar from './AppNavbar';

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />
      {children}
    </div>
  );
}
