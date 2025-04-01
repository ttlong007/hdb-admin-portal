import { Link } from 'react-router-dom'
import HamburgerButton from '@/layouts/hamburger-button'
import Sidebar from '@/layouts/hydrogen/sidebar'
import Logo from '@core/components/logo'
import HeaderMenuRight from '@/layouts/header-menu-right'
import StickyHeader from '@/layouts/sticky-header'

export default function Header() {
  return (
    <StickyHeader className="z-[990] 2xl:py-5 3xl:px-8 4xl:px-10 shadow-sm bg-[#DA2128] sm:flex sm:justify-between">
      <div className="flex w-full max-w-2xl items-center">
        <HamburgerButton
          view={<Sidebar className="static w-full 2xl:w-full" />}
        />
        <Link
          to={'/'}
          aria-label="Site Logo"
          className="me-4 w-9 shrink-0 text-gray-800 hover:text-gray-900 lg:me-5 xl:hidden"
        >
          <Logo />
        </Link>

        <div></div>
      </div>

      <HeaderMenuRight />
    </StickyHeader>
  )
}
