import { JotaiProvider } from './jotai-provider'
import { DrawerViews } from '@core/drawer-views'
import { ModalViews } from '@core/modal-views'

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <JotaiProvider>
      {children}
      <DrawerViews />
      <ModalViews />
    </JotaiProvider>
  )
}
