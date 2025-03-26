import { useRoutes } from 'react-router-dom'
import Layout from './Layout'
import Home from './pages/Home'
import CreateMerchant from './pages/Home/CreateMerchant'
import MerchantDetail from './pages/Home/MerchantDetail'
import Transactions from './pages/Transactions'
import Staffs from './pages/Staffs'

function RootRoutes() {
  const rootRoutes = [
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/create-merchant', element: <CreateMerchant /> },
        { path: '/merchant/:merchantId', element: <MerchantDetail /> },
        { path: '/transactions', element: <Transactions /> },
        { path: '/staffs', element: <Staffs /> },
      ],
    },
  ]

  return useRoutes(rootRoutes)
}

export default RootRoutes
