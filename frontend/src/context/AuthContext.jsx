// import { createContext, useContext, useState, useEffect, useCallback } from 'react'
// import { authAPI } from '../api/authAPI'

// const AuthContext = createContext(null)

// export function AuthProvider({ children }) {
//   const [user, setUser]       = useState(null)
//   const [loading, setLoading] = useState(true)   // checking stored token on mount

//   // ── Load user from stored token on app start ─────────────
//   useEffect(() => {
//     const token = localStorage.getItem('access_token')
//     if (!token) { setLoading(false); return }

//     authAPI.me()
//       .then(res => setUser(res.data.data))
//       .catch(() => {
//         localStorage.removeItem('access_token')
//         localStorage.removeItem('refresh_token')
//       })
//       .finally(() => setLoading(false))
//   }, [])

//   // ── Login ─────────────────────────────────────────────────
//   const login = useCallback(async (email, password) => {
//     const res = await authAPI.login(email, password)
//     const { access_token, refresh_token, user: userData } = res.data.data
//     localStorage.setItem('access_token',  access_token)
//     localStorage.setItem('refresh_token', refresh_token)
//     setUser(userData)
//     return userData
//   }, [])

//   // ── Logout ────────────────────────────────────────────────
//   const logout = useCallback(async () => {
//     try { await authAPI.logout() } catch (_) {}
//     localStorage.removeItem('access_token')
//     localStorage.removeItem('refresh_token')
//     setUser(null)
//   }, [])

//   // ── Role helpers ──────────────────────────────────────────
//   const isAdmin   = user?.role === 'admin'
//   const isManager = user?.role === 'manager'
//   const isStaff   = user?.role === 'staff'
//   const canWrite  = isAdmin || isManager  // create / update / delete

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isManager, isStaff, canWrite }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// // eslint-disable-next-line react-refresh/only-export-components
// export function useAuth() {
//   const ctx = useContext(AuthContext)
//   if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
//   return ctx
// }







import { createContext, useContext, useState, useEffect } from 'react'
import { getStoredUser, isAuthenticated, logout as logoutAPI } from '../api/authAPI'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user,    setUser]    = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isAuthenticated()) {
            const storedUser = getStoredUser()
            setUser(storedUser)
        }
        setLoading(false)
    }, [])

    const login = (userData) => {
        setUser(userData)
    }

    const logout = async () => {
        await logoutAPI()
        setUser(null)
    }

    const isAdmin   = () => user?.role === 'admin'
    const isManager = () => user?.role === 'admin' || user?.role === 'manager'
    const isStaff   = () => !!user

    return (
        <AuthContext.Provider value={{
            user, loading,
            login, logout,
            isAdmin, isManager, isStaff
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}