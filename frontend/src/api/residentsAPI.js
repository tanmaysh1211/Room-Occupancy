// import axiosInstance from './axiosInstance'

// export const residentsAPI = {
//   getAll:    (params)      => axiosInstance.get('/residents/', { params }),
//   getById:   (id)          => axiosInstance.get(`/residents/${id}`),
//   create:    (data)        => axiosInstance.post('/residents/', data),
//   update:    (id, data)    => axiosInstance.put(`/residents/${id}`, data),
//   delete:    (id)          => axiosInstance.delete(`/residents/${id}`),
//   assignRoom:(id, room_id) => axiosInstance.patch(`/residents/${id}/assign-room`, { room_id }),
//   checkout:  (id)          => axiosInstance.patch(`/residents/${id}/checkout`),
// }


import axiosInstance from './axiosInstance'

// ─── Get all residents (paginated + filters) ───────────────────
export const getResidents = async ({
    page      = 1,
    per_page  = 10,
    is_active = '',
    room_id   = '',
    search    = ''
} = {}) => {
    const params = new URLSearchParams()
    params.append('page',     page)
    params.append('per_page', per_page)
    if (is_active !== '') params.append('is_active', is_active)
    if (room_id)          params.append('room_id',   room_id)
    if (search)           params.append('search',    search)

    const res = await axiosInstance.get(`/residents/?${params.toString()}`)
    return res.data  // { success, data, pagination }
}

// ─── Get single resident ───────────────────────────────────────
export const getResidentById = async (residentId) => {
    const res = await axiosInstance.get(`/residents/${residentId}`)
    return res.data.data
}

// ─── Create resident ───────────────────────────────────────────
export const createResident = async (residentData) => {
    const res = await axiosInstance.post('/residents/', residentData)
    return res.data.data
}

// ─── Update resident ───────────────────────────────────────────
export const updateResident = async (residentId, residentData) => {
    const res = await axiosInstance.put(`/residents/${residentId}`, residentData)
    return res.data.data
}

// ─── Delete resident ───────────────────────────────────────────
export const deleteResident = async (residentId) => {
    const res = await axiosInstance.delete(`/residents/${residentId}`)
    return res.data
}

// ─── Assign room to resident ───────────────────────────────────
export const assignRoom = async (residentId, roomId) => {
    const res = await axiosInstance.patch(
        `/residents/${residentId}/assign-room`,
        { room_id: roomId }
    )
    return res.data.data
}

// ─── Checkout resident from room ──────────────────────────────
export const checkoutResident = async (residentId) => {
    const res = await axiosInstance.patch(
        `/residents/${residentId}/checkout`
    )
    return res.data.data
}