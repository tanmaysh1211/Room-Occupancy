// import { Bell, Search } from 'lucide-react'
// import { useAuth } from '../context/AuthContext'
// import { useLocation } from 'react-router-dom'

// const PAGE_TITLES = {
//   '/dashboard': 'Dashboard',
//   '/rooms':     'Rooms',
//   '/residents': 'Residents',
//   '/users':     'User Management',
//   '/audit':     'Audit Log',
// }

// export default function Navbar() {
//   const { user } = useAuth()
//   const location = useLocation()
//   const title    = PAGE_TITLES[location.pathname] || 'RoomOS'

//   const now = new Date().toLocaleDateString('en-IN', {
//     weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
//   })

//   return (
//     <header className="h-16 bg-white border-b border-surface-200 flex items-center px-6 gap-4 sticky top-0 z-30"
//       style={{ boxShadow: '0 1px 0 0 #e4e8f2' }}
//     >
//       {/* Page title */}
//       <div className="flex-1 min-w-0">
//         <h1 className="text-lg font-bold font-display text-surface-900 leading-tight tracking-tight truncate">
//           {title}
//         </h1>
//         <p className="text-xs text-surface-400 font-body hidden sm:block">{now}</p>
//       </div>

//       {/* Right actions */}
//       <div className="flex items-center gap-2">
//         <button className="btn-ghost btn-sm rounded-lg hidden sm:flex">
//           <Search size={16} />
//         </button>
//         <button className="btn-ghost btn-sm rounded-lg relative">
//           <Bell size={16} />
//           <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-500 rounded-full" />
//         </button>
//         <div className="w-8 h-8 gradient-brand rounded-full flex items-center justify-center ml-1 flex-shrink-0">
//           <span className="text-white text-xs font-bold font-display">
//             {user?.name?.charAt(0)?.toUpperCase()}
//           </span>
//         </div>
//       </div>
//     </header>
//   )
// }







import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PAGE_TITLES = {
    '/dashboard': 'Dashboard',
    '/rooms':     'Rooms',
    '/residents': 'Residents',
    '/users':     'Users',
    '/audit':     'Audit Log',
}

export default function Navbar() {
    const { user }   = useAuth()
    const location   = useLocation()
    const title      = PAGE_TITLES[location.pathname] || 'RoomOccupancy'
    const now        = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        year:    'numeric',
        month:   'long',
        day:     'numeric'
    })

    return (
        <header className="fixed top-0 left-[240px] right-0 h-[64px]
                           bg-[#0d0d0d]/80 backdrop-blur-md
                           border-b border-[#1a1a1a] z-30
                           flex items-center justify-between px-6">

            {/* Left — Page title */}
            <div>
                <h2 className="font-['Syne'] text-lg font-bold text-white">
                    {title}
                </h2>
                <p className="text-xs text-gray-600">{now}</p>
            </div>

            {/* Right — User info */}
            <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                    <p className="text-sm text-white font-medium">
                        {user?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                        {user?.email}
                    </p>
                </div>
                <div className="w-9 h-9 rounded-full
                                bg-gradient-to-br from-[#FF3CAC] to-[#2B86C5]
                                flex items-center justify-center
                                text-white text-sm font-bold flex-shrink-0">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
            </div>
        </header>
    )
}