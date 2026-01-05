'use client'

import CategoryForm from '@/components/forms/CategoryForm'

export default function CreateCategoryPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Create a new category for organizing jobs and posts.
                </p>
            </div>

            <CategoryForm />
        </div>
    )
}
