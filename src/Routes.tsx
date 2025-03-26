import { useRoutes } from 'react-router-dom'
import Layout from './Layout'
import Home from './pages/Home'
import CreateMerchant from './pages/Home/CreateMerchant'
import MerchantDetail from './pages/Home/MerchantDetail'

export const routes = {
  home: '/',
  createMerchant: '/create-merchant',
  merchantDetail: '/merchant/:merchantId',
}

function RootRoutes() {
  const rootRoutes = [
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/create-merchant', element: <CreateMerchant /> },
        { path: '/merchant/:merchantId', element: <MerchantDetail /> },
      ],
    },
  ]

  return useRoutes(rootRoutes)
}

export default RootRoutes
