'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export default function ProtectedRoute({ children }) {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!isAuthenticated() && pathname !== '/login') {
            router.push('/login')
        }
    }, [pathname, router])

    if (!isAuthenticated() && pathname !== '/login') {
        return null
    }

    return <>{children}</>
}
