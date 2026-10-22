import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

export async function enableMocking() {
  // Always enable MSW in dev and demo deployments unless explicitly disabled
  if (import.meta.env.VITE_ENABLE_MSW === 'false') {
    return
  }

  await worker.start({
    quiet: true,
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })
}
