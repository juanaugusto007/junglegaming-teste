import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { enableMocking } from './infrastructure/msw/browser'
import { routeTree } from './routeTree.gen'
import './index.css'

// Initialize TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Initialize TanStack Router
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
})

// Register router for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Start MSW mock service worker, then mount React application
enableMocking().then(() => {
  const rootElement = document.getElementById('root')!
  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </React.StrictMode>
    )
  }
})
