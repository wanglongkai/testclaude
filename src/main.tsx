import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/index.css'

async function bootstrap() {
	// 仅在开发模式下启用 MSW mock 服务
	// if (import.meta.env.DEV) {
	//   const { worker } = await import('./mocks/browser')
	//   await worker.start({ onUnhandledRequest: 'bypass' })
	// }

	createRoot(document.getElementById('root')!).render(
		<StrictMode>
			<App />
		</StrictMode>,
	)
}

bootstrap()
