// import { useEffect, useState, useCallback } from 'react'
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, Legend
// } from 'recharts'
// import {
//   DoorOpen, Users, IndianRupee, TrendingUp,
//   RefreshCw, Activity, Clock
// } from 'lucide-react'
// import StatCard from '../components/StatCard'
// import { dashboardAPI } from '../api/dashboardAPI'

// // ── helpers ────────────────────────────────────────────────────
// const STATUS_COLORS = { available: '#10b981', occupied: '#3b6eff', maintenance: '#f59e0b' }
// const PIE_COLORS    = ['#3b6eff', '#10b981', '#6366f1']

// function ActionBadge({ action }) {
//   const map = {
//     CREATE_ROOM:       'bg-emerald-50 text-emerald-700',
//     UPDATE_ROOM:       'bg-blue-50 text-blue-700',
//     DELETE_ROOM:       'bg-red-50 text-red-600',
//     CREATE_RESIDENT:   'bg-emerald-50 text-emerald-700',
//     UPDATE_RESIDENT:   'bg-blue-50 text-blue-700',
//     DELETE_RESIDENT:   'bg-red-50 text-red-600',
//     ASSIGN_ROOM:       'bg-purple-50 text-purple-700',
//     CHECKOUT_RESIDENT: 'bg-amber-50 text-amber-700',
//     LOGIN:             'bg-surface-100 text-surface-600',
//     LOGOUT:            'bg-surface-100 text-surface-600',
//     CREATE_USER:       'bg-sky-50 text-sky-700',
//   }
//   return (
//     <span className={`badge text-[10px] px-2 py-0.5 ${map[action] || 'bg-surface-100 text-surface-500'}`}>
//       {action.replace(/_/g, ' ')}
//     </span>
//   )
// }

// function SkeletonCards() {
//   return (
//     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//       {[...Array(4)].map((_, i) => (
//         <div key={i} className="card p-5 animate-pulse">
//           <div className="skeleton h-3 w-24 mb-3 rounded" />
//           <div className="skeleton h-8 w-16 mb-2 rounded" />
//           <div className="skeleton h-3 w-20 rounded" />
//         </div>
//       ))}
//     </div>
//   )
// }

// export default function Dashboard() {
//   const [data,      setData]      = useState(null)
//   const [loading,   setLoading]   = useState(true)
//   const [refreshing, setRefreshing] = useState(false)
//   const [lastUpdate, setLastUpdate] = useState(null)

//   const fetchData = useCallback(async (isRefresh = false) => {
//     if (isRefresh) setRefreshing(true)
//     else setLoading(true)
//     try {
//       const res = await dashboardAPI.get()
//       setData(res.data.data)
//       setLastUpdate(new Date())
//     } catch (err) {
//       console.error('Dashboard fetch failed', err)
//     } finally {
//       setLoading(false)
//       setRefreshing(false)
//     }
//   }, [])

//   useEffect(() => { fetchData() }, [fetchData])

//   // Auto-refresh every 60 seconds
//   useEffect(() => {
//     const interval = setInterval(() => fetchData(true), 60_000)
//     return () => clearInterval(interval)
//   }, [fetchData])

//   if (loading) return <SkeletonCards />

//   if (!data) return (
//     <div className="empty-state">
//       <div className="empty-state-icon"><Activity size={24} /></div>
//       <p className="text-surface-500 font-body text-sm">Failed to load dashboard data.</p>
//     </div>
//   )

//   const { rooms, residents, revenue, room_type_breakdown, floor_stats, recent_activity } = data

//   // Room status data for pie
//   const statusData = [
//     { name: 'Available',   value: rooms.available,   color: STATUS_COLORS.available },
//     { name: 'Occupied',    value: rooms.occupied,     color: STATUS_COLORS.occupied },
//     { name: 'Maintenance', value: rooms.maintenance,  color: STATUS_COLORS.maintenance },
//   ]

//   // Floor data for bar chart (show top 8 floors)
//   const floorData = floor_stats.slice(0, 8).map((f) => ({
//     name:     `F${f.floor}`,
//     Total:    f.total_rooms,
//     Occupied: f.occupied_rooms,
//   }))

//   return (
//     <div className="p-6 animate-fade-in">
//       {/* ── Header ──────────────────────────────────────────── */}
//       <div className="page-header">
//         <div>
//           <h1 className="page-title">Dashboard</h1>
//           <p className="page-subtitle">
//             {lastUpdate
//               ? `Last updated ${lastUpdate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
//               : 'Live occupancy overview'}
//           </p>
//         </div>
//         <button
//           onClick={() => fetchData(true)}
//           className="btn-secondary gap-2"
//           disabled={refreshing}
//         >
//           <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
//           Refresh
//         </button>
//       </div>

