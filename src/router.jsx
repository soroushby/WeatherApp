import { lazy, Suspense } from 'react';
import {
  createRouter,
  createRootRoute,
  createRoute,
  createHashHistory,
  Outlet,
} from '@tanstack/react-router';
import LoadingSkeleton from './components/LoadingSkeleton';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const CityPage = lazy(() => import('./pages/CityPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-dark-900 flex items-center justify-center">
    <LoadingSkeleton type="page" />
  </div>
);

// Root layout component
const RootLayout = () => (
  <div className="min-h-screen bg-dark-900">
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  </div>
);

// Create root route
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Home route - /
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <HomePage />
    </Suspense>
  ),
});

// City detail route - /city/:cityName
const cityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/city/$cityName',
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <CityPage />
    </Suspense>
  ),
});

// Favorites route - /favorites
const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/favorites',
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <FavoritesPage />
    </Suspense>
  ),
});

// Create route tree
const routeTree = rootRoute.addChildren([
  homeRoute,
  cityRoute,
  favoritesRoute,
]);

// Use hash-based routing for GitHub Pages compatibility
const hashHistory = createHashHistory();

// Create and export router
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  history: hashHistory,
});
