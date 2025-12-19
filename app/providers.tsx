
'use client';
import { AuthProvider } from './(auth)/sign-in/context/authContext';
import { Provider } from 'react-redux';
import { store } from '../state/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Provider store={store}>{children}</Provider>
    </AuthProvider>
  );
}