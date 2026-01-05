'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { FileText, FolderOpen, Eye, Clock } from 'lucide-react'

export default function DashboardPage() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/dashboard/stats')
            setStats(response.data.data)
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading...</div>
            </div>
        )
    }

    const statCards = [
        {
            title: 'Total Posts',
            value: stats?.overview?.totalPosts || 0,
            icon: FileText,
            color: 'bg-blue-500',
        },
        {
            title: 'Active Posts',
            value: stats?.overview?.activePosts || 0,
            icon: Eye,
            color: 'bg-green-500',
        },
        {
            title: 'Expired Posts',
            value: stats?.overview?.expiredPosts || 0,
            icon: Clock,
            color: 'bg-orange-500',
        },
        {
            title: 'Categories',
            value: stats?.overview?.totalCategories || 0,
            icon: FolderOpen,
            color: 'bg-purple-500',
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-600">Overview of your content management system</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.title} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Posts by Status */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Posts by Status</h2>
                    <div className="space-y-3">
                        {stats?.postsByStatus && Object.entries(stats.postsByStatus).map(([status, count]) => (
                            <div key={status} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                                <span className="text-sm font-bold text-gray-900">{count}</span>
                            </div>
                        ))}
                        {(!stats?.postsByStatus || Object.keys(stats.postsByStatus).length === 0) && (
                            <p className="text-sm text-gray-500">No data available</p>
                        )}
                    </div>
                </div>

                {/* Posts by Category */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Posts by Category</h2>
                    <div className="space-y-3">
                        {stats?.postsByCategory?.slice(0, 5).map((item) => (
                            <div key={item.category} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">{item.category}</span>
                                <span className="text-sm font-bold text-gray-900">{item.count}</span>
                            </div>
                        ))}
                        {(!stats?.postsByCategory || stats.postsByCategory.length === 0) && (
                            <p className="text-sm text-gray-500">No data available</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Updated
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stats?.recentPosts?.map((post) => (
                                <tr key={post._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {post.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {post.category?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800' :
                                                post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(post.updatedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {(!stats?.recentPosts || stats.recentPosts.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No posts yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
