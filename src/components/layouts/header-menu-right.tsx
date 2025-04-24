'use client'

import ProfileMenu from '@layouts/profile-menu'
import NotificationDropdown from './notification-dropdown'
import { CiMail, CiBellOn } from 'react-icons/ci'
import { IoChevronDown } from 'react-icons/io5'

export default function HeaderMenuRight() {
  return (
    <div className="flex items-center justify-end gap-4">
      <ProfileMenu />
    </div>
  )
}
