'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { Sparkles, Upload, FileSpreadsheet, Download, Loader2, PlayCircle, CheckCircle, XCircle, Zap, Cpu, ChevronDown } from 'lucide-react'
import * as XLSX from 'xlsx'

export default function AgentCreatePage() {
    const [activeTab, setActiveTab] = useState('single') // single | bulk
    const [title, setTitle] = useState('')
    const [model, setModel] = useState('gemini-2.5-flash') // Default model
    const [loading, setLoading] = useState(false)
    const [bulkResults, setBulkResults] = useState(null)
    const fileInputRef = useRef(null)
    const router = useRouter()

    // --- Single Create Logic ---
    const handleSingleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim()) return

        try {
            setLoading(true)
            const response = await api.post('/admin/ai/create-by-title', { title, model })

            if (response.data.success) {
                const { postId } = response.data.data
                // Redirect to edit
                router.push(`/dashboard/posts/${postId}/edit?agent=success`)
            }
        } catch (error) {
            console.error(error)
            alert(error.response?.data?.message || 'Failed to create Draft')
        } finally {
            setLoading(false)
        }
    }

    // --- Template Download ---
    const downloadTemplate = () => {
        const ws = XLSX.utils.json_to_sheet([
            { "Job Title": "UP Police Constable Online Form 2026" },
            { "Job Title": "Railway RRB Technician Exam Date 2026" },
            { "Job Title": "SSC GD Constable Result 2026" }
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "Agent_v2_Template.xlsx");
    }

    // --- Bulk Upload Logic ---
    const handleBulkUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        try {
            setLoading(true)
            setBulkResults(null)

            // Note: Ensure your axios/api client supports multipart/form-data
            formData.append('model', model)
            const response = await api.post('/admin/ai/bulk-create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            if (response.data.success) {
                setBulkResults(response.data.data)
            }

        } catch (error) {
            console.error(error)
            alert('Bulk upload failed')
        } finally {
            setLoading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                    Agent-2: Title-First Creator
                </h1>
                <p className="text-gray-500 mt-2 text-lg">
                    Create high-quality drafts from just a title, or upload bulk data via Excel.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('single')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 
                        ${activeTab === 'single'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Single Create
                </button>
                <button
                    onClick={() => setActiveTab('bulk')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 
                        ${activeTab === 'bulk'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Bulk Upload
                </button>
            </div>




            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[400px] p-8 relative">

                {/* Floating Model Selector */}
                <div className="absolute top-4 right-4 z-10">
                    <div className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-full px-4 py-2 transition-all cursor-pointer shadow-sm hover:shadow-md">
                        <Cpu className="w-4 h-4 text-blue-600" />
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="appearance-none bg-transparent text-sm font-semibold text-blue-800 border-none focus:ring-0 cursor-pointer pr-6 py-0 outline-none"
                        >
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
                            <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                            <option value="gemini-flash-latest">Gemini Flash (Stable)</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-blue-500 absolute right-3 pointer-events-none group-hover:translate-y-0.5 transition-transform" />
                    </div>
                </div>

                {/* SINGLE TAB */}
                {activeTab === 'single' && (
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div className="text-center space-y-2">
                            <PlayCircle className="w-12 h-12 text-blue-100 bg-blue-600 rounded-full p-2 mx-auto" />
                            <h2 className="text-xl font-semibold text-gray-900">Enter a Job Title</h2>
                            <p className="text-gray-500">Agent will search its knowledge base and structure the data.</p>
                        </div>

                        <form onSubmit={handleSingleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="e.g. Railway RRB Technician Exam Date 2026"
                                className="w-full text-lg p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                autoFocus
                            />

                            <button
                                type="submit"
                                disabled={loading || !title.trim()}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                                {loading ? 'Agent is Working...' : 'Create Draft'}
                            </button>
                        </form>
                    </div>
                )}

                {/* BULK TAB */}
                {activeTab === 'bulk' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Bulk Creation</h2>
                                <p className="text-gray-500">Upload an Excel file with a "Job Title" column.</p>
                            </div>
                            <button
                                onClick={downloadTemplate}
                                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                            >
                                <Download className="w-4 h-4" /> Download Template
                            </button>
                        </div>

                        {!bulkResults ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleBulkUpload}
                                />
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    {loading ? <Loader2 className="animate-spin w-8 h-8" /> : <FileSpreadsheet className="w-8 h-8" />}
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    {loading ? 'Processing Excel...' : 'Click to Upload Excel'}
                                </h3>
                                <p className="text-gray-500 mt-1">.xlsx or .xls files only</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Results Summary */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-gray-900">{bulkResults.total}</div>
                                        <div className="text-sm text-gray-500">Total Rows</div>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-green-600">{bulkResults.success}</div>
                                        <div className="text-sm text-green-700">Created</div>
                                    </div>
                                    <div className="p-4 bg-red-50 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-red-600">{bulkResults.failed}</div>
                                        <div className="text-sm text-red-700">Failed</div>
                                    </div>
                                </div>

                                {/* Detailed List */}
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                            <tr>
                                                <th className="px-4 py-3">Row</th>
                                                <th className="px-4 py-3">Title</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {bulkResults.details.map((item, idx) => (
                                                <tr key={idx} className="bg-white hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-mono">{item.row}</td>
                                                    <td className="px-4 py-3 font-medium text-gray-900">{item.title || '-'}</td>
                                                    <td className="px-4 py-3">
                                                        {item.status === 'Success' ? (
                                                            <span className="inline-flex items-center gap-1 text-green-600">
                                                                <CheckCircle className="w-4 h-4" /> Success
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-red-600">
                                                                <XCircle className="w-4 h-4" /> {item.error}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {item.postId && (
                                                            <button
                                                                onClick={() => router.push(`/dashboard/posts/${item.postId}/edit`)}
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                Edit Draft
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <button
                                    onClick={() => setBulkResults(null)}
                                    className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
                                >
                                    Upload Another File
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
