'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { Sparkles, ArrowRight, Loader2, AlertCircle } from 'lucide-react'

export default function PostByAgentPage() {
    const [rawText, setRawText] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!rawText.trim()) return

        try {
            setLoading(true)
            setError(null)

            const response = await api.post('/admin/ai/process', { rawText })

            if (response.data.success) {
                const { postId } = response.data.data
                // Redirect to the edit page of the newly created draft
                router.push(`/dashboard/posts/${postId}/edit?agent=success`)
            }
        } catch (err) {
            console.error('AI Processing Error:', err)
            setError(err.response?.data?.message || 'Failed to process text. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-red-600" />
                        Post by Agent
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Paste raw recruitment content and let the AI structure it into a Draft post.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="rawText" className="block text-sm font-medium text-gray-700 mb-2">
                            Raw Recruitment Text
                        </label>
                        <textarea
                            id="rawText"
                            rows={15}
                            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono text-sm"
                            placeholder="Paste notification text, table data, or raw content here..."
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
                            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">{error}</div>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || !rawText.trim()}
                            className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold text-white transition-all
                                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg hover:-translate-y-0.5'}
                            `}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    Agent is Processing...
                                </>
                            ) : (
                                <>
                                    Agent, Post It
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="bg-gray-50 p-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">How it works</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <li className="flex gap-3 text-sm text-gray-600">
                            <span className="flex-shrink-0 w-6 h-6 bg-white rounded-full border flex items-center justify-center font-bold text-red-600">1</span>
                            Paste any unstructured text from notifications or other sites.
                        </li>
                        <li className="flex gap-3 text-sm text-gray-600">
                            <span className="flex-shrink-0 w-6 h-6 bg-white rounded-full border flex items-center justify-center font-bold text-red-600">2</span>
                            AI extracts dates, fees, vacancies, and physical standards.
                        </li>
                        <li className="flex gap-3 text-sm text-gray-600">
                            <span className="flex-shrink-0 w-6 h-6 bg-white rounded-full border flex items-center justify-center font-bold text-red-600">3</span>
                            System creates a <strong>Draft</strong> post with SEO-optimized titles.
                        </li>
                        <li className="flex gap-3 text-sm text-gray-600">
                            <span className="flex-shrink-0 w-6 h-6 bg-white rounded-full border flex items-center justify-center font-bold text-red-600">4</span>
                            You review, edit if needed, and publish manually.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
