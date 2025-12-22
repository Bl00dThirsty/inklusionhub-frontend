
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/sign-up');
    }
  }, [router]);
  
  return <>{children}</>;
}

// import ProtectedRoute from '@/components/ProtectedRoute';

// export default function RoleSelectionPage() {
//   return (
//     <ProtectedRoute>
//       {/* Votre contenu existant */}
//     </ProtectedRoute>
//   );
// }