// import { useState } from 'react'
// import { useNavigate, useLocation } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import { Building2, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'

// export default function Login() {
//   const [email,    setEmail]    = useState('')
//   const [password, setPassword] = useState('')
//   const [showPwd,  setShowPwd]  = useState(false)
//   const [error,    setError]    = useState('')
//   const [loading,  setLoading]  = useState(false)

//   const { login }   = useAuth()
//   const navigate    = useNavigate()
//   const location    = useLocation()
//   const redirectTo  = location.state?.from?.pathname || '/dashboard'

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
//     if (!email || !password) { setError('Email and password are required.'); return }

//     setLoading(true)
//     try {
//       await login(email.trim(), password)
//       navigate(redirectTo, { replace: true })
//     } catch (err) {
//       setError(err.response?.data?.message || 'Invalid email or password.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fillDemo = (role) => {
//     const creds = {
//       admin:   ['admin@roomoccupancy.com',    'password123'],
//       manager: ['manager1@roomoccupancy.com', 'password123'],
//       staff:   ['staff1@roomoccupancy.com',   'password123'],
//     }
//     setEmail(creds[role][0])
//     setPassword(creds[role][1])
//     setError('')
//   }

//   return (
//     <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
//       {/* Background decoration */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-100 rounded-full opacity-40 blur-3xl" />
//         <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-200 rounded-full opacity-30 blur-3xl" />
//       </div>

//       <div className="relative w-full max-w-md animate-slide-up">
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <div className="w-14 h-14 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
//             <Building2 size={28} className="text-white" />
//           </div>
//           <h1 className="text-3xl font-bold font-display text-surface-900 tracking-tight">RoomOS</h1>
//           <p className="text-sm text-surface-500 font-body mt-1">Room Occupancy Management System</p>
//         </div>

//         {/* Card */}
//         <div className="card p-8">
//           <h2 className="text-xl font-bold font-display text-surface-900 mb-1">Welcome back</h2>
//           <p className="text-sm text-surface-500 font-body mb-6">Sign in to your account to continue</p>

//           {/* Error */}
//           {error && (
//             <div className="alert-error mb-4">
//               <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
//               <span>{error}</span>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="label">Email address</label>
//               <input
//                 type="email"
//                 className="input"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 autoComplete="email"
//                 autoFocus
//               />
//             </div>

//             <div>
//               <label className="label">Password</label>
//               <div className="relative">
//                 <input
//                   type={showPwd ? 'text' : 'password'}
//                   className="input pr-10"
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   autoComplete="current-password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPwd(!showPwd)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400
//                              hover:text-surface-600 transition-colors"
//                 >
//                   {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="btn-primary w-full btn-lg mt-2"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   Signing in…
//                 </>
//               ) : (
//                 <>
//                   <LogIn size={16} />
//                   Sign in
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Demo credentials */}
//           <div className="mt-6 pt-5 border-t border-surface-100">
//             <p className="text-xs text-surface-400 font-body text-center mb-3">
//               Quick demo access
//             </p>
//             <div className="grid grid-cols-3 gap-2">
//               {['admin', 'manager', 'staff'].map((role) => (
//                 <button
//                   key={role}
//                   type="button"
//                   onClick={() => fillDemo(role)}
//                   className="py-1.5 px-2 rounded-lg text-xs font-medium font-body
//                              border border-surface-200 text-surface-600
//                              hover:bg-surface-50 hover:border-surface-300
//                              transition-all duration-150 capitalize"
//                 >
//                   {role}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         <p className="text-center text-xs text-surface-400 font-body mt-5">
//           RoomOS © {new Date().getFullYear()} — Occupancy Management Platform
//         </p>
//       </div>
//     </div>
//   )
// }









import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginAPI } from '../api/authAPI'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const [email,    setEmail]    = useState('')
    const [password, setPassword] = useState('')
    const [error,    setError]    = useState('')
    const [loading,  setLoading]  = useState(false)
    const { login }               = useAuth()
    const navigate                = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const user = await loginAPI(email, password)
            login(user)
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center
                        justify-center p-4">
            <div className="w-full max-w-md fade-in">

                {/* Logo */}
                <div className="text-center mb-10">
                    <h1 className="font-['Syne'] text-4xl font-extrabold
                                   gradient-text mb-2">
                        RoomOccupancy
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Management System
                    </p>
                </div>

                {/* Card */}
                <div className="card">
                    <h2 className="font-['Syne'] text-xl font-bold
                                   text-white mb-6">
                        Sign In
                    </h2>

                    {error && (
                        <div className="bg-red-900/30 border border-red-800
                                        text-red-400 rounded-xl px-4 py-3
                                        text-sm mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                className="input"
                                placeholder="admin@roomoccupancy.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full mt-2 flex
                                       items-center justify-center gap-2"
                        >
                            {loading
                                ? <><span className="spinner w-4 h-4"/>
                                    Signing in...</>
                                : 'Sign In'}
                        </button>
                    </form>

                    {/* Demo credentials */}
                    <div className="mt-6 pt-5 border-t border-[#222]">
                        <p className="text-xs text-gray-600 mb-3
                                      uppercase tracking-wider">
                            Demo credentials
                        </p>
                        <div className="space-y-2 text-xs text-gray-500">
                            <div className="flex justify-between">
                                <span className="badge-purple">Admin</span>
                                <span>admin@roomoccupancy.com</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="badge-blue">Manager</span>
                                <span>manager1@roomoccupancy.com</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="badge-gray">Staff</span>
                                <span>staff1@roomoccupancy.com</span>
                            </div>
                            <p className="text-center mt-2">
                                Password: password123
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}