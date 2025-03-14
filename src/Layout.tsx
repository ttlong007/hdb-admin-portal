import { Outlet } from 'react-router-dom'

import GlobalDrawer from './shared/drawer-views/container'
import GlobalModal from './shared/modal-views/container'
import HydrogenLayout from './layouts/hydrogen/layout'

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
