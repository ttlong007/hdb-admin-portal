'use client'

import { Badge, ActionIcon } from 'rizzui'
import MessagesDropdown from '@layouts/messages-dropdown'
import ProfileMenu from '@layouts/profile-menu'
import NotificationDropdown from './notification-dropdown'
import { CiMail, CiBellOn } from 'react-icons/ci'
import { IoChevronDown } from 'react-icons/io5'

export default function HeaderMenuRight() {
  return (
    <div className="flex items-center justify-end gap-4">
      <div className="relative inline-block">
        <select
          aria-label="Select Company"
          className="bg-transparent text-white rounded px-2 py-1 pr-8 outline-none border-none"
          value="1"
        >
          <option value="1" disabled>
            CONG TY TNHH KHUNG ANH VIET
          </option>
          <option value="company1">Company One</option>
          <option value="company2">Company Two</option>
          <option value="company3">Company Three</option>
        </select>
        <IoChevronDown
          className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2"
          size={20}
          color="white"
        />
      </div>

      <div className="ms-auto grid shrink-0 grid-cols-4 items-center gap-2 text-gray-700 xs:gap-3 xl:gap-4">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0432 16.3052C13.6693 17.4041 11.9267 18.0612 10.0306 18.0612C5.59543 18.0612 2 14.4658 2 10.0306C2 5.59543 5.59543 2 10.0306 2C14.4658 2 18.0612 5.59543 18.0612 10.0306C18.0612 11.9268 17.4041 13.6694 16.3051 15.0433L21.9999 20.7381L20.738 22L15.0432 16.3052ZM3.78458 10.0306C3.78458 6.58103 6.58103 3.78458 10.0306 3.78458C13.4802 3.78458 16.2767 6.58103 16.2767 10.0306C16.2767 11.7129 15.6116 13.2399 14.53 14.3629L14.3629 14.53C13.2399 15.6116 11.7129 16.2767 10.0306 16.2767C6.58103 16.2767 3.78458 13.4802 3.78458 10.0306Z"
              fill="white"
              fillOpacity="0.8"
            />
          </svg>
        </div>
        <NotificationDropdown>
          <ActionIcon
            aria-label="Notification"
            variant="text"
            className="relative h-[34px] w-[34px] shadow backdrop-blur-md md:h-9 md:w-9"
          >
            <CiBellOn size={24} color="white" />
            <Badge
              renderAsDot
              color="warning"
              enableOutlineRing
              className="absolute right-2.5 top-2.5 -translate-y-1/3 translate-x-1/2"
            />
          </ActionIcon>
        </NotificationDropdown>
        <MessagesDropdown>
          <ActionIcon
            aria-label="Messages"
            variant="text"
            className="relative h-[34px] w-[34px] shadow backdrop-blur-md md:h-9 md:w-9"
          >
            <CiMail size={24} color="white" />
            <Badge
              renderAsDot
              color="success"
              enableOutlineRing
              className="absolute right-2.5 top-2.5 -translate-y-1/3 translate-x-1/2"
            />
          </ActionIcon>
        </MessagesDropdown>

        <ProfileMenu />
      </div>
    </div>
  )
}
