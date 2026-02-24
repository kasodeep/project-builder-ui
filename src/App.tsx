import { Toaster } from 'sonner'
import { SpeedInsights } from "@vercel/speed-insights/react"
import './App.css'
import AppRouter from '@/router/AppRouter'

function App() {
  return (
    <>
      <Toaster position="bottom-left" richColors closeButton />
      <SpeedInsights />
      <AppRouter />
    </>
  )
}

export default App
