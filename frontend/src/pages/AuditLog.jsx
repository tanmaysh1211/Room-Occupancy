// import { useEffect, useState, useCallback } from 'react'
// import { ScrollText, Search, X, RefreshCw, BarChart2 } from 'lucide-react'
// import { auditAPI }  from '../api/auditAPI'
// import Pagination    from '../components/Pagination'
// import Toast         from '../components/Toast'
// import { useToast }  from '../components/useToast'

// const ACTION_COLORS = {
//   CREATE_ROOM:       'bg-emerald-50 text-emerald-700',
//   UPDATE_ROOM:       'bg-blue-50 text-blue-700',
//   DELETE_ROOM:       'bg-red-50 text-red-600',
//   CREATE_RESIDENT:   'bg-emerald-50 text-emerald-700',
//   UPDATE_RESIDENT:   'bg-blue-50 text-blue-700',
//   DELETE_RESIDENT:   'bg-red-50 text-red-600',
//   ASSIGN_ROOM:       'bg-purple-50 text-purple-700',
//   CHECKOUT_RESIDENT: 'bg-amber-50 text-amber-700',
//   LOGIN:             'bg-surface-100 text-surface-500',
//   LOGOUT:            'bg-surface-100 text-surface-500',
//   CREATE_USER:       'bg-sky-50 text-sky-700',
//   UPDATE_USER:       'bg-sky-50 text-sky-700',
//   DELETE_USER:       'bg-red-50 text-red-600',
//   CHANGE_PASSWORD:   'bg-orange-50 text-orange-700',
// }

// function ActionBadge({ action }) {
//   return (
//     <span className={`badge text-[11px] font-mono ${ACTION_COLORS[action] || 'bg-surface-100 text-surface-500'}`}>
//       {action}
//     </span>
//   )
// }

// export default function AuditLog() {
//   const { toasts, removeToast, toast } = useToast()

//   const [logs,       setLogs]       = useState([])
//   const [summary,    setSummary]    = useState(null)
//   const [loading,    setLoading]    = useState(true)
//   const [pagination, setPagination] = useState({ page: 1, per_page: 20, total: 0, total_pages: 1 })

//   const [showSummary, setShowSummary] = useState(false)
//   const [filters,     setFilters]     = useState({ action: '', entity_type: '', user_email: '' })
//   const [emailSearch, setEmailSearch] = useState('')

//   const fetchLogs = useCallback(async (page = 1) => {
//     setLoading(true)
//     try {
//       const params = { page, per_page: pagination.per_page }
//       if (filters.action)      params.action      = filters.action
//       if (filters.entity_type) params.entity_type = filters.entity_type
//       if (filters.user_email)  params.user_email  = filters.user_email
//       const res = await auditAPI.getAll(params)
//       setLogs(res.data.data)
//       setPagination(res.data.pagination)
//     } catch {
//       toast.error('Failed to load audit logs')
//     } finally {
//       setLoading(false)
//     }
//   }, [filters, pagination.per_page])

//   useEffect(() => { fetchLogs(1) }, [filters])

//   useEffect(() => {
//     const t = setTimeout(() => setFilters((f) => ({ ...f, user_email: emailSearch })), 400)
//     return () => clearTimeout(t)
//   }, [emailSearch])

//   const fetchSummary = async () => {
//     try {
//       const res = await auditAPI.getSummary()
//       setSummary(res.data.data)
//       setShowSummary(true)
//     } catch {
//       toast.error('Failed to load summary')
//     }
//   }

//   const clearFilters = () => {
//     setFilters({ action: '', entity_type: '', user_email: '' })
//     setEmailSearch('')
//   }

//   const hasFilters = filters.action || filters.entity_type || filters.user_email

//   const formatTime = (ts) => {
//     const d = new Date(ts)
//     return {
//       date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }),
//       time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
//     }
//   }

//   return (
//     <>
//       <div className="p-6 animate-fade-in">
//         {/* Header */}
//         <div className="page-header">
//           <div>
//             <h1 className="page-title">Audit Log</h1>
//             <p className="page-subtitle">Immutable record of all system actions — read only</p>
//           </div>
//           <div className="flex gap-2">
//             <button onClick={fetchSummary} className="btn-secondary gap-1.5">
//               <BarChart2 size={14} /> Summary
//             </button>
//             <button onClick={() => fetchLogs(pagination.page)} className="btn-ghost" title="Refresh">
//               <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
//             </button>
//           </div>
//         </div>

