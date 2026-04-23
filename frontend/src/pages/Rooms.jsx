// import { useEffect, useState, useCallback } from 'react'
// import {
//   Plus, Search, Edit2, Trash2, DoorOpen,
//   SlidersHorizontal, X, RefreshCw
// } from 'lucide-react'
// import { roomsAPI }     from '../api/roomsAPI'
// import { useAuth }      from '../context/AuthContext'
// import Modal            from '../components/Modal'
// import ConfirmDialog    from '../components/ConfirmDialog'
// import Pagination       from '../components/Pagination'
// import Toast            from '../components/Toast'
// import { useToast }     from '../components/useToast'
// import RoleGuard        from '../components/RoleGuard'

// // ── Status & type config ──────────────────────────────────────
// const STATUS_OPTS = ['', 'available', 'occupied', 'maintenance']
// const TYPE_OPTS   = ['', 'single', 'double', 'suite']

// function StatusBadge({ status }) {
//   const map = {
//     available:   'badge-available',
//     occupied:    'badge-occupied',
//     maintenance: 'badge-maintenance',
//   }
//   const dot = { available: 'dot-available', occupied: 'dot-occupied', maintenance: 'dot-maintenance' }
//   return (
//     <span className={map[status] || 'badge bg-surface-100 text-surface-500'}>
//       <span className={dot[status]} />
//       {status}
//     </span>
//   )
// }

// const EMPTY_FORM = {
//   room_number: '', floor: '', room_type: 'single',
//   monthly_rent: '', capacity: '1', description: '', status: 'available'
// }

// // ── Room Form ─────────────────────────────────────────────────
// function RoomForm({ form, onChange, error }) {
//   const field = (name, label, type = 'text', extra = {}) => (
//     <div>
//       <label className="label">{label}</label>
//       <input
//         type={type}
//         className={`input ${error?.[name] ? 'input-error' : ''}`}
//         value={form[name]}
//         onChange={(e) => onChange(name, e.target.value)}
//         {...extra}
//       />
//       {error?.[name] && <p className="text-xs text-red-500 mt-1 font-body">{error[name]}</p>}
//     </div>
//   )

//   return (
//     <div className="space-y-4">
//       <div className="grid grid-cols-2 gap-3">
//         {field('room_number', 'Room Number', 'text', { placeholder: '101' })}
//         {field('floor',       'Floor',       'number', { placeholder: '1', min: 0 })}
//       </div>
//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <label className="label">Room Type</label>
//           <select className="input" value={form.room_type} onChange={(e) => onChange('room_type', e.target.value)}>
//             {['single', 'double', 'suite'].map((t) => (
//               <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
//             ))}
//           </select>
//         </div>
//         {field('capacity', 'Capacity', 'number', { placeholder: '1', min: 1, max: 10 })}
//       </div>
//       {field('monthly_rent', 'Monthly Rent (₹)', 'number', { placeholder: '8000', min: 0, step: '0.01' })}
//       <div>
//         <label className="label">Status</label>
//         <select className="input" value={form.status} onChange={(e) => onChange('status', e.target.value)}>
//           {['available', 'occupied', 'maintenance'].map((s) => (
//             <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
//           ))}
//         </select>
//       </div>
//       <div>
//         <label className="label">Description (optional)</label>
//         <textarea
//           className="input resize-none"
//           rows={2}
//           placeholder="Room description…"
//           value={form.description}
//           onChange={(e) => onChange('description', e.target.value)}
//         />
//       </div>
//     </div>
//   )
// }

// // ── Main Page ─────────────────────────────────────────────────
// export default function Rooms() {
//   const { canWrite }               = useAuth()
//   const { toasts, removeToast, toast } = useToast()

//   const [rooms,      setRooms]      = useState([])
//   const [loading,    setLoading]    = useState(true)
//   const [pagination, setPagination] = useState({ page: 1, per_page: 12, total: 0, total_pages: 1 })
//   const [filters,    setFilters]    = useState({ search: '', status: '', floor: '' })
//   const [search,     setSearch]     = useState('')

//   // Modals
//   const [showForm,   setShowForm]   = useState(false)
//   const [editRoom,   setEditRoom]   = useState(null)
//   const [form,       setForm]       = useState(EMPTY_FORM)
//   const [formError,  setFormError]  = useState({})
//   const [saving,     setSaving]     = useState(false)

