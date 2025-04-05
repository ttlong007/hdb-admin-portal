import { Outlet } from 'react-router-dom'

import GlobalDrawer from '../core/shared/drawer-views/container'
import GlobalModal from '../core/shared/modal-views/container'
import HydrogenLayout from './hydrogen/layout'

const Layout = () => {
  return (
    <HydrogenLayout>
      <Outlet />
      <GlobalDrawer />
      <GlobalModal />
    </HydrogenLayout>
  )
}

export default Layout
