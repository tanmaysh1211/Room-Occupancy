// import { useEffect, useState, useCallback } from 'react'
// import {
//   Plus, Search, Edit2, Trash2, Users,
//   LogOut as CheckOut, DoorOpen, X, RefreshCw
// } from 'lucide-react'
// import { residentsAPI } from '../api/residentsAPI'
// import { roomsAPI }     from '../api/roomsAPI'
// import { useAuth }      from '../context/AuthContext'
// import Modal            from '../components/Modal'
// import ConfirmDialog    from '../components/ConfirmDialog'
// import Pagination       from '../components/Pagination'
// import Toast            from '../components/Toast'
// import { useToast }     from '../components/useToast'
// import RoleGuard        from '../components/RoleGuard'

// const EMPTY_FORM = {
//   name: '', email: '', phone: '', national_id: '',
//   emergency_contact_name: '', emergency_contact_phone: ''
// }

// function ResidentForm({ form, onChange, error }) {
//   const field = (name, label, type = 'text', placeholder = '') => (
//     <div>
//       <label className="label">{label}</label>
//       <input
//         type={type}
//         className={`input ${error?.[name] ? 'input-error' : ''}`}
//         placeholder={placeholder}
//         value={form[name]}
//         onChange={(e) => onChange(name, e.target.value)}
//       />
//       {error?.[name] && <p className="text-xs text-red-500 mt-1 font-body">{error[name]}</p>}
//     </div>
//   )

//   return (
//     <div className="space-y-3">
//       {field('name',        'Full Name',       'text',  'Rahul Sharma')}
//       {field('email',       'Email',           'email', 'rahul@example.com')}
//       {field('phone',       'Phone',           'tel',   '+91 9876543210')}
//       {field('national_id', 'National ID',     'text',  'AADHAAR / Passport No.')}
//       <div className="divider" />
//       <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider font-body">
//         Emergency Contact (optional)
//       </p>
//       {field('emergency_contact_name',  'Contact Name',  'text', 'Priya Sharma')}
//       {field('emergency_contact_phone', 'Contact Phone', 'tel',  '+91 9876543211')}
//     </div>
//   )
// }

// // ── Assign Room Modal ─────────────────────────────────────────
// function AssignRoomModal({ open, onClose, resident, onAssigned, toast }) {
//   const [rooms,       setRooms]       = useState([])
//   const [loading,     setLoading]     = useState(false)
//   const [saving,      setSaving]      = useState(false)
//   const [selectedId,  setSelectedId]  = useState('')
//   const [search,      setSearch]      = useState('')

//   useEffect(() => {
//     if (!open) return
//     setLoading(true)
//     roomsAPI.getAll({ status: 'available', per_page: 100 })
//       .then((res) => setRooms(res.data.data))
//       .catch(() => toast.error('Failed to load available rooms'))
//       .finally(() => setLoading(false))
//   }, [open])

//   const handleAssign = async () => {
//     if (!selectedId) return
//     setSaving(true)
//     try {
//       await residentsAPI.assignRoom(resident.id, parseInt(selectedId))
//       toast.success(`Room assigned to ${resident.name}`)
//       onAssigned()
//       onClose()
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to assign room')
//     } finally {
//       setSaving(false)
//     }
//   }

//   const filtered = rooms.filter((r) =>
//     r.room_number.toLowerCase().includes(search.toLowerCase())
//   )