//   const [deleteId,   setDeleteId]   = useState(null)
//   const [deleting,   setDeleting]   = useState(false)

//   const [showFilters, setShowFilters] = useState(false)

//   // ── Fetch ──────────────────────────────────────────────────
//   const fetchRooms = useCallback(async (page = 1) => {
//     setLoading(true)
//     try {
//       const params = { page, per_page: pagination.per_page }
//       if (filters.search)  params.search = filters.search
//       if (filters.status)  params.status = filters.status
//       if (filters.floor)   params.floor  = filters.floor
//       const res = await roomsAPI.getAll(params)
//       setRooms(res.data.data)
//       setPagination(res.data.pagination)
//     } catch {
//       toast.error('Failed to load rooms')
//     } finally {
//       setLoading(false)
//     }
//   }, [filters, pagination.per_page])

//   useEffect(() => { fetchRooms(1) }, [filters])

//   // Debounce search input → filters.search
//   useEffect(() => {
//     const t = setTimeout(() => setFilters((f) => ({ ...f, search })), 400)
//     return () => clearTimeout(t)
//   }, [search])

//   // ── Form helpers ───────────────────────────────────────────
//   const openCreate = () => {
//     setEditRoom(null)
//     setForm(EMPTY_FORM)
//     setFormError({})
//     setShowForm(true)
//   }

//   const openEdit = (room) => {
//     setEditRoom(room)
//     setForm({
//       room_number:  room.room_number,
//       floor:        String(room.floor),
//       room_type:    room.room_type,
//       monthly_rent: String(room.monthly_rent),
//       capacity:     String(room.capacity),
//       description:  room.description || '',
//       status:       room.status,
//     })
//     setFormError({})
//     setShowForm(true)
//   }

//   const handleFormChange = (key, val) => {
//     setForm((f) => ({ ...f, [key]: val }))
//     setFormError((e) => ({ ...e, [key]: undefined }))
//   }

//   const validateForm = () => {
//     const e = {}
//     if (!form.room_number.trim())  e.room_number  = 'Room number is required'
//     if (!form.floor)               e.floor        = 'Floor is required'
//     if (!form.monthly_rent)        e.monthly_rent = 'Monthly rent is required'
//     return e
//   }

//   const handleSave = async () => {
//     const errors = validateForm()
//     if (Object.keys(errors).length) { setFormError(errors); return }

