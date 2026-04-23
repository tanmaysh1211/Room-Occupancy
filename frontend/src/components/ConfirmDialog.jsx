// import { AlertTriangle } from 'lucide-react'
// import Modal from './Modal'

// export default function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
//   return (
//     <Modal open={open} onClose={onClose} title={title || 'Confirm Action'} size="sm">
//       <div className="flex flex-col items-center text-center gap-4">
//         <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
//           <AlertTriangle size={22} className="text-red-500" />
//         </div>
//         <p className="text-sm text-surface-600 font-body leading-relaxed">
//           {message || 'Are you sure? This action cannot be undone.'}
//         </p>
//         <div className="flex gap-3 w-full pt-1">
//           <button onClick={onClose} className="btn-secondary flex-1" disabled={loading}>
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="btn-danger flex-1"
//             disabled={loading}
//           >
//             {loading ? 'Deleting…' : 'Delete'}
//           </button>
//         </div>
//       </div>
//     </Modal>
//   )
// }