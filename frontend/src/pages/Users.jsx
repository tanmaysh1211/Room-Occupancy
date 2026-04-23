// import { useEffect, useState, useCallback } from 'react'
// import {
//   Plus, Search, Edit2, Trash2, UserCog, X,
//   ShieldCheck, Eye, EyeOff
// } from 'lucide-react'
// import { usersAPI }  from '../api/usersAPI'
// import Modal         from '../components/Modal'
// import ConfirmDialog from '../components/ConfirmDialog'
// import Pagination    from '../components/Pagination'
// import Toast         from '../components/Toast'
// import { useToast }  from '../components/useToast'
// import { useAuth }   from '../context/AuthContext'

// const ROLE_OPTS = ['admin', 'manager', 'staff']

// const EMPTY_FORM = { name: '', email: '', password: '', role: 'staff', is_active: true }

// function UserForm({ form, onChange, error, isEdit }) {
//   const [showPwd, setShowPwd] = useState(false)

//   return (
//     <div className="space-y-3">
//       <div>
//         <label className="label">Full Name</label>
//         <input
//           className={`input ${error?.name ? 'input-error' : ''}`}
//           placeholder="Tanmay Sharma"
//           value={form.name}
//           onChange={(e) => onChange('name', e.target.value)}
//         />
//         {error?.name && <p className="text-xs text-red-500 mt-1 font-body">{error.name}</p>}
//       </div>

//       <div>
//         <label className="label">Email</label>
//         <input
//           type="email"
//           className={`input ${error?.email ? 'input-error' : ''}`}
//           placeholder="user@roomoccupancy.com"
//           value={form.email}
//           onChange={(e) => onChange('email', e.target.value)}
//         />
//         {error?.email && <p className="text-xs text-red-500 mt-1 font-body">{error.email}</p>}
//       </div>

//       {!isEdit && (
//         <div>
//           <label className="label">Password</label>
//           <div className="relative">
//             <input
//               type={showPwd ? 'text' : 'password'}
//               className={`input pr-10 ${error?.password ? 'input-error' : ''}`}
//               placeholder="Min 6 characters"
//               value={form.password}
//               onChange={(e) => onChange('password', e.target.value)}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPwd(!showPwd)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
//             >
//               {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
//             </button>
//           </div>
//           {error?.password && <p className="text-xs text-red-500 mt-1 font-body">{error.password}</p>}
//         </div>
//       )}

//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <label className="label">Role</label>
//           <select
//             className="input"
//             value={form.role}
//             onChange={(e) => onChange('role', e.target.value)}
//           >
//             {ROLE_OPTS.map((r) => (
//               <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
//             ))}
//           </select>
//         </div>

//         {isEdit && (
//           <div>
//             <label className="label">Account Status</label>
//             <select
//               className="input"
//               value={form.is_active ? '1' : '0'}
//               onChange={(e) => onChange('is_active', e.target.value === '1')}
//             >
//               <option value="1">Active</option>
//               <option value="0">Deactivated</option>
//             </select>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default function Users() {
//   const { user: currentUser }          = useAuth()
//   const { toasts, removeToast, toast } = useToast()

//   const [users,      setUsers]      = useState([])
//   const [loading,    setLoading]    = useState(true)
//   const [pagination, setPagination] = useState({ page: 1, per_page: 10, total: 0, total_pages: 1 })
//   const [search,     setSearch]     = useState('')
//   const [roleFilter, setRoleFilter] = useState('')

//   const [showForm,  setShowForm]  = useState(false)
//   const [editUser,  setEditUser]  = useState(null)
//   const [form,      setForm]      = useState(EMPTY_FORM)
//   const [formError, setFormError] = useState({})
//   const [saving,    setSaving]    = useState(false)

//   const [deleteId,  setDeleteId]  = useState(null)
//   const [deleting,  setDeleting]  = useState(false)