//       {/* ── Stat Cards ──────────────────────────────────────── */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <StatCard
//           title="Total Rooms"
//           value={rooms.total}
//           subtitle={`${rooms.occupancy_rate}% occupied`}
//           icon={DoorOpen}
//           accent="brand"
//         />
//         <StatCard
//           title="Available"
//           value={rooms.available}
//           subtitle="Ready to assign"
//           icon={DoorOpen}
//           accent="available"
//         />
//         <StatCard
//           title="Active Residents"
//           value={residents.active}
//           subtitle={`${residents.total} total residents`}
//           icon={Users}
//           accent="occupied"
//         />
//         <StatCard
//           title="Monthly Revenue"
//           value={`₹${(revenue.monthly_total / 1000).toFixed(0)}K`}
//           subtitle="From occupied rooms"
//           icon={IndianRupee}
//           accent="maintenance"
//         />
//       </div>

//       {/* ── Charts row ──────────────────────────────────────── */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

//         {/* Bar chart: floor occupancy */}
//         <div className="card p-5 lg:col-span-2">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h3 className="text-sm font-bold font-display text-surface-800">Floor-wise Occupancy</h3>
//               <p className="text-xs text-surface-400 font-body">Rooms per floor</p>
//             </div>
//             <TrendingUp size={16} className="text-surface-300" />
//           </div>
//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={floorData} barCategoryGap="30%">
//               <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} width={28} />
//               <Tooltip
//                 contentStyle={{ fontFamily: 'DM Sans', fontSize: 12, borderRadius: 8, border: '1px solid #e4e8f2' }}
//                 cursor={{ fill: '#f1f3f9' }}
//               />
//               <Bar dataKey="Total"    fill="#e0eaff" radius={[4, 4, 0, 0]} />
//               <Bar dataKey="Occupied" fill="#3b6eff" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Pie: room status */}
//         <div className="card p-5">
//           <div className="mb-4">
//             <h3 className="text-sm font-bold font-display text-surface-800">Room Status</h3>
//             <p className="text-xs text-surface-400 font-body">Distribution across {rooms.total} rooms</p>
//           </div>
//           <ResponsiveContainer width="100%" height={160}>
//             <PieChart>
//               <Pie
//                 data={statusData}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={45}
//                 outerRadius={70}
//                 paddingAngle={3}
//                 dataKey="value"
//               >
//                 {statusData.map((entry) => (
//                   <Cell key={entry.name} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip contentStyle={{ fontFamily: 'DM Sans', fontSize: 12, borderRadius: 8, border: '1px solid #e4e8f2' }} />
//             </PieChart>
//           </ResponsiveContainer>
//           <div className="flex flex-col gap-1.5 mt-1">
//             {statusData.map((s) => (
//               <div key={s.name} className="flex items-center justify-between text-xs font-body">
//                 <div className="flex items-center gap-1.5">
//                   <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
//                   <span className="text-surface-600">{s.name}</span>
//                 </div>
//                 <span className="font-semibold text-surface-800">{s.value}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── Bottom row ──────────────────────────────────────── */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

//         {/* Room type breakdown */}
//         <div className="card p-5">
//           <h3 className="text-sm font-bold font-display text-surface-800 mb-4">Room Types</h3>
//           <div className="space-y-3">
//             {room_type_breakdown.map((r, i) => {
//               const pct = r.total ? Math.round((r.occupied / r.total) * 100) : 0
//               return (
//                 <div key={r.type}>
//                   <div className="flex items-center justify-between mb-1">
//                     <span className="text-sm font-medium text-surface-700 font-body capitalize">{r.type}</span>
//                     <span className="text-xs text-surface-500 font-body">{r.occupied}/{r.total}</span>
//                   </div>
//                   <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
//                     <div
//                       className="h-full rounded-full transition-all duration-500"
//                       style={{ width: `${pct}%`, background: PIE_COLORS[i % PIE_COLORS.length] }}
//                     />
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </div>