//     setSaving(true)
//     try {
//       const payload = {
//         ...form,
//         floor:        parseInt(form.floor),
//         monthly_rent: parseFloat(form.monthly_rent),
//         capacity:     parseInt(form.capacity),
//       }
//       if (editRoom) {
//         await roomsAPI.update(editRoom.id, payload)
//         toast.success(`Room ${form.room_number} updated`)
//       } else {
//         await roomsAPI.create(payload)
//         toast.success(`Room ${form.room_number} created`)
//       }
//       setShowForm(false)
//       fetchRooms(pagination.page)
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to save room')
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleDelete = async () => {
//     setDeleting(true)
//     try {
//       await roomsAPI.delete(deleteId)
//       toast.success('Room deleted')
//       setDeleteId(null)
//       fetchRooms(pagination.page)
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to delete room')
//     } finally {
//       setDeleting(false)
//     }
//   }

//   const clearFilters = () => {
//     setFilters({ search: '', status: '', floor: '' })
//     setSearch('')
//   }
//   const hasFilters = filters.status || filters.floor

//   return (
//     <>
//       <div className="p-6 animate-fade-in">
//         {/* ── Header ──────────────────────────────────────── */}
//         <div className="page-header">
//           <div>
//             <h1 className="page-title">Rooms</h1>
//             <p className="page-subtitle">{pagination.total} rooms total</p>
//           </div>
//           <div className="flex items-center gap-2">
//             <RoleGuard roles={['admin', 'manager']}>
//               <button onClick={openCreate} className="btn-primary">
//                 <Plus size={15} /> Add Room
//               </button>
//             </RoleGuard>
//           </div>
//         </div>

//         {/* ── Search + Filters bar ────────────────────────── */}
//         <div className="flex flex-wrap items-center gap-3 mb-5">
//           <div className="relative flex-1 min-w-[200px] max-w-sm">
//             <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
//             <input
//               className="input pl-9"
//               placeholder="Search room number…"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             {search && (
//               <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
//                 <X size={14} />
//               </button>
//             )}
//           </div>

//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className={`btn-secondary gap-1.5 ${hasFilters ? 'border-brand-400 text-brand-600 bg-brand-50' : ''}`}
//           >
//             <SlidersHorizontal size={14} />
//             Filters
//             {hasFilters && <span className="w-4 h-4 bg-brand-600 text-white text-[10px] rounded-full flex items-center justify-center">!</span>}
//           </button>

//           <button onClick={() => fetchRooms(pagination.page)} className="btn-ghost" title="Refresh">
//             <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
//           </button>
//         </div>

//         {/* Filters panel */}
//         {showFilters && (
//           <div className="card p-4 mb-5 animate-slide-up flex flex-wrap gap-3 items-end">
//             <div>
//               <label className="label">Status</label>
//               <select
//                 className="input w-40"
//                 value={filters.status}
//                 onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
//               >
//                 {STATUS_OPTS.map((s) => (
//                   <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All statuses'}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label">Floor</label>
//               <input
//                 type="number"
//                 className="input w-28"
//                 placeholder="e.g. 3"
//                 min={0}
//                 value={filters.floor}
//                 onChange={(e) => setFilters((f) => ({ ...f, floor: e.target.value }))}
//               />
//             </div>
//             {hasFilters && (
//               <button onClick={clearFilters} className="btn-ghost text-red-500 hover:bg-red-50 self-end">
//                 <X size={14} /> Clear
//               </button>
//             )}
//           </div>
//         )}

//         {/* ── Table ───────────────────────────────────────── */}
//         {loading ? (
//           <div className="table-wrapper">
//             <div className="animate-pulse p-6 space-y-3">
//               {[...Array(6)].map((_, i) => (
//                 <div key={i} className="flex gap-4">
//                   {[...Array(6)].map((_, j) => <div key={j} className="skeleton h-5 flex-1 rounded" />)}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : rooms.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-state-icon"><DoorOpen size={24} /></div>
//             <p className="text-surface-500 font-body text-sm mb-3">No rooms found</p>
//             {canWrite && <button onClick={openCreate} className="btn-primary btn-sm">Add first room</button>}
//           </div>
//         ) : (
//           <div className="table-wrapper">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Room No.</th>
//                   <th>Floor</th>
//                   <th>Type</th>
//                   <th>Status</th>
//                   <th>Capacity</th>
//                   <th>Rent / Month</th>
//                   <th>Residents</th>
//                   {canWrite && <th className="text-right">Actions</th>}
//                 </tr>
//               </thead>
//               <tbody>
//                 {rooms.map((room) => (
//                   <tr key={room.id}>
//                     <td>
//                       <span className="font-semibold text-surface-900 font-mono text-sm">
//                         {room.room_number}
//                       </span>
//                     </td>
//                     <td className="text-surface-500">Floor {room.floor}</td>
//                     <td>
//                       <span className="chip capitalize">{room.room_type}</span>
//                     </td>
//                     <td><StatusBadge status={room.status} /></td>
//                     <td className="text-surface-600">{room.capacity}</td>
//                     <td className="font-medium text-surface-800">
//                       ₹{parseFloat(room.monthly_rent).toLocaleString('en-IN')}
//                     </td>
//                     <td className="text-surface-500">{room.resident_count}</td>
//                     {canWrite && (
//                       <td className="text-right">
//                         <div className="flex items-center justify-end gap-1">
//                           <button
//                             onClick={() => openEdit(room)}
//                             className="btn-ghost btn-sm p-2 text-surface-500 hover:text-brand-600"
//                             title="Edit"
//                           >
//                             <Edit2 size={14} />
//                           </button>
//                           <button
//                             onClick={() => setDeleteId(room.id)}
//                             className="btn-ghost btn-sm p-2 text-surface-500 hover:text-red-600"
//                             title="Delete"
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         </div>
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* ── Pagination ──────────────────────────────────── */}
//         {pagination.total_pages > 1 && (
//           <div className="flex items-center justify-between mt-4">
//             <p className="text-xs text-surface-400 font-body">
//               Showing {(pagination.page - 1) * pagination.per_page + 1}–
//               {Math.min(pagination.page * pagination.per_page, pagination.total)} of {pagination.total}
//             </p>
//             <Pagination
//               page={pagination.page}
//               totalPages={pagination.total_pages}
//               onPageChange={(p) => fetchRooms(p)}
//             />
//           </div>
//         )}
//       </div>

