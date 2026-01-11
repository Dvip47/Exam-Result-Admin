'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { Plus, Edit, Trash2, Search, Filter, Eye, Sparkles } from 'lucide-react'
import { format } from 'date-fns'

export default function PostsPage() {
    const [posts, setPosts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [postsRes, categoriesRes] = await Promise.all([
                api.get('/admin/posts'),
                api.get('/admin/categories')
            ])
            setPosts(postsRes.data.data?.posts || [])
            setCategories(categoriesRes.data.data || [])
        } catch (err) {
            console.error('Error fetching data:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return

        try {
            await api.delete(`/admin/posts/${id}`)
            setPosts(posts.filter(post => post._id !== id))
        } catch (err) {
            console.error('Error deleting post:', err)
            alert('Failed to delete post')
        }
    }

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || post.status === statusFilter
        const matchesCategory = categoryFilter === 'all' || post.category?._id === categoryFilter
        return matchesSearch && matchesStatus && matchesCategory
    })

    if (loading) return <div className="p-4">Loading posts...</div>

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
                    <select
                        className="p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>

                    <select
                        className="p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
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
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Last Date</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPosts.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No posts found
                                </td>
                            </tr>
                        ) : (
                            filteredPosts.map((post, index) => (
                                <tr key={post._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {index + 1}
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
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {post.lastDate ? format(new Date(post.lastDate), 'MMM d, yyyy') : '-'}
                                    </td>
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
            </div>
        </div>
    )
}
