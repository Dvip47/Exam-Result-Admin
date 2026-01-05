export const getUser = () => {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
}

export const getToken = () => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('accessToken')
}

export const setAuth = (user, accessToken, refreshToken) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
}

export const clearAuth = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
}

export const isAuthenticated = () => {
    return !!getToken()
}
