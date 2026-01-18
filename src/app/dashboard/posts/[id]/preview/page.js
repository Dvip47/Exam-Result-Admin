'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api'
import { ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default function PreviewPostPage() {
    const params = useParams()
    const router = useRouter()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/admin/posts/${params.id}`)
                setPost(response.data.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchPost()
    }, [params.id])

    if (loading) return <div>Loading preview...</div>
    if (!post) return <div>Post not found</div>

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </button>
                <div className="space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                        ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {post.status.toUpperCase()}
                    </span>
                    <Link
                        href={`/dashboard/posts/${post._id}/edit`}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                    >
                        <Edit className="w-4 h-4 mr-2" /> Edit Post
                    </Link>
                </div>
            </div>

            {/* Content Preview */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-red-600 p-6 text-white text-center">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                    <p className="mt-2 text-red-100">Posted on: {format(new Date(post.createdAt), 'dd MMM yyyy')}</p>
                </div>

                <div className="p-8 space-y-8">
                    {/* Quick Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
                        <div>
                            <p className="text-sm text-gray-500">Organization</p>
                            <p className="font-medium">{post.organization}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Posts</p>
                            <p className="font-medium">{post.totalPosts || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Rich Text Content */}
                    <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: post.fullDescription }} />
                    </div>

                    {/* Important Dates */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-bold mb-4">Important Dates</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {post.importantDates?.map((date, index) => (
                                <div key={index} className="flex justify-between border-b py-2">
                                    <span className="text-gray-600">{date.label}</span>
                                    <span className="font-medium">
                                        {date.date ? format(new Date(date.date), 'dd MMM yyyy') : '-'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col gap-3 pt-6">
                        {post.primaryActionLink && (
                            <a href={post.primaryActionLink} target="_blank" className="block w-full text-center py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
                                {post.category?.primaryActionLabel || "Apply Online/View Details"}
                            </a>
                        )}
                        {post.notificationPdf && (
                            <a href={post.notificationPdf} target="_blank" className="block w-full text-center py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200">
                                Download Notification
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
