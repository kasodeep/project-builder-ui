import { Toaster } from 'sonner'
import './App.css'
import AppRouter from '@/router/AppRouter'

function App() {
  return (
    <>
      <Toaster position="bottom-left" richColors closeButton />
      <AppRouter />
    </>
  )
}

export default App