//   const fetchUsers = useCallback(async (page = 1) => {
//     setLoading(true)
//     try {
//       const params = { page, per_page: pagination.per_page }
//       if (search)     params.search = search
//       if (roleFilter) params.role   = roleFilter
//       const res = await usersAPI.getAll(params)
//       setUsers(res.data.data)
//       setPagination(res.data.pagination)
//     } catch {
//       toast.error('Failed to load users')
//     } finally {
//       setLoading(false)
//     }
//   }, [search, roleFilter, pagination.per_page])

//   useEffect(() => { fetchUsers(1) }, [search, roleFilter])

//   const openCreate = () => {
//     setEditUser(null)
//     setForm(EMPTY_FORM)
//     setFormError({})
//     setShowForm(true)
//   }

//   const openEdit = (u) => {
//     setEditUser(u)
//     setForm({ name: u.name, email: u.email, password: '', role: u.role, is_active: u.is_active })
//     setFormError({})
//     setShowForm(true)
//   }

//   const handleFormChange = (key, val) => {
//     setForm((f) => ({ ...f, [key]: val }))
//     setFormError((e) => ({ ...e, [key]: undefined }))
//   }

//   const validateForm = () => {
//     const e = {}
//     if (!form.name.trim())   e.name  = 'Name is required'
//     if (!form.email.trim())  e.email = 'Email is required'
//     if (!editUser && !form.password) e.password = 'Password is required'
//     if (!editUser && form.password && form.password.length < 6)
//       e.password = 'Password must be at least 6 characters'
//     return e
//   }

