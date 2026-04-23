// import axiosInstance from './axiosInstance'

// export const authAPI = {
//   login:          (email, password)  => axiosInstance.post('/auth/login', { email, password }),
//   logout:         ()                 => axiosInstance.post('/auth/logout'),
//   refresh:        ()                 => axiosInstance.post('/auth/refresh'),
//   me:             ()                 => axiosInstance.get('/auth/me'),
//   changePassword: (old_password, new_password) =>
//     axiosInstance.put('/auth/change-password', { old_password, new_password }),
// }


import axiosInstance from './axiosInstance'

// ─── Login ─────────────────────────────────────────────────────
export const login = async (email, password) => {
    const res = await axiosInstance.post('/auth/login', { email, password })
    const { access_token, refresh_token, user } = res.data.data

    // Store tokens and user in localStorage
    localStorage.setItem('access_token',  access_token)
    localStorage.setItem('refresh_token', refresh_token)
    localStorage.setItem('user',          JSON.stringify(user))

    return user
}

// ─── Logout ────────────────────────────────────────────────────
export const logout = async () => {
    try {
        await axiosInstance.post('/auth/logout')
    } catch (err) {
        // Even if API fails, clear local storage
        console.warn('Logout API failed, clearing local storage anyway')
    } finally {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
    }
}

// ─── Get current user ──────────────────────────────────────────
export const getMe = async () => {
    const res = await axiosInstance.get('/auth/me')
    return res.data.data
}

// ─── Change password ───────────────────────────────────────────
export const changePassword = async (oldPassword, newPassword) => {
    const res = await axiosInstance.put('/auth/change-password', {
        old_password: oldPassword,
        new_password: newPassword
    })
    return res.data
}

// ─── Get stored user from localStorage ────────────────────────
export const getStoredUser = () => {
    try {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    } catch {
        return null
    }
}

// ─── Check if user is logged in ───────────────────────────────
export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token')
}

// ─── Check role ────────────────────────────────────────────────
export const hasRole = (requiredRole) => {
    const user = getStoredUser()
    if (!user) return false

    const roleHierarchy = { admin: 3, manager: 2, staff: 1 }
    const userLevel     = roleHierarchy[user.role]     || 0
    const requiredLevel = roleHierarchy[requiredRole]  || 0

    return userLevel >= requiredLevel
}