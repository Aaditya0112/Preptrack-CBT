import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DefaultHeader from './DefaultHeader';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  
  
  const hideHeaderFooter = ['/assessment', '/', "/signup"];
  const hideFooter = ['/analysis'];
  
  const shouldHideHeaderFooter = hideHeaderFooter.includes(location.pathname);
  const shouldHideFooter = hideFooter.includes(location.pathname);

  if (shouldHideFooter && !shouldHideHeaderFooter) {
    return (
      <div className="flex flex-col min-h-screen">
        <DefaultHeader />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  }

  if (shouldHideHeaderFooter) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DefaultHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

