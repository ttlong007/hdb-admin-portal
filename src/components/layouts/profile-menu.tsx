import { Title, Text, Avatar, Button, Popover } from 'rizzui'
import cn from '@core/utils/class-names'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/store/authSlice/useAuth'
import axiosInstance from '@/config/axios'
import { SYSTEM_ROLES } from '@/config/constants'

export default function ProfileMenu({
  buttonClassName,
  avatarClassName,
  username = false,
}: {
  buttonClassName?: string
  avatarClassName?: string
  username?: boolean
}) {
  const { setAuthState, isAuthenticated } = useAuth()

  // Check both state and localStorage for authentication
  const hasToken = isAuthenticated || Boolean(localStorage.getItem('accessToken'))

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/admin/profile/me')
      if (response.data.status_code === 'ACCEPT') {
        const profileData = response.data.data
        const userInfo = {
          id: profileData.id,
          // Use display_name if available; otherwise full_name
          name: profileData.display_name || profileData.full_name,
          avatar: profileData.avatar,
          email: profileData.email,
          nationalId: profileData.national_id,
          phoneNumber: profileData.phone_number,
          status: profileData.status,
          role: profileData.role,
        }

        setAuthState({ user: userInfo })
        return userInfo
      }
      throw new Error(response.data.reason_message || 'Failed to fetch profile')
    },
    // CRITICAL: Only fetch when authenticated and has token
    enabled: hasToken,
    staleTime: 5 * 60 * 1000, // 5 minutes - avoid unnecessary refetches
    retry: 1, // Only retry once on failure
  })
  useQuery({
    queryKey: ['systemConfig'],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/admin/system-config/list')
      if (response.data.status_code === 'ACCEPT') {
        const systemConfigData = response.data.data
        const formattedConfig = systemConfigData.reduce((acc: any, config: any) => {
          acc[config.key] = config.value
          return acc
        }, {})
        setAuthState({ systemConfig: formattedConfig })
        return formattedConfig
      }
      throw new Error(
        response.data.reason_message || 'Failed to fetch system config'
      )
    },
    // CRITICAL: Only fetch when authenticated and has token
    enabled: hasToken,
    staleTime: 10 * 60 * 1000, // 10 minutes - system config rarely changes
    retry: 1,
  })

  return (
    <ProfileMenuPopover>
      <Popover.Trigger>
        <button
          className={cn(
            'w-9 shrink-0 rounded-full outline-none focus-visible:ring-[1.5px] focus-visible:ring-gray-400 focus-visible:ring-offset-2 active:translate-y-px sm:w-10',
            buttonClassName
          )}
        >
          <Avatar
            src={profile?.avatar || '/avatar.png'}
            name={profile?.name || 'User'}
            className={cn('!h-9 w-9 sm:!h-10 sm:!w-10', avatarClassName)}
            color="warning"
          />
          {!!username && (
            <span className="username hidden text-gray-200 dark:text-gray-700 md:inline-flex">
              Hi, {profile?.name || 'User'}
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Content className="z-[9999] p-0 dark:bg-gray-100 [&>svg]:dark:fill-gray-100">
        <DropdownMenu profile={profile} />
      </Popover.Content>
    </ProfileMenuPopover>
  )
}

function ProfileMenuPopover({ children }: React.PropsWithChildren<{}>) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <Popover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      shadow="sm"
      placement="bottom-end"
    >
      {children}
    </Popover>
  )
}

interface MenuItem {
  name: string
  href: string
}

const menuItems: MenuItem[] = [
  {
    name: 'My Profile',
    href: '/',
  },
  {
    name: 'Account Settings',
    href: '/',
  },
  {
    name: 'Activity Log',
    href: '#',
  },
]

interface DropdownMenuProps {
  profile: any
}

function DropdownMenu({ profile }: DropdownMenuProps) {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  console.log('profile', profile)
  return (
    <div className="text-left rtl:text-right">
      <div className="flex items-center border-b border-gray-300 px-6 pb-5 pt-6">
        <Avatar
          src={profile?.avatar || '/avatar.png'}
          name={profile?.name || 'User'}
          color="warning"
        />
        <div className="ms-3">
          <Title as="h6" className="font-semibold">
            {profile?.name || 'User'}
          </Title>
          <Text className="text-gray-600">
            {profile?.email || 'email@example.com'}
          </Text>

          {profile?.role ? (
            <Text className="text-gray-600">
              <strong>Quyền: </strong>
              {SYSTEM_ROLES[profile?.role]}
            </Text>
          ) : null}
        </div>
      </div>
      <div className="border-t border-gray-300 px-6 pb-6 pt-5">
        <Button
          className="h-auto w-full justify-start p-0 font-medium text-gray-700 outline-none focus-within:text-gray-600 hover:text-gray-900 focus-visible:ring-0"
          variant="text"
          onClick={handleLogout}
        >
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}
