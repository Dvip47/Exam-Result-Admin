'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { Plus, Edit, Trash2, Search, Eye, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import Loader from '@/components/Loader'

export default function PostsPage() {
    const [posts, setPosts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')

    // Pagination state
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(100)
    const [totalPosts, setTotalPosts] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        fetchPosts()
    }, [page, limit, statusFilter, categoryFilter])

    // Search with debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (page !== 1) setPage(1)
            else fetchPosts()
        }, 500)
        return () => clearTimeout(timer)
    }, [searchTerm])

    const fetchCategories = async () => {
        try {
            const res = await api.get('/admin/categories')
            setCategories(res.data.data || [])
        } catch (err) {
            console.error('Error fetching categories:', err)
        }
    }

    const fetchPosts = async () => {
        try {
            setLoading(true)
            const params = {
                page,
                limit,
                status: statusFilter === 'all' ? undefined : statusFilter,
                category: categoryFilter === 'all' ? undefined : categoryFilter,
                search: searchTerm || undefined
            }
            const res = await api.get('/admin/posts', { params })
            const data = res.data.data
            setPosts(data?.posts || [])
            setTotalPosts(data?.pagination?.total || 0)
            setTotalPages(data?.pagination?.pages || 1)
        } catch (err) {
            console.error('Error fetching posts:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return

        try {
            await api.delete(`/admin/posts/${id}`)
            // Instead of just filtering local state, refetch to keep pagination accurate
            fetchPosts()
        } catch (err) {
            console.error('Error deleting post:', err)
            alert('Failed to delete post')
        }
    }

    // Handlers for filter changes to reset page
    const handleStatusChange = (value) => {
        setStatusFilter(value)
        setPage(1)
    }

    const handleCategoryChange = (value) => {
        setCategoryFilter(value)
        setPage(1)
    }

    const handleLimitChange = (value) => {
        setLimit(parseInt(value))
        setPage(1)
    }

    // Use current results directly (server-side filtered)
    const displayPosts = posts
    // console.log("posts", posts);
    // console.log("totalPosts", totalPosts);


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Manage Posts</h1>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard/posts/agent-create"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-lg hover:bg-red-50"
                    >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Post by Title {"(AI)"}
                    </Link>

                    <Link
                        href="/dashboard/posts/agent"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-lg hover:bg-red-50"
                    >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Post by Description {"(AI)"}
                    </Link>
                    <Link
                        href="/dashboard/posts/create"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create New Post
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow sm:flex-row sm:items-center">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 whitespace-nowrap">Per Page:</span>
                        <select
                            className="p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                            value={limit}
                            onChange={(e) => handleLimitChange(e.target.value)}
                        >
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={150}>150</option>
                            <option value={200}>200</option>
                        </select>
                    </div>

                    <select
                        className="p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                        value={statusFilter}
                        onChange={(e) => handleStatusChange(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>

                    <select
                        className="p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                        value={categoryFilter}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Posts Table */}
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">S No.</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                            {/* <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Last Date</th> */}
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center">
                                    <Loader />
                                </td>
                            </tr>
                        ) : displayPosts.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No posts found
                                </td>
                            </tr>
                        ) : (
                            displayPosts.map((post, index) => (
                                <tr key={post._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {(page - 1) * limit + index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 line-clamp-1" title={post.title}>{post.title}</div>
                                        <div className="text-sm text-gray-500">{format(new Date(post.createdAt), 'MMM d, yyyy')}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {post.category?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800' :
                                            post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {post.status.toUpperCase()}
                                        </span>
                                    </td>
                                    {/* <td className="px-6 py-4 text-sm text-gray-500">
                                        {post.lastDate ? format(new Date(post.lastDate), 'MMM d, yyyy') : '-'}
                                    </td> */}
                                    <td className="px-6 py-4 text-sm font-medium text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Link href={`/dashboard/posts/${post._id}/preview`} className="text-blue-600 hover:text-blue-900" title="Preview">
                                                <Eye className="w-5 h-5" />
                                            </Link>
                                            <Link href={`/dashboard/posts/${post._id}/edit`} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button onClick={() => handleDelete(post._id)} className="text-red-600 hover:text-red-900" title="Delete">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                {totalPages > 0 && (
                    <div className="flex flex-col items-center justify-between gap-4 px-6 py-4 bg-white border-t border-gray-200 sm:flex-row">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{displayPosts.length > 0 ? (page - 1) * limit + 1 : 0}</span> to{' '}
                            <span className="font-medium">{Math.min(page * limit, totalPosts)}</span> of{' '}
                            <span className="font-medium">{totalPosts}</span> posts
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1 || loading}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            <div className="hidden sm:flex gap-1">
                                {[...Array(totalPages)].map((_, i) => {
                                    const p = i + 1;
                                    if (p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2)) {
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`px-3 py-1 text-sm font-medium rounded-md border ${page === p ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                                disabled={loading}
                                            >
                                                {p}
                                            </button>
                                        );
                                    }
                                    if ((p === 2 && page > 4) || (p === totalPages - 1 && page < totalPages - 3)) {
                                        return <span key={p} className="px-2 py-1 text-gray-400 text-sm">...</span>;
                                    }
                                    return null;
                                })}
                            </div>

                            <button
                                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={page === totalPages || loading}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
