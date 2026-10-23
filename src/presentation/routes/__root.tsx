import { createRootRoute, Outlet, ScrollRestoration } from '@tanstack/react-router'
import type {} from '../../router'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { BottomNav } from '../components/layout/BottomNav'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary selection:bg-brand selection:text-background font-sans antialiased">
      <ScrollRestoration getKey={(location) => location.pathname} />
      <Header />
      <main className="flex-1 w-full pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
