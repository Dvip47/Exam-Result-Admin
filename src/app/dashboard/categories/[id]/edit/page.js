'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api'
import CategoryForm from '@/components/forms/CategoryForm'

export default function EditCategoryPage() {
    const params = useParams()
    const router = useRouter()
    const [category, setCategory] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                setLoading(true)
                const response = await api.get(`/admin/categories/${params.id}`)
                setCategory(response.data.data || response.data)
            } catch (err) {
                console.error('Error fetching category:', err)
                setError('Failed to load category')
            } finally {
                setLoading(false)
            }
        }
        fetchCategory()
    }, [params.id])

    if (loading) return <div>Loading...</div>
    if (error) return <div className="text-red-500">{error}</div>
    if (!category) return <div>Category not found</div>

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Update category details.
                </p>
            </div>

            <CategoryForm initialData={category} isEdit={true} />
        </div>
    )
}
