'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import {
  Bars3Icon,
  HomeIcon,
  FolderIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { Logo } from './Logo'

interface User {
  id: string;
  name: string | null;
  email: string;
  profileImage: string | null;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderIcon },
  { name: 'Teams', href: '/dashboard/teams', icon: UserGroupIcon },
  { name: 'Users', href: '/dashboard/users', icon: UsersIcon },
  { name: 'Tasks', href: '/dashboard/tasks', icon: ClipboardDocumentListIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Tags', href: '/dashboard/settings/tags', icon: TagIcon },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    fetchUser()

    // Listen for profile updates
    const handleProfileUpdate = () => {
      fetchUser()
    }
    window.addEventListener('profileUpdate', handleProfileUpdate)

    return () => {
      window.removeEventListener('profileUpdate', handleProfileUpdate)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        router.push('/auth/signin')
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    return email[0].toUpperCase()
  }

  return (
    <div className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/dashboard">
                <Logo size="xs" className="h-6" />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-1 rounded-full bg-white p-1 hover:bg-gray-50">
                {user && (
                  user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={user.name || user.email}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">
                        {getInitials(user.name, user.email)}
                      </span>
                    </div>
                  )
                )}
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/dashboard/profile"
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } block px-4 py-2 text-sm text-gray-700`}
                      >
                        Your Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/dashboard/settings"
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } block px-4 py-2 text-sm text-gray-700`}
                      >
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleSignOut}
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50`}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Menu as="div" className="relative">
              <Menu.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                <Bars3Icon className="h-6 w-6" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {navigation.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <Link
                          href={item.href}
                          className={`${
                            active ? 'bg-gray-50' : ''
                          } block px-4 py-2 text-sm text-gray-700`}
                        >
                          {item.name}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  )
}
