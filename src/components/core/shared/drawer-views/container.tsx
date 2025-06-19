
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Drawer } from 'rizzui'

import cn from '@core/utils/class-names'
import { useDrawer } from './use-drawer'

export default function GlobalDrawer() {
  const { isOpen, view, placement, containerClassName, closeDrawer } =
    useDrawer()
  const location = useLocation()

  useEffect(() => {
    closeDrawer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeDrawer}
      placement={placement}
      overlayClassName="dark:bg-opacity-40 dark:backdrop-blur-md"
      containerClassName={cn(
        'min-w-[320px] max-w-[420px] dark:bg-gray-100',
        containerClassName
      )}
      className="z-[9999]"
    >
      {view}
    </Drawer>
  )
}
