'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import api from '@/lib/api'
import { Upload, Trash2, Copy, Image as ImageIcon, FileText, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

export default function MediaPage() {
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)

    useEffect(() => {
        fetchFiles()
    }, [])

    const fetchFiles = async () => {
        try {
            setLoading(true)
            const response = await api.get('/admin/media')
            setFiles(response.data.data?.media || [])
        } catch (err) {
            console.error('Error fetching media:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // File size validation (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds 5MB limit')
            return
        }

        const formData = new FormData()
        formData.append('file', file)

        try {
            setUploading(true)
            const response = await api.post('/admin/media/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            // Add new file to list immediately
            setFiles([response.data.data, ...files])
        } catch (err) {
            console.error('Error uploading file:', err)
            alert('Upload failed')
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this file?')) return

        try {
            await api.delete(`/admin/media/${id}`)
            setFiles(files.filter(f => f._id !== id))
        } catch (err) {
            console.error('Error deleting file:', err)
            alert('Failed to delete file')
        }
    }

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url)
        alert('URL copied to clipboard!')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage images and documents.</p>
                </div>
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        className="hidden"
                        accept="image/*,application/pdf"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        {uploading ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            <Upload className="w-5 h-5 mr-2" />
                        )}
                        Upload File
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="p-4">Loading media...</div>
            ) : files?.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p>No files uploaded yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {files?.map((file) => (
                        <div key={file._id} className="group relative bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden relative">
                                {file.mimetype.startsWith('image/') ? (
                                    <Image
                                        src={file.url}
                                        alt={file.filename}
                                        className="object-cover w-full h-full"
                                        fill
                                        unoptimized
                                    />
                                ) : (
                                    <FileText className="w-12 h-12 text-gray-400" />
                                )}

                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                                    <button
                                        onClick={() => copyToClipboard(file.url)}
                                        className="p-2 bg-white rounded-full hover:bg-gray-100"
                                        title="Copy URL"
                                    >
                                        <Copy className="w-4 h-4 text-gray-700" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file._id)}
                                        className="p-2 bg-white rounded-full hover:bg-red-50"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-medium text-gray-900 truncate" title={file.originalname}>
                                    {file.originalname}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {(file.size / 1024).toFixed(1)} KB • {format(new Date(file.createdAt), 'MMM d, yy')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
