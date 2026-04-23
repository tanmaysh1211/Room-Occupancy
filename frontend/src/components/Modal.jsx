// import { useEffect } from 'react'
// import { X } from 'lucide-react'

// export default function Modal({ open, onClose, title, children, size = 'md' }) {
//   // Close on Escape key
//   useEffect(() => {
//     if (!open) return
//     const handler = (e) => { if (e.key === 'Escape') onClose() }
//     window.addEventListener('keydown', handler)
//     return () => window.removeEventListener('keydown', handler)
//   }, [open, onClose])

//   // Prevent body scroll while modal is open
//   useEffect(() => {
//     document.body.style.overflow = open ? 'hidden' : ''
//     return () => { document.body.style.overflow = '' }
//   }, [open])

//   if (!open) return null

//   const sizeClass = {
//     sm: 'max-w-sm',
//     md: 'max-w-lg',
//     lg: 'max-w-2xl',
//     xl: 'max-w-3xl',
//   }[size]

//   return (
//     <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
//       <div className={`modal-box w-full ${sizeClass}`}>
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
//           <h2 className="text-base font-bold font-display text-surface-900 tracking-tight">
//             {title}
//           </h2>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 flex items-center justify-center rounded-lg
//                        text-surface-400 hover:text-surface-700 hover:bg-surface-100
//                        transition-all duration-150"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-6 py-5">
//           {children}
//         </div>
//       </div>
//     </div>
//   )
// }