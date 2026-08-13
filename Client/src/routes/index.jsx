import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'
import ErrorBoundary from '../components/ErrorBoundary'
import ProtectedRoute from '../components/ProtectedRoute'

// Lazy loaded pages
const Login = lazy(() => import('../pages/Login'))
const SaasDashboard = lazy(() => import('../pages/SaasDashboard'))
const Leads = lazy(() => import('../pages/Leads'))
const LeadGenerate = lazy(() => import('../pages/LeadGenerate'))
const Analytics = lazy(() => import('../pages/Analytics'))
const Incentives = lazy(() => import('../pages/Incentives'))
const Employees = lazy(() => import('../pages/Employees'))
const Users = lazy(() => import('../pages/Users'))
const LeadSources = lazy(() => import('../pages/LeadSources'))
const AuditHistory = lazy(() => import('../pages/AuditHistory'))
const Settings = lazy(() => import('../pages/Settings'))
const NotFound = lazy(() => import('../pages/NotFound'))

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
)

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Login />
      </Suspense>
    ),
  },

  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  {
    path: '/admin',

    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      </ErrorBoundary>
    ),

    errorElement: (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFound />
      </Suspense>
    ),

    children: [
      {
        index: true,

        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SaasDashboard />
          </Suspense>
        ),
      },

      {
        path: 'dashboard',

        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SaasDashboard />
          </Suspense>
        ),
      },

      {
        path: 'leads',

        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Leads />
          </Suspense>
        ),
      },

      {
        path: 'generate-lead',

        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LeadGenerate />
          </Suspense>
        ),
      },

      {
        path: 'analytics',

        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Analytics />
          </Suspense>
        ),
      },

      {
        path: 'incentives',

        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Incentives />
          </Suspense>
        ),
      },

      {
        path: 'employees',

        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Employees />
          </Suspense>
        ),
      },

      {
        path: 'users',

        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Users />
          </Suspense>
        ),
      },

      {
        path: 'lead-sources',

        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LeadSources />
          </Suspense>
        ),
      },

      {
        path: 'audit-history',

        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AuditHistory />
          </Suspense>
        ),
      },

      {
        path: 'settings',

        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Settings />
          </Suspense>
        ),
      },
    ],
  },

  {
    path: '*',

    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFound />
      </Suspense>
    ),
  },
])

export default router