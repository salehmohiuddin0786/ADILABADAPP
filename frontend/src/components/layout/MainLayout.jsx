import React from 'react';
import { useRouter } from 'next/router';
import PublicHeader from '../../panels/public-website/PublicHeader';
import PublicFooter from '../../panels/public-website/PublicFooter';
import MobileBottomNav from './MobileBottomNav';
import PageTransition from '../common/PageTransition';

export default function MainLayout({ children }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <PublicHeader />
      <main className="flex-1 pb-16 md:pb-0">
        <PageTransition pageKey={router.asPath}>
          {children}
        </PageTransition>
      </main>
      <PublicFooter />
      <MobileBottomNav />
    </div>
  );
}