//         {/* Recent activity */}
//         <div className="card p-5 lg:col-span-2">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-sm font-bold font-display text-surface-800">Recent Activity</h3>
//             <Clock size={14} className="text-surface-300" />
//           </div>
//           <div className="space-y-0 divide-y divide-surface-50">
//             {recent_activity.slice(0, 8).map((log) => (
//               <div key={log.id} className="flex items-start gap-3 py-2.5 hover:bg-surface-50 -mx-2 px-2 rounded-lg transition-colors">
//                 <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 flex-shrink-0" />
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <ActionBadge action={log.action} />
//                     <span className="text-xs text-surface-400 font-body">
//                       {log.user_email || 'System'}
//                     </span>
//                   </div>
//                   {log.description && (
//                     <p className="text-xs text-surface-500 font-body mt-0.5 truncate">{log.description}</p>
//                   )}
//                 </div>
//                 <span className="text-[10px] text-surface-300 font-mono flex-shrink-0 mt-0.5">
//                   {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }










import { useEffect, useState } from 'react'
import { getDashboard } from '../api/dashboardAPI'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#FF3CAC', '#784BA0', '#2B86C5', '#00e676']

export default function Dashboard() {
    const [data,    setData]    = useState(null)
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState('')

    useEffect(() => {
        fetchDashboard()
    }, [])

    const fetchDashboard = async () => {
        try {
            const res = await getDashboard()
            setData(res)
        } catch (err) {
            setError('Failed to load dashboard')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="page flex items-center justify-center h-64">
            <div className="spinner w-10 h-10"/>
        </div>
    )

    if (error) return (
        <div className="page">
            <div className="badge-red p-4">{error}</div>
        </div>
    )

    return (
        <div className="page fade-in">
            <h1 className="section-title">Dashboard</h1>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Rooms',      value: data.rooms.total,         color: '#FF3CAC' },
                    { label: 'Available Rooms',  value: data.rooms.available,     color: '#00e676' },
                    { label: 'Occupied Rooms',   value: data.rooms.occupied,      color: '#2B86C5' },
                    { label: 'Active Residents', value: data.residents.active,    color: '#784BA0' },
                    { label: 'Total Residents',  value: data.residents.total,     color: '#FF3CAC' },
                    { label: 'Maintenance',      value: data.rooms.maintenance,   color: '#ffab00' },
                    { label: 'Occupancy Rate',   value: `${data.rooms.occupancy_rate}%`, color: '#2B86C5' },
                    { label: 'Monthly Revenue',  value: `₹${data.revenue.monthly_total.toLocaleString()}`, color: '#00e676' },
                ].map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div className="text-3xl font-['Syne'] font-extrabold mb-1"
                             style={{ color: stat.color }}>
                            {stat.value}
                        </div>
                        <div className="text-xs text-gray-500 uppercase
                                        tracking-wider">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                {/* Room Type Breakdown */}
                <div className="card">
                    <h3 className="font-['Syne'] font-bold text-white
                                   mb-5 text-lg">
                        Room Type Breakdown
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={data.room_type_breakdown}
                                dataKey="total"
                                nameKey="type"
                                cx="50%" cy="50%"
                                outerRadius={80}
                                label={({ type, total }) =>
                                    `${type}: ${total}`}
                            >
                                {data.room_type_breakdown.map((_, i) => (
                                    <Cell key={i}
                                          fill={COLORS[i % COLORS.length]}/>
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: '#111',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Legend/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Floor Stats */}
                <div className="card">
                    <h3 className="font-['Syne'] font-bold text-white
                                   mb-5 text-lg">
                        Floor Occupancy
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={data.floor_stats}>
                            <XAxis dataKey="floor"
                                   tick={{ fill: '#888', fontSize: 11 }}
                                   label={{ value: 'Floor', position: 'insideBottom',
                                            fill: '#888', fontSize: 11 }}/>
                            <YAxis tick={{ fill: '#888', fontSize: 11 }}/>
                            <Tooltip
                                contentStyle={{
                                    background: '#111',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Bar dataKey="total_rooms"    fill="#333"     radius={4}/>
                            <Bar dataKey="occupied_rooms" fill="#FF3CAC"  radius={4}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Recent Activity ── */}
            <div className="card">
                <h3 className="font-['Syne'] font-bold text-white mb-5 text-lg">
                    Recent Activity
                </h3>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Action</th>
                                <th>Entity</th>
                                <th>User</th>
                                <th>Description</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recent_activity.map(log => (
                                <tr key={log.id}>
                                    <td>
                                        <span className="badge-purple">
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="text-gray-400">
                                        {log.entity_type}
                                    </td>
                                    <td className="text-gray-400 text-xs">
                                        {log.user_email || 'System'}
                                    </td>
                                    <td className="text-gray-500 text-xs max-w-xs truncate">
                                        {log.description}
                                    </td>
                                    <td className="text-gray-600 text-xs">
                                        {new Date(log.timestamp)
                                            .toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}