// import { useEffect } from 'react'
// import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

// const ICONS = {
//   success: <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />,
//   error:   <XCircle     size={16} className="text-red-500 flex-shrink-0" />,
//   info:    <Info        size={16} className="text-blue-500 flex-shrink-0" />,
// }

// export default function Toast({ toasts, removeToast }) {
//   return (
//     <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
//       {toasts.map((t) => (
//         <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
//       ))}
//     </div>
//   )
// }

// function ToastItem({ toast, onRemove }) {
//   useEffect(() => {
//     const timer = setTimeout(onRemove, toast.duration || 3500)
//     return () => clearTimeout(timer)
//   }, [onRemove, toast.duration])

//   const styles = {
//     success: 'bg-white border-emerald-200',
//     error:   'bg-white border-red-200',
//     info:    'bg-white border-blue-200',
//   }

//   return (
//     <div
//       className={`
//         pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border
//         shadow-card animate-slide-up
//         ${styles[toast.type || 'info']}
//       `}
//     >
//       {ICONS[toast.type || 'info']}
//       <p className="text-sm text-surface-700 font-body flex-1 leading-snug">{toast.message}</p>
//       <button
//         onClick={onRemove}
//         className="text-surface-300 hover:text-surface-500 transition-colors flex-shrink-0"
//       >
//         <X size={14} />
//       </button>
//     </div>
//   )
// }