// import { useAuth } from '../context/AuthContext'

// /**
//  * Hide content based on role.
//  * Usage:
//  *   <RoleGuard roles={['admin']}>  → only admin sees this
//  *   <RoleGuard roles={['admin','manager']}>  → admin or manager
//  */
// export default function RoleGuard({ roles, children }) {
//   const { user } = useAuth()
//   if (!user) return null
//   if (!roles.includes(user.role)) return null
//   return children
// }




import { useAuth } from '../context/AuthContext'

/**
 * Usage:
 * <RoleGuard role="admin">   → only admin sees this
 * <RoleGuard role="manager"> → admin + manager see this
 * <RoleGuard role="staff">   → everyone logged in sees this
 */
export default function RoleGuard({ role, children, fallback = null }) {
    const { user } = useAuth()
    if (!user) return fallback

    const hierarchy = { admin: 3, manager: 2, staff: 1 }
    const userLevel = hierarchy[user.role]     || 0
    const reqLevel  = hierarchy[role]          || 0

    if (userLevel >= reqLevel) return children
    return fallback
}