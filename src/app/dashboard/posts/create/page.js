'use client'

import PostForm from '@/components/forms/PostForm'

export default function CreatePostPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Add a new job vacancy or result.
                </p>
            </div>

            <PostForm />
        </div>
    )
}
