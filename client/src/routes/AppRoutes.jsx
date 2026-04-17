import { Route, Routes } from 'react-router-dom';

import MainLayout from '@/layout/MainLayout';
import AuthLayout from '@/layout/AuthLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import HomesPage from '@/pages/HomesPage';
import HomeDetailPage from '@/pages/HomeDetailPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ProfilePage from '@/pages/ProfilePage';
import FavouritesPage from '@/pages/FavouritesPage';
import BookingsPage from '@/pages/BookingsPage';
import HostHomesPage from '@/pages/host/HostHomesPage';
import HostHomeFormPage from '@/pages/host/HostHomeFormPage';
import SuccessPage from '@/pages/host/SuccessPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="homes" element={<HomesPage />} />
        <Route path="homes/:homeId" element={<HomeDetailPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="favourites" element={<FavouritesPage />} />
          <Route path="bookings" element={<BookingsPage />} />
        </Route>
        <Route path="host" element={<ProtectedRoute role="host" />}>
          <Route path="host-homelist" element={<HostHomesPage />} />
          <Route path="add-home" element={<HostHomeFormPage mode="create" />} />
          <Route path="edit-home/:homeId" element={<HostHomeFormPage mode="edit" />} />
          <Route path="success" element={<SuccessPage />} />
        </Route>
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