//         {/* Summary panel */}
//         {showSummary && summary && (
//           <div className="card p-5 mb-5 animate-slide-up">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-sm font-bold font-display text-surface-800">Activity Summary</h3>
//               <button onClick={() => setShowSummary(false)} className="btn-ghost p-1.5">
//                 <X size={14} />
//               </button>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               {/* Action counts */}
//               <div>
//                 <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider font-body mb-3">
//                   Actions by type
//                 </p>
//                 <div className="space-y-2">
//                   {summary.action_counts.slice(0, 8).map((a) => {
//                     const maxCount = summary.action_counts[0]?.count || 1
//                     const pct = Math.round((a.count / maxCount) * 100)
//                     return (
//                       <div key={a.action} className="flex items-center gap-3">
//                         <span className="font-mono text-[11px] text-surface-500 w-40 truncate flex-shrink-0">{a.action}</span>
//                         <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
//                           <div
//                             className="h-full bg-brand-500 rounded-full transition-all duration-500"
//                             style={{ width: `${pct}%` }}
//                           />
//                         </div>
//                         <span className="text-xs font-semibold text-surface-700 font-body w-8 text-right">{a.count}</span>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </div>

//               {/* Top users */}
//               <div>
//                 <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider font-body mb-3">
//                   Most active users
//                 </p>
//                 <div className="space-y-2">
//                   {summary.top_users.map((u, i) => (
//                     <div key={u.email} className="flex items-center gap-3">
//                       <span className="w-5 h-5 rounded-full bg-surface-100 text-surface-500 text-[10px] font-bold font-display flex items-center justify-center flex-shrink-0">
//                         {i + 1}
//                       </span>
//                       <span className="text-sm text-surface-600 font-body flex-1 truncate">{u.email}</span>
//                       <span className="text-xs font-semibold text-surface-700 font-body">{u.count}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Filters */}
//         <div className="flex flex-wrap items-center gap-3 mb-5">
//           <div className="relative flex-1 min-w-[200px] max-w-xs">
//             <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
//             <input
//               className="input pl-9"
//               placeholder="Filter by user email…"
//               value={emailSearch}
//               onChange={(e) => setEmailSearch(e.target.value)}
//             />
//             {emailSearch && (
//               <button onClick={() => setEmailSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
//                 <X size={14} />
//               </button>
//             )}
//           </div>

//           <select
//             className="input w-44"
//             value={filters.entity_type}
//             onChange={(e) => setFilters((f) => ({ ...f, entity_type: e.target.value }))}
//           >
//             <option value="">All entities</option>
//             <option value="room">Rooms</option>
//             <option value="resident">Residents</option>
//             <option value="user">Users</option>
//           </select>

//           <select
//             className="input w-52"
//             value={filters.action}
//             onChange={(e) => setFilters((f) => ({ ...f, action: e.target.value }))}
//           >
//             <option value="">All actions</option>
//             {Object.keys(ACTION_COLORS).map((a) => (
//               <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>
//             ))}
//           </select>

//           {hasFilters && (
//             <button onClick={clearFilters} className="btn-ghost text-red-500 hover:bg-red-50">
//               <X size={14} /> Clear
//             </button>
//           )}
//         </div>

//         {/* Table */}
//         {loading ? (
//           <div className="table-wrapper">
//             <div className="animate-pulse p-6 space-y-3">
//               {[...Array(8)].map((_, i) => (
//                 <div key={i} className="flex gap-4">
//                   {[...Array(6)].map((_, j) => <div key={j} className="skeleton h-5 flex-1 rounded" />)}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : logs.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-state-icon"><ScrollText size={24} /></div>
//             <p className="text-surface-500 font-body text-sm">No audit logs found</p>
//           </div>
//         ) : (
//           <div className="table-wrapper">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Timestamp</th>
//                   <th>Action</th>
//                   <th>Entity</th>
//                   <th>User</th>
//                   <th>Description</th>
//                   <th>IP Address</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {logs.map((log) => {
//                   const { date, time } = formatTime(log.timestamp)
//                   return (
//                     <tr key={log.id}>
//                       <td className="text-surface-300 font-mono text-xs">{log.id}</td>
//                       <td>
//                         <div>
//                           <p className="text-xs font-medium text-surface-700 font-mono">{time}</p>
//                           <p className="text-[10px] text-surface-400 font-body">{date}</p>
//                         </div>
//                       </td>
//                       <td><ActionBadge action={log.action} /></td>
//                       <td>
//                         <div>
//                           <span className="chip text-[11px] capitalize">{log.entity_type}</span>
//                           {log.entity_id && (
//                             <span className="text-[10px] text-surface-300 font-mono ml-1">#{log.entity_id}</span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <div>
//                           <p className="text-xs text-surface-700 font-body truncate max-w-[140px]">{log.user_email || '—'}</p>
//                           {log.user_role && (
//                             <span className={`badge text-[10px] px-1.5 py-0 mt-0.5
//                               ${log.user_role === 'admin' ? 'badge-admin' : log.user_role === 'manager' ? 'badge-manager' : 'badge-staff'}`}>
//                               {log.user_role}
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="max-w-[200px]">
//                         <p className="text-xs text-surface-500 font-body truncate" title={log.description}>
//                           {log.description || '—'}
//                         </p>
//                       </td>
//                       <td>
//                         <span className="text-[11px] font-mono text-surface-400">{log.ip_address || '—'}</span>
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Pagination */}
//         {pagination.total_pages > 1 && (
//           <div className="flex items-center justify-between mt-4">
//             <p className="text-xs text-surface-400 font-body">
//               {pagination.total} total log entries
//             </p>
//             <Pagination
//               page={pagination.page}
//               totalPages={pagination.total_pages}
//               onPageChange={(p) => fetchLogs(p)}
//             />
//           </div>
//         )}
//       </div>