//   return (
//     <Modal open={open} onClose={onClose} title={`Assign Room — ${resident?.name}`}>
//       <div className="mb-3">
//         <input
//           className="input"
//           placeholder="Search room number…"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {loading ? (
//         <div className="space-y-2">
//           {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="empty-state py-10">
//           <div className="empty-state-icon"><DoorOpen size={20} /></div>
//           <p className="text-surface-500 text-sm font-body">No available rooms found</p>
//         </div>
//       ) : (
//         <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 scrollbar-hide">
//           {filtered.map((room) => (
//             <label
//               key={room.id}
//               className={`
//                 flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all duration-150
//                 ${selectedId == room.id
//                   ? 'border-brand-400 bg-brand-50'
//                   : 'border-surface-200 hover:bg-surface-50'
//                 }
//               `}
//             >
//               <input
//                 type="radio"
//                 name="room"
//                 value={room.id}
//                 checked={selectedId == room.id}
//                 onChange={() => setSelectedId(room.id)}
//                 className="accent-brand-600"
//               />
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-semibold text-surface-800 font-mono">
//                   Room {room.room_number}
//                 </p>
//                 <p className="text-xs text-surface-500 font-body">
//                   Floor {room.floor} · {room.room_type} · ₹{parseFloat(room.monthly_rent).toLocaleString('en-IN')}/mo
//                 </p>
//               </div>
//               <span className="text-xs text-surface-400 font-body">
//                 {room.resident_count}/{room.capacity} occupied
//               </span>
//             </label>
//           ))}
//         </div>
//       )}

//       <div className="flex gap-3 mt-5">
//         <button onClick={onClose} className="btn-secondary flex-1" disabled={saving}>Cancel</button>
//         <button onClick={handleAssign} className="btn-primary flex-1" disabled={saving || !selectedId}>
//           {saving ? 'Assigning…' : 'Assign Room'}
//         </button>
//       </div>
//     </Modal>
//   )
// }

// // ── Main Page ─────────────────────────────────────────────────
// export default function Residents() {
//   const { canWrite }               = useAuth()
//   const { toasts, removeToast, toast } = useToast()

//   const [residents,  setResidents]  = useState([])
//   const [loading,    setLoading]    = useState(true)
//   const [pagination, setPagination] = useState({ page: 1, per_page: 12, total: 0, total_pages: 1 })
//   const [search,     setSearch]     = useState('')
//   const [filters,    setFilters]    = useState({ search: '', is_active: '' })

//   // Modals
//   const [showForm,    setShowForm]    = useState(false)
//   const [editResident, setEditResident] = useState(null)
//   const [form,        setForm]        = useState(EMPTY_FORM)
//   const [formError,   setFormError]   = useState({})
//   const [saving,      setSaving]      = useState(false)

//   const [deleteId,    setDeleteId]    = useState(null)
//   const [deleting,    setDeleting]    = useState(false)

//   const [assignTarget, setAssignTarget] = useState(null)
//   const [checkoutId,   setCheckoutId]  = useState(null)
//   const [checkingOut,  setCheckingOut] = useState(false)

//   // ── Fetch ──────────────────────────────────────────────────
//   const fetchResidents = useCallback(async (page = 1) => {
//     setLoading(true)
//     try {
//       const params = { page, per_page: pagination.per_page }
//       if (filters.search)    params.search    = filters.search
//       if (filters.is_active !== '') params.is_active = filters.is_active
//       const res = await residentsAPI.getAll(params)
//       setResidents(res.data.data)
//       setPagination(res.data.pagination)
//     } catch {
//       toast.error('Failed to load residents')
//     } finally {
//       setLoading(false)
//     }
//   }, [filters, pagination.per_page])

//   useEffect(() => { fetchResidents(1) }, [filters])

//   useEffect(() => {
//     const t = setTimeout(() => setFilters((f) => ({ ...f, search })), 400)
//     return () => clearTimeout(t)
//   }, [search])

//   // ── Form ───────────────────────────────────────────────────
//   const openCreate = () => {
//     setEditResident(null)
//     setForm(EMPTY_FORM)
//     setFormError({})
//     setShowForm(true)
//   }

//   const openEdit = (r) => {
//     setEditResident(r)
//     setForm({
//       name:                    r.name,
//       email:                   r.email,
//       phone:                   r.phone,
//       national_id:             r.national_id,
//       emergency_contact_name:  r.emergency_contact_name  || '',
//       emergency_contact_phone: r.emergency_contact_phone || '',
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
//     if (!form.name.trim())        e.name        = 'Name is required'
//     if (!form.email.trim())       e.email       = 'Email is required'
//     if (!form.phone.trim())       e.phone       = 'Phone is required'
//     if (!form.national_id.trim()) e.national_id = 'National ID is required'
//     return e
//   }

