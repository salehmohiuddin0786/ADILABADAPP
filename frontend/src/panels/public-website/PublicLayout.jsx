import React, { useState } from 'react';
import { useRouter } from 'next/router';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import PageTransition from '../../components/common/PageTransition';

export default function PublicLayout({ children }) {
  const [currentLocation, setCurrentLocation] = useState('Adilabad Town');
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors">
      <PublicHeader
        selectedLocation={currentLocation}
        onSelectLocation={setCurrentLocation}
      />
      <main className="flex-1 pb-16 md:pb-0 overflow-x-hidden">
        <PageTransition pageKey={router.asPath}>
          {children}
        </PageTransition>
      </main>
      <PublicFooter />
      <MobileBottomNav />
    </div>
  );
}
