import React, { useState } from 'react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import MobileBottomNav from '../../components/layout/MobileBottomNav';

export default function PublicLayout({ children }) {
  const [currentLocation, setCurrentLocation] = useState('Adilabad Town');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors">
      <PublicHeader
        selectedLocation={currentLocation}
        onSelectLocation={setCurrentLocation}
      />
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <PublicFooter />
      <MobileBottomNav />
    </div>
  );
}