//       {/* ── Create / Edit Modal ─────────────────────────── */}
//       <Modal
//         open={showForm}
//         onClose={() => setShowForm(false)}
//         title={editRoom ? `Edit Room ${editRoom.room_number}` : 'Add New Room'}
//       >
//         <RoomForm form={form} onChange={handleFormChange} error={formError} />
//         <div className="flex gap-3 mt-6">
//           <button onClick={() => setShowForm(false)} className="btn-secondary flex-1" disabled={saving}>Cancel</button>
//           <button onClick={handleSave} className="btn-primary flex-1" disabled={saving}>
//             {saving ? 'Saving…' : editRoom ? 'Save Changes' : 'Create Room'}
//           </button>
//         </div>
//       </Modal>

//       {/* ── Confirm delete ──────────────────────────────── */}
//       <ConfirmDialog
//         open={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         loading={deleting}
//         title="Delete Room"
//         message="This room will be permanently deleted. Make sure no residents are assigned."
//       />

//       <Toast toasts={toasts} removeToast={removeToast} />
//     </>
//   )
// }


















import { useEffect, useState } from 'react'
import {
    getRooms, createRoom, updateRoom,
    deleteRoom, updateRoomStatus
} from '../api/roomsAPI'
import { useAuth } from '../context/AuthContext'

const statusBadge = (status) => {
    if (status === 'available')   return <span className="badge-green">Available</span>
    if (status === 'occupied')    return <span className="badge-red">Occupied</span>
    if (status === 'maintenance') return <span className="badge-yellow">Maintenance</span>
}

const typeBadge = (type) => {
    if (type === 'single') return <span className="badge-blue">Single</span>
    if (type === 'double') return <span className="badge-purple">Double</span>
    if (type === 'suite')  return <span className="badge-yellow">Suite</span>
}

const EMPTY_FORM = {
    room_number: '', floor: '', room_type: 'single',
    monthly_rent: '', capacity: 1, description: ''
}

