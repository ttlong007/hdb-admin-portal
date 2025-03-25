import { useRoutes } from 'react-router-dom'
import Layout from './Layout'
import Home from './pages/home'

function RootRoutes() {
  const routes = [
    {
      path: '/',
      element: <Layout />,
      children: [{ path: '/', element: <Home /> }],
    },
  ]

  return useRoutes(routes)
}

export default RootRoutes
