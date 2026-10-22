import React from 'react'
import { createRootRoute, Outlet, ScrollRestoration } from '@tanstack/react-router'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { ScenarioManager } from '../components/common/ScenarioManager'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary selection:bg-brand selection:text-background font-sans antialiased">
      <ScrollRestoration />
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      <ScenarioManager />
    </div>
  )
}