//   const handleSave = async () => {
//     const errors = validateForm()
//     if (Object.keys(errors).length) { setFormError(errors); return }

//     setSaving(true)
//     try {
//       if (editResident) {
//         await residentsAPI.update(editResident.id, form)
//         toast.success(`${form.name} updated`)
//       } else {
//         await residentsAPI.create(form)
//         toast.success(`${form.name} added`)
//       }
//       setShowForm(false)
//       fetchResidents(pagination.page)
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to save resident')
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleDelete = async () => {
//     setDeleting(true)
//     try {
//       await residentsAPI.delete(deleteId)
//       toast.success('Resident deleted')
//       setDeleteId(null)
//       fetchResidents(pagination.page)
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to delete resident')
//     } finally {
//       setDeleting(false)
//     }
//   }

//   const handleCheckout = async () => {
//     setCheckingOut(true)
//     try {
//       await residentsAPI.checkout(checkoutId)
//       toast.success('Resident checked out')
//       setCheckoutId(null)
//       fetchResidents(pagination.page)
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to checkout')
//     } finally {
//       setCheckingOut(false)
//     }
//   }

//   return (
//     <>
//       <div className="p-6 animate-fade-in">
//         <div className="page-header">
//           <div>
//             <h1 className="page-title">Residents</h1>
//             <p className="page-subtitle">{pagination.total} residents total</p>
//           </div>
//           <RoleGuard roles={['admin', 'manager']}>
//             <button onClick={openCreate} className="btn-primary">
//               <Plus size={15} /> Add Resident
//             </button>
//           </RoleGuard>
//         </div>

//         {/* Search + filter */}
//         <div className="flex flex-wrap items-center gap-3 mb-5">
//           <div className="relative flex-1 min-w-[200px] max-w-sm">
//             <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
//             <input
//               className="input pl-9"
//               placeholder="Search name, email, phone…"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             {search && (
//               <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
//                 <X size={14} />
//               </button>
//             )}
//           </div>

//           <select
//             className="input w-40"
//             value={filters.is_active}
//             onChange={(e) => setFilters((f) => ({ ...f, is_active: e.target.value }))}
//           >
//             <option value="">All residents</option>
//             <option value="1">Active only</option>
//             <option value="0">Inactive only</option>
//           </select>

//           <button onClick={() => fetchResidents(pagination.page)} className="btn-ghost" title="Refresh">
//             <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
//           </button>
//         </div>

//         {/* Table */}
//         {loading ? (
//           <div className="table-wrapper">
//             <div className="animate-pulse p-6 space-y-3">
//               {[...Array(7)].map((_, i) => (
//                 <div key={i} className="flex gap-4">
//                   {[...Array(7)].map((_, j) => <div key={j} className="skeleton h-5 flex-1 rounded" />)}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : residents.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-state-icon"><Users size={24} /></div>
//             <p className="text-surface-500 font-body text-sm mb-3">No residents found</p>
//             {canWrite && <button onClick={openCreate} className="btn-primary btn-sm">Add first resident</button>}
//           </div>
//         ) : (
//           <div className="table-wrapper">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Contact</th>
//                   <th>National ID</th>
//                   <th>Room</th>
//                   <th>Check-in</th>
//                   <th>Status</th>
//                   {canWrite && <th className="text-right">Actions</th>}
//                 </tr>
//               </thead>
//               <tbody>
//                 {residents.map((r) => (
//                   <tr key={r.id}>
//                     <td>
//                       <div className="flex items-center gap-2.5">
//                         <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
//                           <span className="text-xs font-bold text-brand-700 font-display">
//                             {r.name.charAt(0).toUpperCase()}
//                           </span>
//                         </div>
//                         <div>
//                           <p className="font-semibold text-surface-800 text-sm leading-tight">{r.name}</p>
//                           <p className="text-xs text-surface-400 font-body">{r.email}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="text-surface-600 font-body text-sm">{r.phone}</td>
//                     <td>
//                       <span className="font-mono text-xs text-surface-500 bg-surface-100 px-2 py-0.5 rounded">
//                         {r.national_id}
//                       </span>
//                     </td>
//                     <td>
//                       {r.room_number ? (
//                         <span className="chip font-mono">{r.room_number}</span>
//                       ) : (
//                         <span className="text-surface-300 text-sm font-body">—</span>
//                       )}
//                     </td>
//                     <td className="text-surface-500 text-sm font-body">
//                       {r.check_in
//                         ? new Date(r.check_in).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
//                         : '—'}
//                     </td>
//                     <td>
//                       <span className={r.is_active ? 'badge-active' : 'badge-inactive'}>
//                         <span className={`w-1.5 h-1.5 rounded-full ${r.is_active ? 'bg-emerald-500' : 'bg-surface-300'}`} />
//                         {r.is_active ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     {canWrite && (
//                       <td className="text-right">
//                         <div className="flex items-center justify-end gap-1">
//                           {r.is_active && !r.room_id && (
//                             <button
//                               onClick={() => setAssignTarget(r)}
//                               className="btn-ghost btn-sm p-2 text-surface-500 hover:text-brand-600"
//                               title="Assign Room"
//                             >
//                               <DoorOpen size={14} />
//                             </button>
//                           )}
//                           {r.is_active && r.room_id && (
//                             <button
//                               onClick={() => setCheckoutId(r.id)}
//                               className="btn-ghost btn-sm p-2 text-surface-500 hover:text-amber-600"
//                               title="Check Out"
//                             >
//                               <CheckOut size={14} />
//                             </button>
//                           )}
//                           <button
//                             onClick={() => openEdit(r)}
//                             className="btn-ghost btn-sm p-2 text-surface-500 hover:text-brand-600"
//                             title="Edit"
//                           >
//                             <Edit2 size={14} />
//                           </button>
//                           {!r.room_id && (
//                             <button
//                               onClick={() => setDeleteId(r.id)}
//                               className="btn-ghost btn-sm p-2 text-surface-500 hover:text-red-600"
//                               title="Delete"
//                             >
//                               <Trash2 size={14} />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Pagination */}
//         {pagination.total_pages > 1 && (
//           <div className="flex items-center justify-between mt-4">
//             <p className="text-xs text-surface-400 font-body">
//               Showing {(pagination.page - 1) * pagination.per_page + 1}–
//               {Math.min(pagination.page * pagination.per_page, pagination.total)} of {pagination.total}
//             </p>
//             <Pagination
//               page={pagination.page}
//               totalPages={pagination.total_pages}
//               onPageChange={(p) => fetchResidents(p)}
//             />
//           </div>
//         )}
//       </div>

//       {/* ── Modals ─────────────────────────────────────────── */}
//       <Modal
//         open={showForm}
//         onClose={() => setShowForm(false)}
//         title={editResident ? `Edit — ${editResident.name}` : 'Add New Resident'}
//       >
//         <ResidentForm form={form} onChange={handleFormChange} error={formError} />
//         <div className="flex gap-3 mt-6">
//           <button onClick={() => setShowForm(false)} className="btn-secondary flex-1" disabled={saving}>Cancel</button>
//           <button onClick={handleSave} className="btn-primary flex-1" disabled={saving}>
//             {saving ? 'Saving…' : editResident ? 'Save Changes' : 'Add Resident'}
//           </button>
//         </div>
//       </Modal>

//       <AssignRoomModal
//         open={!!assignTarget}
//         onClose={() => setAssignTarget(null)}
//         resident={assignTarget}
//         onAssigned={() => fetchResidents(pagination.page)}
//         toast={toast}
//       />

//       <ConfirmDialog
//         open={!!checkoutId}
//         onClose={() => setCheckoutId(null)}
//         onConfirm={handleCheckout}
//         loading={checkingOut}
//         title="Confirm Checkout"
//         message="This resident will be checked out and their room will become available."
//       />

//       <ConfirmDialog
//         open={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         loading={deleting}
//         title="Delete Resident"
//         message="This resident record will be permanently deleted."
//       />

//       <Toast toasts={toasts} removeToast={removeToast} />
//     </>
//   )
// }







import { useEffect, useState } from 'react'
import {
    getResidents, createResident, updateResident,
    deleteResident, assignRoom, checkoutResident
} from '../api/residentsAPI'
import { getAvailableRooms } from '../api/roomsAPI'
import { useAuth } from '../context/AuthContext'

const EMPTY_FORM = {
    name: '', email: '', phone: '', national_id: '',
    emergency_contact_name: '', emergency_contact_phone: ''
}

export default function Residents() {
    const { isManager }                  = useAuth()
    const [residents,   setResidents]    = useState([])
    const [pagination,  setPagination]   = useState({})
    const [loading,     setLoading]      = useState(true)
    const [showModal,   setShowModal]    = useState(false)
    const [showAssign,  setShowAssign]   = useState(false)
    const [editResident,setEditResident] = useState(null)
    const [selectedRes, setSelectedRes]  = useState(null)
    const [availRooms,  setAvailRooms]   = useState([])
    const [selectedRoom,setSelectedRoom] = useState('')
    const [form,        setForm]         = useState(EMPTY_FORM)
    const [error,       setError]        = useState('')
    const [saving,      setSaving]       = useState(false)
    const [search,      setSearch]       = useState('')
    const [activeFilter,setActiveFilter] = useState('')
    const [page,        setPage]         = useState(1)

    useEffect(() => { fetchResidents() }, [page, search, activeFilter])

    const fetchResidents = async () => {
        setLoading(true)
        try {
            const res = await getResidents({
                page, per_page: 10,
                search,
                is_active: activeFilter
            })
            setResidents(res.data)
            setPagination(res.pagination)
        } catch { setError('Failed to load residents') }
        finally  { setLoading(false) }
    }

    const openCreate = () => {
        setEditResident(null)
        setForm(EMPTY_FORM)
        setError('')
        setShowModal(true)
    }

    const openEdit = (r) => {
        setEditResident(r)
        setForm({
            name: r.name, email: r.email, phone: r.phone,
            national_id: r.national_id,
            emergency_contact_name:  r.emergency_contact_name  || '',
            emergency_contact_phone: r.emergency_contact_phone || ''
        })
        setError('')
        setShowModal(true)
    }

    const openAssign = async (r) => {
        setSelectedRes(r)
        setSelectedRoom('')
        const rooms = await getAvailableRooms()
        setAvailRooms(rooms)
        setShowAssign(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        try {
            if (editResident) {
                await updateResident(editResident.id, form)
            } else {
                await createResident(form)
            }
            setShowModal(false)
            fetchResidents()
        } catch (err) {
            setError(err.response?.data?.message || 'Save failed')
        } finally { setSaving(false) }
    }

    const handleAssign = async () => {
        if (!selectedRoom) return
        try {
            await assignRoom(selectedRes.id, parseInt(selectedRoom))
            setShowAssign(false)
            fetchResidents()
        } catch (err) {
            alert(err.response?.data?.message || 'Assign failed')
        }
    }

    const handleCheckout = async (id) => {
        if (!window.confirm('Checkout this resident?')) return
        try {
            await checkoutResident(id)
            fetchResidents()
        } catch (err) {
            alert(err.response?.data?.message || 'Checkout failed')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this resident?')) return
        try {
            await deleteResident(id)
            fetchResidents()
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed')
        }
    }

    return (
        <div className="page fade-in">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="section-title mb-0">Residents</h1>
                {isManager() && (
                    <button onClick={openCreate} className="btn-primary">
                        + Add Resident
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-6 flex-wrap">
                <input
                    className="input max-w-xs"
                    placeholder="Search name, email, phone..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                />
                <select
                    className="select max-w-[160px]"
                    value={activeFilter}
                    onChange={e => { setActiveFilter(e.target.value); setPage(1) }}
                >
                    <option value="">All</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
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
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Room</th>
                                    <th>Status</th>
                                    <th>Check In</th>
                                    {isManager() && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {residents.length === 0 ? (
                                    <tr>
                                        <td colSpan="7">
                                            <div className="empty-state">
                                                No residents found
                                            </div>
                                        </td>
                                    </tr>
                                ) : residents.map(r => (
                                    <tr key={r.id}>
                                        <td className="font-semibold text-white">
                                            {r.name}
                                        </td>
                                        <td className="text-xs">{r.email}</td>
                                        <td className="text-xs">{r.phone}</td>
                                        <td>
                                            {r.room_number
                                                ? <span className="badge-blue">
                                                    {r.room_number}
                                                  </span>
                                                : <span className="text-gray-600">
                                                    Unassigned
                                                  </span>
                                            }
                                        </td>
                                        <td>
                                            {r.is_active
                                                ? <span className="badge-green">Active</span>
                                                : <span className="badge-gray">Inactive</span>
                                            }
                                        </td>
                                        <td className="text-xs text-gray-500">
                                            {r.check_in
                                                ? new Date(r.check_in)
                                                    .toLocaleDateString()
                                                : '—'}
                                        </td>
                                        {isManager() && (
                                            <td>
                                                <div className="flex gap-1 flex-wrap">
                                                    <button
                                                        onClick={() => openEdit(r)}
                                                        className="btn-secondary
                                                                   text-xs px-2 py-1"
                                                    >
                                                        Edit
                                                    </button>
                                                    {!r.room_id && r.is_active && (
                                                        <button
                                                            onClick={() => openAssign(r)}
                                                            className="btn-primary
                                                                       text-xs px-2 py-1"
                                                        >
                                                            Assign
                                                        </button>
                                                    )}
                                                    {r.room_id && (
                                                        <button
                                                            onClick={() =>
                                                                handleCheckout(r.id)}
                                                            className="bg-yellow-600
                                                                       hover:bg-yellow-700
                                                                       text-white text-xs
                                                                       px-2 py-1 rounded-lg"
                                                        >
                                                            Checkout
                                                        </button>
                                                    )}
                                                    {!r.room_id && (
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(r.id)}
                                                            className="btn-danger
                                                                       text-xs px-2 py-1"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
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
                                {pagination.total} total residents
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

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2 className="modal-title">
                            {editResident ? 'Edit Resident' : 'Add Resident'}
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
                                    <label className="label">Full Name</label>
                                    <input className="input"
                                        value={form.name}
                                        onChange={e => setForm({
                                            ...form, name: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Email</label>
                                    <input className="input" type="email"
                                        value={form.email}
                                        onChange={e => setForm({
                                            ...form, email: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Phone</label>
                                    <input className="input"
                                        value={form.phone}
                                        onChange={e => setForm({
                                            ...form, phone: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">National ID</label>
                                    <input className="input"
                                        value={form.national_id}
                                        onChange={e => setForm({
                                            ...form, national_id: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">
                                        Emergency Contact Name
                                    </label>
                                    <input className="input"
                                        value={form.emergency_contact_name}
                                        onChange={e => setForm({
                                            ...form,
                                            emergency_contact_name: e.target.value
                                        })}
                                    />
                                </div>
                                <div>
                                    <label className="label">
                                        Emergency Contact Phone
                                    </label>
                                    <input className="input"
                                        value={form.emergency_contact_phone}
                                        onChange={e => setForm({
                                            ...form,
                                            emergency_contact_phone: e.target.value
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving}
                                    className="btn-primary flex-1">
                                    {saving ? 'Saving...' : 'Save'}
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

            {/* Assign Room Modal */}
            {showAssign && (
                <div className="modal-overlay" onClick={() => setShowAssign(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2 className="modal-title">
                            Assign Room to {selectedRes?.name}
                        </h2>
                        <div className="mb-4">
                            <label className="label">Select Available Room</label>
                            <select className="select"
                                value={selectedRoom}
                                onChange={e => setSelectedRoom(e.target.value)}
                            >
                                <option value="">Choose a room...</option>
                                {availRooms.map(room => (
                                    <option key={room.id} value={room.id}>
                                        Room {room.room_number} — Floor {room.floor} —
                                        {room.room_type} — ₹{room.monthly_rent}/mo
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={handleAssign}
                                disabled={!selectedRoom}
                                className="btn-primary flex-1">
                                Assign Room
                            </button>
                            <button onClick={() => setShowAssign(false)}
                                className="btn-secondary flex-1">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}