//   const handleSave = async () => {
//     const errors = validateForm()
//     if (Object.keys(errors).length) { setFormError(errors); return }
//     setSaving(true)
//     try {
//       const payload = { name: form.name, email: form.email, role: form.role, is_active: form.is_active }
//       if (!editUser) payload.password = form.password
//       if (editUser) {
//         await usersAPI.update(editUser.id, payload)
//         toast.success(`${form.name} updated`)
//       } else {
//         await usersAPI.create(payload)
//         toast.success(`${form.name} created`)
//       }
//       setShowForm(false)
//       fetchUsers(pagination.page)
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to save user')
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleDelete = async () => {
//     setDeleting(true)
//     try {
//       await usersAPI.delete(deleteId)
//       toast.success('User deleted')
//       setDeleteId(null)
//       fetchUsers(pagination.page)
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to delete user')
//     } finally {
//       setDeleting(false)
//     }
//   }

//   const roleBadge = (role) => ({
//     admin:   'badge-admin',
//     manager: 'badge-manager',
//     staff:   'badge-staff',
//   }[role] || 'badge bg-surface-100 text-surface-500')

//   return (
//     <>
//       <div className="p-6 animate-fade-in">
//         <div className="page-header">
//           <div>
//             <h1 className="page-title">User Management</h1>
//             <p className="page-subtitle">Admin-only — manage system access</p>
//           </div>
//           <button onClick={openCreate} className="btn-primary">
//             <Plus size={15} /> Add User
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="flex flex-wrap items-center gap-3 mb-5">
//           <div className="relative flex-1 min-w-[200px] max-w-sm">
//             <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
//             <input
//               className="input pl-9"
//               placeholder="Search name or email…"
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
//             value={roleFilter}
//             onChange={(e) => setRoleFilter(e.target.value)}
//           >
//             <option value="">All roles</option>
//             {ROLE_OPTS.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
//           </select>
//         </div>

//         {/* Table */}
//         {loading ? (
//           <div className="table-wrapper">
//             <div className="animate-pulse p-6 space-y-3">
//               {[...Array(5)].map((_, i) => (
//                 <div key={i} className="flex gap-4">
//                   {[...Array(5)].map((_, j) => <div key={j} className="skeleton h-5 flex-1 rounded" />)}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : users.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-state-icon"><UserCog size={24} /></div>
//             <p className="text-surface-500 font-body text-sm mb-3">No users found</p>
//             <button onClick={openCreate} className="btn-primary btn-sm">Add first user</button>
//           </div>
//         ) : (
//           <div className="table-wrapper">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>User</th>
//                   <th>Role</th>
//                   <th>Status</th>
//                   <th>Created</th>
//                   <th className="text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((u) => (
//                   <tr key={u.id}>
//                     <td>
//                       <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center flex-shrink-0">
//                           <span className="text-white text-sm font-bold font-display">
//                             {u.name.charAt(0).toUpperCase()}
//                           </span>
//                         </div>
//                         <div>
//                           <div className="flex items-center gap-1.5">
//                             <p className="font-semibold text-surface-800 text-sm leading-tight">{u.name}</p>
//                             {u.id === currentUser?.id && (
//                               <span className="text-[10px] text-brand-600 font-medium font-body bg-brand-50 px-1.5 py-0 rounded-full">
//                                 you
//                               </span>
//                             )}
//                           </div>
//                           <p className="text-xs text-surface-400 font-body">{u.email}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <span className={roleBadge(u.role)}>
//                         <ShieldCheck size={11} />
//                         {u.role}
//                       </span>
//                     </td>
//                     <td>
//                       <span className={u.is_active ? 'badge-active' : 'badge-inactive'}>
//                         <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-surface-300'}`} />
//                         {u.is_active ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="text-surface-500 text-sm font-body">
//                       {new Date(u.created_at).toLocaleDateString('en-IN', {
//                         day: 'numeric', month: 'short', year: 'numeric'
//                       })}
//                     </td>
//                     <td className="text-right">
//                       <div className="flex items-center justify-end gap-1">
//                         <button
//                           onClick={() => openEdit(u)}
//                           className="btn-ghost btn-sm p-2 text-surface-500 hover:text-brand-600"
//                           title="Edit"
//                         >
//                           <Edit2 size={14} />
//                         </button>
//                         {u.id !== currentUser?.id && (
//                           <button
//                             onClick={() => setDeleteId(u.id)}
//                             className="btn-ghost btn-sm p-2 text-surface-500 hover:text-red-600"
//                             title="Delete"
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         )}
//                       </div>
//                     </td>
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
//               {pagination.total} users total
//             </p>
//             <Pagination
//               page={pagination.page}
//               totalPages={pagination.total_pages}
//               onPageChange={(p) => fetchUsers(p)}
//             />
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       <Modal
//         open={showForm}
//         onClose={() => setShowForm(false)}
//         title={editUser ? `Edit — ${editUser.name}` : 'Add New User'}
//       >
//         <UserForm form={form} onChange={handleFormChange} error={formError} isEdit={!!editUser} />
//         <div className="flex gap-3 mt-6">
//           <button onClick={() => setShowForm(false)} className="btn-secondary flex-1" disabled={saving}>Cancel</button>
//           <button onClick={handleSave} className="btn-primary flex-1" disabled={saving}>
//             {saving ? 'Saving…' : editUser ? 'Save Changes' : 'Create User'}
//           </button>
//         </div>
//       </Modal>

//       <ConfirmDialog
//         open={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         loading={deleting}
//         title="Delete User"
//         message="This user account will be permanently deleted. They will no longer be able to log in."
//       />

//       <Toast toasts={toasts} removeToast={removeToast} />
//     </>
//   )
// }











import { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext'

const EMPTY_FORM = {
    name: '', email: '', password: '', role: 'staff'
}

const roleBadge = (role) => {
    if (role === 'admin')   return <span className="badge-purple">Admin</span>
    if (role === 'manager') return <span className="badge-blue">Manager</span>
    return <span className="badge-gray">Staff</span>
}

export default function Users() {
    const { isAdmin }               = useAuth()
    const [users,     setUsers]     = useState([])
    const [pagination,setPagination]= useState({})
    const [loading,   setLoading]   = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editUser,  setEditUser]  = useState(null)
    const [form,      setForm]      = useState(EMPTY_FORM)
    const [error,     setError]     = useState('')
    const [saving,    setSaving]    = useState(false)
    const [search,    setSearch]    = useState('')
    const [page,      setPage]      = useState(1)

    useEffect(() => { fetchUsers() }, [page, search])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page, per_page: 10, search
            })
            const res = await axiosInstance.get(`/users/?${params}`)
            setUsers(res.data.data)
            setPagination(res.data.pagination)
        } catch { setError('Failed to load users') }
        finally  { setLoading(false) }
    }

    const openCreate = () => {
        setEditUser(null)
        setForm(EMPTY_FORM)
        setError('')
        setShowModal(true)
    }

    const openEdit = (u) => {
        setEditUser(u)
        setForm({
            name: u.name, email: u.email,
            password: '', role: u.role
        })
        setError('')
        setShowModal(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        try {
            const payload = { ...form }
            if (editUser && !payload.password) delete payload.password
            if (editUser) {
                await axiosInstance.put(`/users/${editUser.id}`, payload)
            } else {
                await axiosInstance.post('/users/', payload)
            }
            setShowModal(false)
            fetchUsers()
        } catch (err) {
            setError(err.response?.data?.message || 'Save failed')
        } finally { setSaving(false) }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user?')) return
        try {
            await axiosInstance.delete(`/users/${id}`)
            fetchUsers()
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed')
        }
    }

    const handleToggleActive = async (user) => {
        try {
            await axiosInstance.put(`/users/${user.id}`, {
                is_active: !user.is_active
            })
            fetchUsers()
        } catch (err) {
            alert('Failed to update status')
        }
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
            <div className="flex items-center justify-between mb-6">
                <h1 className="section-title mb-0">Users</h1>
                <button onClick={openCreate} className="btn-primary">
                    + Add User
                </button>
            </div>

            <div className="flex gap-3 mb-6">
                <input className="input max-w-xs"
                    placeholder="Search name or email..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                />
            </div>

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
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td className="font-semibold text-white">
                                            {u.name}
                                        </td>
                                        <td className="text-xs">{u.email}</td>
                                        <td>{roleBadge(u.role)}</td>
                                        <td>
                                            <button
                                                onClick={() => handleToggleActive(u)}
                                                className={u.is_active
                                                    ? 'badge-green cursor-pointer'
                                                    : 'badge-red cursor-pointer'}
                                            >
                                                {u.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="text-xs text-gray-500">
                                            {new Date(u.created_at)
                                                .toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEdit(u)}
                                                    className="btn-secondary
                                                               text-xs px-3 py-1.5"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(u.id)}
                                                    className="btn-danger
                                                               text-xs px-3 py-1.5"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pagination.total_pages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-xs text-gray-500">
                                {pagination.total} total users
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

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2 className="modal-title">
                            {editUser ? 'Edit User' : 'Add New User'}
                        </h2>
                        {error && (
                            <div className="bg-red-900/30 border border-red-800
                                            text-red-400 rounded-xl px-4 py-3
                                            text-sm mb-4">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSave} className="space-y-4">
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
                            <div>
                                <label className="label">
                                    Password
                                    {editUser && ' (leave blank to keep current)'}
                                </label>
                                <input className="input" type="password"
                                    value={form.password}
                                    onChange={e => setForm({
                                        ...form, password: e.target.value
                                    })}
                                    required={!editUser}
                                />
                            </div>
                            <div>
                                <label className="label">Role</label>
                                <select className="select"
                                    value={form.role}
                                    onChange={e => setForm({
                                        ...form, role: e.target.value
                                    })}
                                >
                                    <option value="staff">Staff</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving}
                                    className="btn-primary flex-1">
                                    {saving ? 'Saving...' : 'Save User'}
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