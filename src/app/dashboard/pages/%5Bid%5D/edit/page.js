'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import dynamic from 'next/dynamic'
import api from '@/lib/api'
import { Save, Loader2, ArrowLeft } from 'lucide-react'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function EditPage() {
    const params = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [pageTitle, setPageTitle] = useState('')

    const { control, handleSubmit, setValue } = useForm()

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const response = await api.get(`/admin/pages/${params.id}`)
                const data = response.data.data
                setPageTitle(data.title)
                setValue('content', data.content)
                setValue('metaTitle', data.metaTitle)
                setValue('metaDescription', data.metaDescription)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchPage()
    }, [params.id, setValue])

    const onSubmit = async (data) => {
        setSubmitting(true)
        try {
            await api.put(`/admin/pages/${params.id}`, data)
            router.push('/dashboard/pages')
            router.refresh()
        } catch (err) {
            console.error(err)
            alert('Failed to save page')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit: {pageTitle}</h1>
                        <p className="text-sm text-gray-500">Update page content and SEO settings.</p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                    {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Save className="w-5 h-5 mr-2" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="p-6 border-b">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page Content</label>
                    <Controller
                        name="content"
                        control={control}
                        render={({ field }) => (
                            <ReactQuill
                                theme="snow"
                                value={field.value}
                                onChange={field.onChange}
                                className="h-96 mb-12"
                            />
                        )}
                    />
                </div>

                <div className="p-6 bg-gray-50 space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                        <Controller
                            name="metaTitle"
                            control={control}
                            render={({ field }) => (
                                <input {...field} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                            )}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                        <Controller
                            name="metaDescription"
                            control={control}
                            render={({ field }) => (
                                <textarea rows={2} {...field} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                            )}
                        />
                    </div>
                </div>
            </div>
        </form>
    )
}
