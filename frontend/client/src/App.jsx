import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { restoreSession } from '@/features/auth/authSlice';
import AppRoutes from '@/routes/AppRoutes';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return <AppRoutes />;
}
