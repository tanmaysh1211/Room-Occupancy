// import axiosInstance from './axiosInstance'

// export const roomsAPI = {
//   getAll:       (params) => axiosInstance.get('/rooms/', { params }),
//   getById:      (id)     => axiosInstance.get(`/rooms/${id}`),
//   create:       (data)   => axiosInstance.post('/rooms/', data),
//   update:       (id, data) => axiosInstance.put(`/rooms/${id}`, data),
//   delete:       (id)     => axiosInstance.delete(`/rooms/${id}`),
//   updateStatus: (id, status) => axiosInstance.patch(`/rooms/${id}/status`, { status }),
// }


import axiosInstance from './axiosInstance'

// ─── Get all rooms (paginated + filters) ──────────────────────
export const getRooms = async ({
    page     = 1,
    per_page = 10,
    status   = '',
    floor    = '',
    search   = ''
} = {}) => {
    const params = new URLSearchParams()
    params.append('page',     page)
    params.append('per_page', per_page)
    if (status) params.append('status', status)
    if (floor)  params.append('floor',  floor)
    if (search) params.append('search', search)

    const res = await axiosInstance.get(`/rooms/?${params.toString()}`)
    return res.data  // { success, data, pagination }
}

// ─── Get single room ───────────────────────────────────────────
export const getRoomById = async (roomId) => {
    const res = await axiosInstance.get(`/rooms/${roomId}`)
    return res.data.data
}

// ─── Create room ───────────────────────────────────────────────
export const createRoom = async (roomData) => {
    const res = await axiosInstance.post('/rooms/', roomData)
    return res.data.data
}

// ─── Update room ───────────────────────────────────────────────
export const updateRoom = async (roomId, roomData) => {
    const res = await axiosInstance.put(`/rooms/${roomId}`, roomData)
    return res.data.data
}

// ─── Delete room ───────────────────────────────────────────────
export const deleteRoom = async (roomId) => {
    const res = await axiosInstance.delete(`/rooms/${roomId}`)
    return res.data
}

// ─── Update room status only ───────────────────────────────────
export const updateRoomStatus = async (roomId, status) => {
    const res = await axiosInstance.patch(
        `/rooms/${roomId}/status`,
        { status }
    )
    return res.data.data
}

// ─── Get available rooms (for assign dropdown) ─────────────────
export const getAvailableRooms = async () => {
    const res = await axiosInstance.get('/rooms/?status=available&per_page=200')
    return res.data.data  // array of available rooms
}