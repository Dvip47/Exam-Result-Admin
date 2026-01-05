'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { format } from 'date-fns'

export default function CategoriesPage() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const response = await api.get('/admin/categories')
            // Handle different response structures gracefully
            const data = response.data.data || response.data
            setCategories(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Error fetching categories:', err)
            setError('Failed to load categories')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return

        try {
            await api.delete(`/admin/categories/${id}`)
            setCategories(categories.filter(cat => cat._id !== id))
        } catch (err) {
            console.error('Error deleting category:', err)
            alert('Failed to delete category')
        }
    }

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) return <div className="p-4">Loading categories...</div>
    if (error) return <div className="p-4 text-red-500">{error}</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <Link
                    href="/dashboard/categories/create"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Category
                </Link>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center px-4 py-3 bg-white rounded-lg shadow">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search categories..."
                    className="w-full ml-2 text-gray-900 placeholder-gray-500 bg-transparent border-none focus:ring-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Categories Table */}
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Name / Slug
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Created At
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCategories.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                    No categories found
                                </td>
                            </tr>
                        ) : (
                            filteredCategories.map((category) => (
                                <tr key={category._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                        <div className="text-sm text-gray-500">{category.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${category.isActive
                                                ? 'text-green-800 bg-green-100'
                                                : 'text-red-800 bg-red-100'
                                            }`}>
                                            {category.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {category.createdAt ? format(new Date(category.createdAt), 'MMM d, yyyy') : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Link
                                                href={`/dashboard/categories/${category._id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(category._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
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
