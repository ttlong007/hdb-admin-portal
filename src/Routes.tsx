import { useRoutes } from 'react-router-dom'
import Layout from './Layout'
import GlobalDrawer from './shared/drawer-views/container'

const HomePage = () => {
  return (
    <div>
      <GlobalDrawer />
      Home Page
    </div>
  )
}

function RootRoutes() {
  const routes = [
    {
      path: '/',
      element: <Layout />,
      children: [{ path: '/', element: <HomePage /> }],
    },
  ]

  return useRoutes(routes)
}

export default RootRoutes
