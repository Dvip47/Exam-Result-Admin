'use client'

import { useEffect, useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import api from '@/lib/api'
import { Save, X, Loader2, Plus, Trash2 } from 'lucide-react'
import 'react-quill/dist/quill.snow.css'

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function PostForm({ initialData = null, isEdit = false }) {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)
    const [categories, setCategories] = useState([])
    const [error, setError] = useState(null)

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: '',
            slug: '',
            shortDescription: '',
            fullDescription: '',
            category: '',
            organization: '',
            postDate: '',
            lastDate: '',
            status: 'draft',
            importantDates: [{ label: '', date: '' }],
            links: {
                applyLink: '',
                notificationPdf: '',
                syllabusPdf: '',
            },
            metaTitle: '',
            metaDescription: '',
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'importantDates',
    })

    const titleValue = watch('title')

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await api.get('/admin/categories')
            setCategories(response.data.data || [])
        } catch (err) {
            console.error('Error fetching categories:', err)
        }
    }

    useEffect(() => {
        if (initialData) {
            // Flatten data for form if needed or map directly
            Object.keys(initialData).forEach((key) => {
                // specific handling for dates and objects if necessary
                if (key === 'postDate' && initialData[key]) {
                    setValue(key, initialData[key].split('T')[0])
                } else if (key === 'lastDate' && initialData[key]) {
                    setValue(key, initialData[key].split('T')[0])
                } else if (key === 'importantDates' && Array.isArray(initialData[key])) {
                    setValue(key, initialData[key].map(d => ({
                        ...d,
                        date: d.date ? d.date.split('T')[0] : ''
                    })))
                } else if (key === 'category' && typeof initialData[key] === 'object') {
                    setValue(key, initialData[key]._id)
                } else {
                    setValue(key, initialData[key])
                }
            })
        }
    }, [initialData, setValue])

    // Auto-generate slug
    useEffect(() => {
        if (!isEdit && titleValue) {
            const slug = titleValue
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')
            setValue('slug', slug)
        }
    }, [titleValue, isEdit, setValue])

    const onSubmit = async (data) => {
        setSubmitting(true)
        setError(null)

        try {
            if (isEdit) {
                await api.put(`/admin/posts/${initialData._id}`, data)
            } else {
                await api.post('/admin/posts', data)
            }
            router.push('/dashboard/posts')
            router.refresh()
        } catch (err) {
            console.error('Error saving post:', err)
            setError(err.response?.data?.message || 'Failed to save post')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-10">
            {error && (
                <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}

            {/* Basic Info Group */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2">Basic Information</h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Post Title *</label>
                        <input
                            type="text"
                            {...register('title', { required: 'Title is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border"
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Slug *</label>
                        <input
                            type="text"
                            {...register('slug', { required: 'Slug is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category *</label>
                        <select
                            {...register('category', { required: 'Category is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Short Description</label>
                        <textarea
                            {...register('shortDescription')}
                            rows={2}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                        <Controller
                            name="fullDescription"
                            control={control}
                            render={({ field }) => (
                                <ReactQuill
                                    theme="snow"
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="h-64 mb-12"
                                />
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* Details Group */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2">Job Details</h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Organization</label>
                        <input type="text" {...register('organization')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Post Date</label>
                        <input type="date" {...register('postDate')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Date</label>
                        <input type="date" {...register('lastDate')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Age Limit</label>
                        <input type="text" {...register('ageLimit')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border" placeholder="e.g. 18-25 Years" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fees</label>
                        <input type="text" {...register('fees')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border" placeholder="e.g. Gen: 500, SC/ST: 0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Total Posts</label>
                        <input type="number" {...register('totalPosts')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border" />
                    </div>
                </div>
            </div>

            {/* Important Dates */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-6">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Important Dates</h3>
                    <button
                        type="button"
                        onClick={() => append({ label: '', date: '' })}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Add Date
                    </button>
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-500">Label</label>
                                <input
                                    {...register(`importantDates.${index}.label`)}
                                    placeholder="e.g. Exam Date"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-500">Date</label>
                                <input
                                    type="date"
                                    {...register(`importantDates.${index}.date`)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="mb-1 p-2 text-gray-400 hover:text-red-500"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Links & Status */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2">Links & Status</h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Apply Online Link</label>
                        <input type="url" {...register('applyLink')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Notification PDF URL</label>
                        <input type="url" {...register('notificationPdf')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select {...register('status')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border">
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* SEO */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2">SEO Settings</h3>
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                        <input type="text" {...register('metaTitle')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                        <textarea rows={2} {...register('metaDescription')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border" />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-3 lg:pl-64 z-10">
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
                    {submitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            {isEdit ? 'Update Post' : 'Create Post'}
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
