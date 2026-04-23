// import { useState } from 'react'
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import { AuthProvider } from './context/AuthContext'
// import ProtectedRoute   from './components/ProtectedRoute'
// import Sidebar          from './components/Sidebar'
// import Navbar           from './components/Navbar'

// // Pages
// import Login     from './pages/Login'
// import Dashboard from './pages/Dashboard'
// import Rooms     from './pages/Rooms'
// import Residents from './pages/Residents'
// import Users     from './pages/Users'
// import AuditLog  from './pages/AuditLog'

// // ── App Shell (authenticated layout) ──────────────────────────
// function AppShell({ children }) {
//   const [collapsed, setCollapsed] = useState(false)

//   return (
//     <div className="flex min-h-screen bg-surface-50">
//       <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         <Navbar />
//         <main className="flex-1 overflow-y-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//   )
// }

// // ── Root App ───────────────────────────────────────────────────
// export default function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Routes>
//           {/* Public */}
//           <Route path="/login" element={<Login />} />

//           {/* Protected — wrap every page inside AppShell */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <AppShell><Dashboard /></AppShell>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/rooms"
//             element={
//               <ProtectedRoute>
//                 <AppShell><Rooms /></AppShell>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/residents"
//             element={
//               <ProtectedRoute>
//                 <AppShell><Residents /></AppShell>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/users"
//             element={
//               <ProtectedRoute>
//                 <AppShell><Users /></AppShell>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/audit"
//             element={
//               <ProtectedRoute>
//                 <AppShell><AuditLog /></AppShell>
//               </ProtectedRoute>
//             }
//           />

//           {/* Catch-all → dashboard */}
//           <Route path="*" element={<Navigate to="/dashboard" replace />} />
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   )
// }












import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar  from './components/Sidebar'
import Navbar   from './components/Navbar'
import Login      from './pages/Login'
import Dashboard  from './pages/Dashboard'
import Rooms      from './pages/Rooms'
import Residents  from './pages/Residents'
import Users      from './pages/Users'
import AuditLog   from './pages/AuditLog'

// ─── Layout wrapper for authenticated pages ────────────────────
function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Sidebar/>
            <Navbar/>
            <main className="ml-[240px] pt-[64px] min-h-screen">
                {children}
            </main>
        </div>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    {/* Public */}
                    <Route path="/login" element={<Login/>}/>

                    {/* Redirect root → dashboard */}
                    <Route path="/"
                           element={<Navigate to="/dashboard" replace/>}/>

                    {/* Protected routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Dashboard/>
                            </AppLayout>
                        </ProtectedRoute>
                    }/>

                    <Route path="/rooms" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Rooms/>
                            </AppLayout>
                        </ProtectedRoute>
                    }/>

                    <Route path="/residents" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Residents/>
                            </AppLayout>
                        </ProtectedRoute>
                    }/>

                    <Route path="/users" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Users/>
                            </AppLayout>
                        </ProtectedRoute>
                    }/>

                    <Route path="/audit" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AuditLog/>
                            </AppLayout>
                        </ProtectedRoute>
                    }/>

                    {/* 404 → dashboard */}
                    <Route path="*"
                           element={<Navigate to="/dashboard" replace/>}/>

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}