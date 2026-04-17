import { Outlet } from 'react-router-dom';

import AppNavbar from '@/components/layout/AppNavbar';
import { useTheme } from '@/context/ThemeContext';
import { ui } from '@/utils/uiClasses';

export default function MainLayout() {
  const { isDark } = useTheme();

  return (
    <div className={`${ui.pageShell} ${isDark ? ui.pageDark : ui.pageLight}`}>
      <AppNavbar />
      <Outlet />
    </div>
  );
}
