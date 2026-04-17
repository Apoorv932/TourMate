import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { logoutUser } from '@/features/auth/authSlice';
import { useTheme } from '@/context/ThemeContext';
import { ui } from '@/utils/uiClasses';

function navClass(isActive, isDark) {
  return `${isActive ? (isDark ? ui.navActiveDark : ui.navActiveLight) : (isDark ? ui.navHoverDark : ui.navHoverLight)} px-3 py-2 rounded transition`;
}

export default function AppNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { isDark, toggleTheme } = useTheme();

  async function handleLogout() {
    await dispatch(logoutUser());
    navigate('/login');
  }

  return (
    <header className={`sticky top-0 z-50 ${isDark ? ui.navDark : ui.navLight}`}>
      <nav className="container mx-auto flex flex-wrap items-center justify-between gap-4 p-4">
        <ul className="flex flex-wrap items-center gap-3 text-sm font-medium md:text-base">
          <li>
            <NavLink to="/" className={({ isActive }) => `${isActive ? (isDark ? ui.navActiveDark : ui.navActiveLight) : (isDark ? ui.navHoverDark : ui.navHoverLight)} flex items-center px-3 py-2 rounded transition`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12L12 3l9 9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              TourMate
            </NavLink>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <NavLink to="/homes" className={({ isActive }) => navClass(isActive, isDark)}>
                  Homes
                </NavLink>
              </li>
              <li>
                <NavLink to="/bookings" className={({ isActive }) => navClass(isActive, isDark)}>
                  Bookings
                </NavLink>
              </li>
              <li>
                <NavLink to="/favourites" className={({ isActive }) => navClass(isActive, isDark)}>
                  Favourites
                </NavLink>
              </li>
              {user?.role === 'host' ? (
                <>
                  <li>
                    <NavLink to="/host/host-homelist" className={({ isActive }) => navClass(isActive, isDark)}>
                      Host Homelist
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/host/add-home" className={({ isActive }) => navClass(isActive, isDark)}>
                      Add Home
                    </NavLink>
                  </li>
                </>
              ) : null}
            </>
          ) : null}
        </ul>

        <div className="flex items-center gap-3">
          <button type="button" onClick={toggleTheme} className="rounded bg-white px-3 py-2 font-medium text-black transition hover:bg-yellow-100">
            {isDark ? 'Day Mode' : 'Night Mode'}
          </button>
          {!isLoggedIn ? (
            <>
              <NavLink to="/login" className="rounded bg-white px-4 py-2 font-medium text-black transition hover:bg-yellow-100">
                Login
              </NavLink>
              <NavLink to="/signup" className="rounded bg-white px-4 py-2 font-medium text-black transition hover:bg-yellow-100">
                Sign up
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/profile" className="rounded-full p-2 transition hover:bg-yellow-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
                </svg>
              </NavLink>
              <button type="button" onClick={handleLogout} className="rounded bg-white px-4 py-2 font-medium text-black transition hover:bg-yellow-100">
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
