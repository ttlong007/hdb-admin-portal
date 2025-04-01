import { useRoutes } from 'react-router-dom'
import Layout from './Layout'
import Home from './pages/Merchants'
import CreateMerchant from './pages/Merchants/CreateMerchant'
import MerchantDetail from './pages/Merchants/MerchantDetail'
import Transactions from './pages/Transactions'
import Staffs from './pages/Staffs'
import StaffDetail from './pages/Staffs/StaffDetail'
import CreateStaff from './pages/Staffs/CreateStaff'
import { routes } from './config/routes'
import TransactionDetail from './pages/Transactions/TransactionDetail'

function RootRoutes() {
  const rootRoutes = [
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/', element: <Home /> },
        { path: routes.createMerchant, element: <CreateMerchant /> },
        { path: routes.merchantDetail, element: <MerchantDetail /> },
        { path: routes.transaction, element: <Transactions /> },
        { path: routes.transactionDetail, element: <TransactionDetail /> },
        { path: routes.staff, element: <Staffs /> },
        { path: routes.staffDetail, element: <StaffDetail /> },
        { path: routes.createStaff, element: <CreateStaff /> },
      ],
    },
  ]

  return useRoutes(rootRoutes)
}

export default RootRoutes
