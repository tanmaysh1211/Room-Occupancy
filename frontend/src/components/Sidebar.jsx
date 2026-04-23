// import { NavLink, useNavigate } from 'react-router-dom'
// import {
//   LayoutDashboard, DoorOpen, Users, UserCog,
//   ScrollText, LogOut, Building2, ChevronRight
// } from 'lucide-react'
// import { useAuth } from '../context/AuthContext'

// const NAV = [
//   { to: '/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
//   { to: '/rooms',     label: 'Rooms',       icon: DoorOpen },
//   { to: '/residents', label: 'Residents',   icon: Users },
//   { to: '/users',     label: 'Users',       icon: UserCog,   adminOnly: true },
//   { to: '/audit',     label: 'Audit Log',   icon: ScrollText, adminOnly: true },
// ]

// export default function Sidebar({ collapsed, onToggle }) {
//   const { user, logout, isAdmin } = useAuth()
//   const navigate = useNavigate()

//   const handleLogout = async () => {
//     await logout()
//     navigate('/login')
//   }

//   const roleBadge = {
//     admin:   'badge-admin',
//     manager: 'badge-manager',
//     staff:   'badge-staff',
//   }

//   return (
//     <aside
//       className={`
//         flex flex-col bg-white border-r border-surface-200 h-screen sticky top-0
//         transition-all duration-300 ease-in-out z-40
//         ${collapsed ? 'w-16' : 'w-60'}
//       `}
//       style={{ boxShadow: '1px 0 0 0 #e4e8f2' }}
//     >
//       {/* ── Logo ──────────────────────────────────────────── */}
//       <div className={`flex items-center h-16 border-b border-surface-100 px-4 gap-3 flex-shrink-0`}>
//         <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center flex-shrink-0">
//           <Building2 size={16} className="text-white" />
//         </div>
//         {!collapsed && (
//           <div className="overflow-hidden">
//             <p className="font-display font-bold text-surface-900 text-base leading-tight tracking-tight">RoomOS</p>
//             <p className="text-[10px] text-surface-400 font-body leading-tight">Occupancy System</p>
//           </div>
//         )}
//         <button
//           onClick={onToggle}
//           className="ml-auto w-7 h-7 flex items-center justify-center rounded-md
//                      text-surface-400 hover:text-surface-600 hover:bg-surface-100
//                      transition-all duration-150 flex-shrink-0"
//         >
//           <ChevronRight
//             size={15}
//             className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`}
//           />
//         </button>
//       </div>

//       {/* ── Nav items ─────────────────────────────────────── */}
//       <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-hide">
//         {NAV.map(({ to, label, icon: Icon, adminOnly }) => {
//           if (adminOnly && !isAdmin) return null
//           return (
//             <NavLink
//               key={to}
//               to={to}
//               className={({ isActive }) =>
//                 `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`
//               }
//               title={collapsed ? label : undefined}
//             >
//               <Icon size={18} className="flex-shrink-0" />
//               {!collapsed && <span className="truncate">{label}</span>}
//             </NavLink>
//           )
//         })}
//       </nav>

//       {/* ── User section ──────────────────────────────────── */}
//       <div className={`border-t border-surface-100 p-3 flex-shrink-0`}>
//         {!collapsed ? (
//           <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-surface-50 transition-colors">
//             <div className="w-8 h-8 gradient-brand rounded-full flex items-center justify-center flex-shrink-0">
//               <span className="text-white text-xs font-bold font-display">
//                 {user?.name?.charAt(0)?.toUpperCase()}
//               </span>
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-semibold text-surface-800 font-body truncate leading-tight">
//                 {user?.name}
//               </p>
//               <span className={`${roleBadge[user?.role]} text-[10px] px-1.5 py-0 leading-4`}>
//                 {user?.role}
//               </span>
//             </div>
//             <button
//               onClick={handleLogout}
//               title="Logout"
//               className="w-7 h-7 flex items-center justify-center rounded-md
//                          text-surface-400 hover:text-red-500 hover:bg-red-50
//                          transition-all duration-150 flex-shrink-0"
//             >
//               <LogOut size={14} />
//             </button>
//           </div>
//         ) : (
//           <button
//             onClick={handleLogout}
//             title="Logout"
//             className="w-full flex items-center justify-center py-2 rounded-lg
//                        text-surface-400 hover:text-red-500 hover:bg-red-50
//                        transition-all duration-150"
//           >
//             <LogOut size={18} />
//           </button>
//         )}
//       </div>
//     </aside>
//   )
// }









import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
    {
        path:  '/dashboard',
        label: 'Dashboard',
        icon:  '▦',
        role:  'staff'
    },
    {
        path:  '/rooms',
        label: 'Rooms',
        icon:  '⊞',
        role:  'staff'
    },
    {
        path:  '/residents',
        label: 'Residents',
        icon:  '⊙',
        role:  'staff'
    },
    {
        path:  '/users',
        label: 'Users',
        icon:  '◈',
        role:  'admin'
    },
    {
        path:  '/audit',
        label: 'Audit Log',
        icon:  '≡',
        role:  'admin'
    },
]

const ROLE_HIERARCHY = { admin: 3, manager: 2, staff: 1 }

export default function Sidebar() {
    const { user, logout, isAdmin } = useAuth()
    const navigate                  = useNavigate()

    const canAccess = (requiredRole) => {
        const userLevel = ROLE_HIERARCHY[user?.role]    || 0
        const reqLevel  = ROLE_HIERARCHY[requiredRole]  || 0
        return userLevel >= reqLevel
    }

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const roleBadgeColor = {
        admin:   'badge-purple',
        manager: 'badge-blue',
        staff:   'badge-gray'
    }

    return (
        <aside className="fixed left-0 top-0 h-screen w-[240px]
                          bg-[#0d0d0d] border-r border-[#1a1a1a]
                          flex flex-col z-40">

            {/* ── Logo ── */}
            <div className="p-6 border-b border-[#1a1a1a]">
                <h1 className="font-['Syne'] text-xl font-extrabold
                               gradient-text">
                    RoomOccupancy
                </h1>
                <p className="text-xs text-gray-600 mt-0.5">
                    Management System
                </p>
            </div>

            {/* ── User Info ── */}
            <div className="px-4 py-4 border-b border-[#1a1a1a]">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full
                                    bg-gradient-to-br from-[#FF3CAC]
                                    to-[#2B86C5]
                                    flex items-center justify-center
                                    text-white text-sm font-bold flex-shrink-0">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {user?.name}
                        </p>
                        <span className={roleBadgeColor[user?.role] ||
                                         'badge-gray'}>
                            {user?.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Nav Links ── */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {NAV_ITEMS.filter(item => canAccess(item.role)).map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? 'nav-link-active' : 'nav-link'
                        }
                    >
                        <span className="text-base w-5 text-center
                                         flex-shrink-0">
                            {item.icon}
                        </span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* ── Bottom ── */}
            <div className="p-3 border-t border-[#1a1a1a] space-y-1">
                <button
                    onClick={handleLogout}
                    className="nav-link w-full text-left text-red-500
                               hover:text-red-400 hover:bg-red-900/10"
                >
                    <span className="text-base w-5 text-center">⊗</span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    )
}