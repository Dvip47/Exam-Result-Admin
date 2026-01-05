'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { Edit, FileText } from 'lucide-react'
import { format } from 'date-fns'

export default function PagesPage() {
    const [pages, setPages] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPages()
    }, [])

    const fetchPages = async () => {
        try {
            const response = await api.get('/admin/pages')
            setPages(response.data.data || [])
        } catch (err) {
            console.error('Error fetching pages:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-4">Loading pages...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Static Pages</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage content for About, Contact, Privacy Policy, etc.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pages.map((page) => (
                    <div key={page._id} className="bg-white rounded-lg shadow border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <FileText className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">{page.title}</h3>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                                Last updated: {format(new Date(page.updatedAt), 'MMM d, yyyy')}
                            </p>
                        </div>
                        <Link
                            href={`/dashboard/pages/${page._id}/edit`}
                            className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Content
                        </Link>
                    </div>
                ))}

                {pages.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        No pages found. Seed the database first.
                    </div>
                )}
            </div>
        </div>
    )
}
