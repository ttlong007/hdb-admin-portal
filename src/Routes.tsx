import { useRoutes, Navigate } from 'react-router-dom'
import Layout from './components/layouts/Layout'
import Dashboard from './pages/Dashboard'
import Home from './pages/Merchants'
import CreateMerchant from './pages/Merchants/CreateMerchant'
import Transactions from './pages/Transactions'
import Staffs from './pages/Staffs'
import StaffDetail from './pages/Staffs/StaffDetail'
import CreateStaff from './pages/Staffs/CreateStaff'
import { routes } from './config/routes'
import TransactionDetail from './pages/Transactions/TransactionDetail'
import NonFinancialTransactionDetail from './pages/Transactions/NonFinancialTransactionDetail'
import CollaboratorTransactionDetail from './pages/Transactions/CollaboratorTransactionDetail'
import MasterMerchants from './pages/MasterMerchants'
import MasterMerchantDetail from './pages/MasterMerchants/MasterMerchantDetail'
import MerchantDetail from './pages/Merchants/MerchantDetail'
import MasterMerchantEdit from './pages/MasterMerchants/MasterMerchantEdit'
// import StaffEdit from './pages/Staffs/StaffEdit'
import MerchantEdit from './pages/Merchants/MerchantEdit'
import ReconcileHistory from './pages/ReconcileHistory'
import Unauthorize from './pages/Unauthorize'
import { useAuth } from './store/authSlice/useAuth'

function RootRoutes() {
  const { isAuthenticated } = useAuth()
  // Fallback to localStorage if auth state is not initialized
  const hasToken = isAuthenticated || Boolean(localStorage.getItem('accessToken'))

  const rootRoutes = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: hasToken ? (
            <Navigate to={routes.dashboard} />
          ) : (
            <Navigate to={routes.unauthorize} />
          ),
        },
        { path: routes.dashboard, element: <Dashboard /> },
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
        { path: routes.nonFinancialTransactionDetail, element: <NonFinancialTransactionDetail /> },
        { path: routes.collaboratorTransactionDetail, element: <CollaboratorTransactionDetail /> },
        { path: routes.transactionDetail, element: <TransactionDetail /> },
        { path: routes.staff, element: <Staffs /> },
        { path: routes.staffDetail, element: <StaffDetail /> },
        { path: routes.createStaff, element: <CreateStaff /> },
        // { path: routes.editStaff, element: <StaffEdit /> },
        { path: routes.reconcileHistory, element: <ReconcileHistory /> },
      ],
    },
    { path: routes.unauthorize, element: <Unauthorize /> },
  ]

  return useRoutes(rootRoutes)
}

export default RootRoutes