//       <Toast toasts={toasts} removeToast={removeToast} />
//     </>
//   )
// }





import { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext'

export default function AuditLog() {
    const { isAdmin }               = useAuth()
    const [logs,      setLogs]      = useState([])
    const [pagination,setPagination]= useState({})
    const [loading,   setLoading]   = useState(true)
    const [action,    setAction]    = useState('')
    const [entity,    setEntity]    = useState('')
    const [email,     setEmail]     = useState('')
    const [page,      setPage]      = useState(1)
    const [summary,   setSummary]   = useState(null)

    useEffect(() => { fetchLogs() }, [page, action, entity, email])
    useEffect(() => { fetchSummary() }, [])

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page, per_page: 20,
                ...(action && { action }),
                ...(entity && { entity_type: entity }),
                ...(email  && { user_email: email })
            })
            const res = await axiosInstance.get(`/audit/?${params}`)
            setLogs(res.data.data)
            setPagination(res.data.pagination)
        } catch {}
        finally { setLoading(false) }
    }

    const fetchSummary = async () => {
        try {
            const res = await axiosInstance.get('/audit/summary')
            setSummary(res.data.data)
        } catch {}
    }

    const actionColor = (action) => {
        if (action.startsWith('CREATE'))   return 'badge-green'
        if (action.startsWith('UPDATE'))   return 'badge-blue'
        if (action.startsWith('DELETE'))   return 'badge-red'
        if (action.startsWith('ASSIGN'))   return 'badge-purple'
        if (action.startsWith('CHECKOUT')) return 'badge-yellow'
        return 'badge-gray'
    }

    if (!isAdmin()) return (
        <div className="page">
            <div className="card text-center text-red-400 py-16">
                Access denied — Admin only
            </div>
        </div>
    )

    return (
        <div className="page fade-in">
            <h1 className="section-title">Audit Log</h1>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {summary.action_counts.slice(0, 4).map((a, i) => (
                        <div key={i} className="stat-card">
                            <div className="text-2xl font-['Syne'] font-extrabold
                                            gradient-text mb-1">
                                {a.count}
                            </div>
                            <div className="text-xs text-gray-500 uppercase
                                            tracking-wider">
                                {a.action.replace('_', ' ')}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="flex gap-3 mb-6 flex-wrap">
                <input className="input max-w-[200px]"
                    placeholder="Filter by action..."
                    value={action}
                    onChange={e => { setAction(e.target.value); setPage(1) }}
                />
                <select className="select max-w-[160px]"
                    value={entity}
                    onChange={e => { setEntity(e.target.value); setPage(1) }}
                >
                    <option value="">All Entities</option>
                    <option value="room">Room</option>
                    <option value="resident">Resident</option>
                    <option value="user">User</option>
                </select>
                <input className="input max-w-[220px]"
                    placeholder="Filter by email..."
                    value={email}
                    onChange={e => { setEmail(e.target.value); setPage(1) }}
                />
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="spinner w-10 h-10"/>
                </div>
            ) : (
                <>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Action</th>
                                    <th>Entity</th>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Description</th>
                                    <th>IP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="7">
                                            <div className="empty-state">
                                                No logs found
                                            </div>
                                        </td>
                                    </tr>
                                ) : logs.map(log => (
                                    <tr key={log.id}>
                                        <td className="text-xs text-gray-500
                                                       whitespace-nowrap">
                                            {new Date(log.timestamp)
                                                .toLocaleString()}
                                        </td>
                                        <td>
                                            <span className={actionColor(log.action)}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge-gray">
                                                {log.entity_type}
                                            </span>
                                        </td>
                                        <td className="text-xs text-gray-400">
                                            {log.user_email || 'System'}
                                        </td>
                                        <td>
                                            {log.user_role
                                                ? <span className="badge-purple">
                                                    {log.user_role}
                                                  </span>
                                                : '—'}
                                        </td>
                                        <td className="text-xs text-gray-500
                                                       max-w-xs truncate">
                                            {log.description}
                                        </td>
                                        <td className="text-xs text-gray-600">
                                            {log.ip_address}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pagination.total_pages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-xs text-gray-500">
                                {pagination.total} total logs
                            </p>
                            <div className="flex gap-2">
                                <button disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="btn-secondary text-xs px-3 py-1.5
                                               disabled:opacity-40">
                                    Prev
                                </button>
                                <span className="text-sm text-gray-400 px-3 py-1.5">
                                    {page} / {pagination.total_pages}
                                </span>
                                <button
                                    disabled={page === pagination.total_pages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="btn-secondary text-xs px-3 py-1.5
                                               disabled:opacity-40">
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}