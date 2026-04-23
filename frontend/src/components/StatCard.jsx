// export default function StatCard({ title, value, subtitle, icon: Icon, accent = 'brand', trend }) {
//   const accentMap = {
//     brand:       'stat-card-brand',
//     available:   'stat-card-available',
//     occupied:    'stat-card-occupied',
//     maintenance: 'stat-card-maintenance',
//   }

//   const iconBg = {
//     brand:       'bg-brand-50 text-brand-600',
//     available:   'bg-emerald-50 text-emerald-600',
//     occupied:    'bg-blue-50 text-blue-600',
//     maintenance: 'bg-amber-50 text-amber-600',
//   }

//   return (
//     <div className={`card p-5 animate-slide-up ${accentMap[accent]}`}>
//       <div className="flex items-start justify-between gap-3">
//         <div className="flex-1 min-w-0">
//           <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider font-body mb-2">
//             {title}
//           </p>
//           <p className="text-3xl font-bold font-display text-surface-900 leading-none mb-1">
//             {value ?? '—'}
//           </p>
//           {subtitle && (
//             <p className="text-xs text-surface-500 font-body mt-1">{subtitle}</p>
//           )}
//           {trend !== undefined && (
//             <p className={`text-xs font-medium font-body mt-1 ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
//               {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% vs last month
//             </p>
//           )}
//         </div>
//         {Icon && (
//           <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg[accent]}`}>
//             <Icon size={20} />
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }











export default function StatCard({
    label,
    value,
    color   = '#FF3CAC',
    icon    = null,
    subtitle = null
}) {
    return (
        <div className="stat-card fade-in">
            <div className="flex items-start justify-between mb-2">
                {icon && (
                    <div className="text-2xl opacity-80">{icon}</div>
                )}
            </div>
            <div
                className="text-3xl font-['Syne'] font-extrabold mb-1"
                style={{ color }}
            >
                {value}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
                {label}
            </div>
            {subtitle && (
                <div className="text-xs text-gray-600 mt-1">
                    {subtitle}
                </div>
            )}
        </div>
    )
}