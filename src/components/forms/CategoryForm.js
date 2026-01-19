'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { Save, X } from 'lucide-react'
import Loader from '@/components/Loader'

export default function CategoryForm({ initialData = null, isEdit = false }) {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            slug: '',
            description: '',
            displayOrder: 0,
            isActive: true,
        },
    })

    // Watch name to auto-generate slug
    const nameValue = watch('name')

    useEffect(() => {
        if (initialData) {
            Object.keys(initialData).forEach((key) => {
                setValue(key, initialData[key])
            })
        }
    }, [initialData, setValue])

    // Auto-generate slug from name only in create mode or if slug is empty
    useEffect(() => {
        if (!isEdit && nameValue) {
            const slug = nameValue
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')
            setValue('slug', slug)
        }
    }, [nameValue, isEdit, setValue])

    const onSubmit = async (data) => {
        setSubmitting(true)
        setError(null)

        try {
            if (isEdit) {
                await api.put(`/admin/categories/${initialData._id}`, data)
            } else {
                await api.post('/admin/categories', data)
            }
            router.push('/dashboard/categories')
            router.refresh()
        } catch (err) {
            console.error('Error saving category:', err)
            setError(err.response?.data?.message || 'Failed to save category')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow border border-gray-200">
            {submitting && <Loader fullPage={true} />}
            {error && (
                <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category Name</label>
                    <input
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border"
                        placeholder="e.g. Latest Jobs"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                    <input
                        type="text"
                        {...register('slug', { required: 'Slug is required' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border bg-gray-50"
                    />
                    {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        {...register('description')}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border"
                        placeholder="Optional description..."
                    />
                </div>

                {/* Display Order */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Display Order</label>
                    <input
                        type="number"
                        {...register('displayOrder', { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border"
                    />
                </div>

                {/* Status */}
                <div className="flex items-center pt-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            {...register('isActive')}
                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isEdit ? 'Update Category' : 'Create Category'}
                </button>
            </div>
        </form>
    )
}
