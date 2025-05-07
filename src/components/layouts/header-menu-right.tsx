'use client'

import ProfileMenu from '@layouts/profile-menu'

export default function HeaderMenuRight() {
  return (
    <div className="flex items-center justify-end gap-4">
      <ProfileMenu />
    </div>
  )
}
