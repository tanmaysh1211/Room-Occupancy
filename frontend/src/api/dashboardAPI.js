// import axiosInstance from './axiosInstance'

// export const dashboardAPI = {
//   get: () => axiosInstance.get('/dashboard/'),
// }



import axiosInstance from './axiosInstance'

// ─── Get full dashboard stats ──────────────────────────────────
export const getDashboard = async () => {
    const res = await axiosInstance.get('/dashboard/')
    return res.data.data
}

/*
Returns:
{
  rooms: {
    total, available, occupied, maintenance, occupancy_rate
  },
  residents: {
    total, active
  },
  revenue: {
    monthly_total
  },
  room_type_breakdown: [
    { type, total, occupied }
  ],
  floor_stats: [
    { floor, total_rooms, occupied_rooms }
  ],
  recent_activity: [
    { id, user_email, action, entity_type, description, timestamp }
  ],
  total_users
}
*/