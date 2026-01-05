'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import PostForm from '@/components/forms/PostForm'

export default function EditPostPage() {
    const params = useParams()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true)
                const response = await api.get(`/admin/posts/${params.id}`)
                setPost(response.data.data || response.data)
            } catch (err) {
                console.error('Error fetching post:', err)
                setError('Failed to load post')
            } finally {
                setLoading(false)
            }
        }
        fetchPost()
    }, [params.id])

    if (loading) return <div>Loading...</div>
    if (error) return <div className="text-red-500">{error}</div>
    if (!post) return <div>Post not found</div>

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Update job details.
                </p>
            </div>

            <PostForm initialData={post} isEdit={true} />
        </div>
    )
}