export default function Rooms() {
    const { isManager }              = useAuth()
    const [rooms,      setRooms]     = useState([])
    const [pagination, setPagination]= useState({})
    const [loading,    setLoading]   = useState(true)
    const [showModal,  setShowModal] = useState(false)
    const [editRoom,   setEditRoom]  = useState(null)
    const [form,       setForm]      = useState(EMPTY_FORM)
    const [error,      setError]     = useState('')
    const [saving,     setSaving]    = useState(false)
    const [search,     setSearch]    = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [page,       setPage]      = useState(1)

    useEffect(() => { fetchRooms() }, [page, search, statusFilter])

    const fetchRooms = async () => {
        setLoading(true)
        try {
            const res = await getRooms({
                page, per_page: 10,
                search, status: statusFilter
            })
            setRooms(res.data)
            setPagination(res.pagination)
        } catch { setError('Failed to load rooms') }
        finally  { setLoading(false) }
    }

    const openCreate = () => {
        setEditRoom(null)
        setForm(EMPTY_FORM)
        setError('')
        setShowModal(true)
    }

    const openEdit = (room) => {
        setEditRoom(room)
        setForm({
            room_number:  room.room_number,
            floor:        room.floor,
            room_type:    room.room_type,
            monthly_rent: room.monthly_rent,
            capacity:     room.capacity,
            description:  room.description || ''
        })
        setError('')
        setShowModal(true)
    }

    // const handleSave = async (e) => {
    //     e.preventDefault()
    //     setSaving(true)
    //     setError('')
    //     try {
    //         if (editRoom) {
    //             await updateRoom(editRoom.id, form)
    //         } else {
    //             await createRoom(form)
    //         }
    //         setShowModal(false)
    //         fetchRooms()
    //     } catch (err) {
    //         setError(err.response?.data?.message || 'Save failed')
    //     } finally { setSaving(false) }
    // }


    const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
        if (editRoom) {
            await updateRoom(editRoom.id, form)
        } else {
            await createRoom(form)
        }
        setShowModal(false)
        fetchRooms()
    } catch (err) {
        // If 201 or 200 status, it actually succeeded — ignore error
        if (err.response?.status === 201 || err.response?.status === 200) {
            setShowModal(false)
            fetchRooms()
            return
        }
        setError(err.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
}

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this room?')) return
        try {
            await deleteRoom(id)
            fetchRooms()
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed')
        }
    }

    const handleStatusChange = async (id, status) => {
        try {
            await updateRoomStatus(id, status)
            fetchRooms()
        } catch (err) {
            alert(err.response?.data?.message || 'Status update failed')
        }
    }

    return (
        <div className="page fade-in">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="section-title mb-0">Rooms</h1>
                {isManager() && (
                    <button onClick={openCreate} className="btn-primary">
                        + Add Room
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-6 flex-wrap">
                <input
                    className="input max-w-xs"
                    placeholder="Search room number..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                />
                <select
                    className="select max-w-[160px]"
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
                >
                    <option value="">All Status</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                </select>
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
                                    <th>Room No.</th>
                                    <th>Floor</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Capacity</th>
                                    <th>Rent/Month</th>
                                    <th>Residents</th>
                                    {isManager() && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.length === 0 ? (
                                    <tr>
                                        <td colSpan="8">
                                            <div className="empty-state">
                                                No rooms found
                                            </div>
                                        </td>
                                    </tr>
                                ) : rooms.map(room => (
                                    <tr key={room.id}>
                                        <td className="font-semibold text-white">
                                            {room.room_number}
                                        </td>
                                        <td>{room.floor}</td>
                                        <td>{typeBadge(room.room_type)}</td>
                                        <td>
                                            {isManager() ? (
                                                <select
                                                    className="bg-transparent
                                                               border-0 text-sm
                                                               focus:outline-none
                                                               cursor-pointer"
                                                    value={room.status}
                                                    onChange={e =>
                                                        handleStatusChange(
                                                            room.id,
                                                            e.target.value
                                                        )}
                                                >
                                                    <option value="available">Available</option>
                                                    <option value="occupied">Occupied</option>
                                                    <option value="maintenance">Maintenance</option>
                                                </select>
                                            ) : statusBadge(room.status)}
                                        </td>
                                        <td>{room.capacity}</td>
                                        <td>₹{room.monthly_rent?.toLocaleString()}</td>
                                        <td>{room.resident_count}</td>
                                        {isManager() && (
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openEdit(room)}
                                                        className="btn-secondary
                                                                   text-xs px-3 py-1.5"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(room.id)}
                                                        className="btn-danger
                                                                   text-xs px-3 py-1.5"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.total_pages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-xs text-gray-500">
                                {pagination.total} total rooms
                            </p>
                            <div className="flex gap-2">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="btn-secondary text-xs px-3 py-1.5
                                               disabled:opacity-40"
                                >
                                    Prev
                                </button>
                                <span className="text-sm text-gray-400
                                                 px-3 py-1.5">
                                    {page} / {pagination.total_pages}
                                </span>
                                <button
                                    disabled={page === pagination.total_pages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="btn-secondary text-xs px-3 py-1.5
                                               disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2 className="modal-title">
                            {editRoom ? 'Edit Room' : 'Add New Room'}
                        </h2>

                        {error && (
                            <div className="bg-red-900/30 border border-red-800
                                            text-red-400 rounded-xl px-4 py-3
                                            text-sm mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Room Number</label>
                                    <input className="input"
                                        value={form.room_number}
                                        onChange={e => setForm({
                                            ...form,
                                            room_number: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Floor</label>
                                    <input className="input" type="number"
                                        value={form.floor}
                                        onChange={e => setForm({
                                            ...form, floor: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Room Type</label>
                                    <select className="select"
                                        value={form.room_type}
                                        onChange={e => setForm({
                                            ...form, room_type: e.target.value
                                        })}
                                    >
                                        <option value="single">Single</option>
                                        <option value="double">Double</option>
                                        <option value="suite">Suite</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Capacity</label>
                                    <input className="input" type="number"
                                        min="1" max="10"
                                        value={form.capacity}
                                        onChange={e => setForm({
                                            ...form, capacity: e.target.value
                                        })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label">Monthly Rent (₹)</label>
                                <input className="input" type="number"
                                    value={form.monthly_rent}
                                    onChange={e => setForm({
                                        ...form, monthly_rent: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">Description</label>
                                <textarea className="input" rows={2}
                                    value={form.description}
                                    onChange={e => setForm({
                                        ...form, description: e.target.value
                                    })}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit"
                                    disabled={saving}
                                    className="btn-primary flex-1">
                                    {saving ? 'Saving...' : 'Save Room'}
                                </button>
                                <button type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary flex-1">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}