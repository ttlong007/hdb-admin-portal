import { useRoutes, Navigate } from 'react-router-dom'
import Layout from './components/layouts/Layout'
import Home from './pages/Merchants'
import CreateMerchant from './pages/Merchants/CreateMerchant'
import Transactions from './pages/Transactions'
import Staffs from './pages/Staffs'
import StaffDetail from './pages/Staffs/StaffDetail'
import CreateStaff from './pages/Staffs/CreateStaff'
import { routes } from './config/routes'
import TransactionDetail from './pages/Transactions/TransactionDetail'
import MasterMerchants from './pages/MasterMerchants'
import MasterMerchantDetail from './pages/MasterMerchants/MasterMerchantDetail'
import MerchantDetail from './pages/Merchants/MerchantDetail'
import MasterMerchantEdit from './pages/MasterMerchants/MasterMerchantEdit'
import StaffEdit from './pages/Staffs/StaffEdit'
import MerchantEdit from './pages/Merchants/MerchantEdit'
import Unauthorize from './pages/Unauthorize'

function RootRoutes() {
  const isAuthenticated = Boolean(localStorage.getItem('accessToken'))

  const rootRoutes = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: isAuthenticated ? (
            <Navigate to={routes.masterMerchant} replace />
          ) : (
            // Optionally, set another default route for non-authenticated users.
            <Navigate to={routes.unauthorize} replace />
          ),
        },

        { path: routes.unauthorize, element: <Unauthorize /> },
        { path: routes.masterMerchant, element: <MasterMerchants /> },
        {
          path: routes.masterMerchantDetail,
          element: <MasterMerchantDetail />,
        },
        { path: routes.editMasterMerchant, element: <MasterMerchantEdit /> },
        { path: routes.merchant, element: <Home /> },
        { path: routes.createMerchant, element: <CreateMerchant /> },
        { path: routes.editMerchant, element: <MerchantEdit /> },
        { path: routes.merchantDetail, element: <MerchantDetail /> },
        { path: routes.transaction, element: <Transactions /> },
        { path: routes.transactionDetail, element: <TransactionDetail /> },
        { path: routes.staff, element: <Staffs /> },
        { path: routes.staffDetail, element: <StaffDetail /> },
        { path: routes.createStaff, element: <CreateStaff /> },
        { path: routes.editStaff, element: <StaffEdit /> },
      ],
    },
  ]

  return useRoutes(rootRoutes)
}

export default RootRoutes
