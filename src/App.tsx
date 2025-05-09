import { useNavigate } from 'react-router-dom'

import { useEffect } from 'react'
import { setNavigate } from '@/config/axios'

import RootRoutes from './Routes'

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    setNavigate(navigate)
  }, [navigate])

  return <RootRoutes />
}

export default App
