// import { Navigate, useLocation } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'

// export default function ProtectedRoute({ children }) {
//   const { user, loading } = useAuth()
//   const location = useLocation()

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-surface-50">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-10 h-10 rounded-full border-2 border-brand-200 border-t-brand-600 animate-spin" />
//           <p className="text-sm text-surface-400 font-body">Loading…</p>
//         </div>
//       </div>
//     )
//   }

//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />
//   }

//   return children
// }






import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center
                        justify-center">
            <div className="spinner w-10 h-10"/>
        </div>
    )

    if (!user) return <Navigate to="/login" replace/>

    return children
}