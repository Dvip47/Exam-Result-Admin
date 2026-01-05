'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { clearAuth, getUser } from '@/lib/auth'
import {
    LayoutDashboard,
    FolderOpen,
    FileText,
    FileEdit,
    Image,
    LogOut,
    Menu,
    X,
} from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function DashboardLayout({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const user = getUser()

    const handleLogout = () => {
        clearAuth()
        router.push('/login')
    }

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Categories', href: '/dashboard/categories', icon: FolderOpen },
        { name: 'Posts', href: '/dashboard/posts', icon: FileText },
        { name: 'Pages', href: '/dashboard/pages', icon: FileEdit },
        { name: 'Media', href: '/dashboard/media', icon: Image },
    ]

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-100">
                {/* Mobile sidebar */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white">
                            <div className="flex items-center justify-between h-16 px-4 bg-red-600">
                                <span className="text-xl font-bold text-white">Admin Panel</span>
                                <button onClick={() => setSidebarOpen(false)} className="text-white">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                                {navigation.map((item) => {
                                    const Icon = item.icon
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${isActive
                                                ? 'bg-red-100 text-red-600'
                                                : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <Icon className="mr-3 h-5 w-5" />
                                            {item.name}
                                        </Link>
                                    )
                                })}
                            </nav>
                        </div>
                    </div>
                )}

                {/* Desktop sidebar */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                    <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
                        <div className="flex items-center h-16 px-4 bg-red-600">
                            <span className="text-xl font-bold text-white">Daily Exam Result</span>
                        </div>
                        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                            {navigation.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${isActive
                                            ? 'bg-red-100 text-red-600'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon className="mr-3 h-5 w-5" />
                                        {item.name === 'Dashboard' ? 'Overview' : item.name}
                                    </Link>
                                )
                            })}
                        </nav>
                        <div className="p-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{user?.role}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="lg:pl-64">
                    {/* Top bar */}
                    <div className="sticky top-0 z-10 flex h-16 bg-white border-b border-gray-200 lg:hidden">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="px-4 text-gray-500 focus:outline-none"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="flex items-center flex-1 px-4">
                            <span className="text-lg font-bold text-red-600">Daily Exam Result Admin</span>
                        </div>
                    </div>

                    {/* Page content */}
                    <main className="p-4 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}
