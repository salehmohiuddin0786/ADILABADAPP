import React from 'react';
import PublicHeader from '../../panels/public-website/PublicHeader';
import PublicFooter from '../../panels/public-website/PublicFooter';
import MobileBottomNav from './MobileBottomNav';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <PublicHeader />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <PublicFooter />
      <MobileBottomNav />
    </div>
  );
}
