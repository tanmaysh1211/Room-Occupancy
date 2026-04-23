// import { ChevronLeft, ChevronRight } from 'lucide-react'

// export default function Pagination({ page, totalPages, onPageChange }) {
//   if (totalPages <= 1) return null

//   const pages = []
//   const delta = 1

//   // Build page window: always show first, last, and pages near current
//   for (let i = 1; i <= totalPages; i++) {
//     if (
//       i === 1 ||
//       i === totalPages ||
//       (i >= page - delta && i <= page + delta)
//     ) {
//       pages.push(i)
//     }
//   }

//   // Deduplicate and insert '...' gaps
//   const display = []
//   let prev = null
//   for (const p of pages) {
//     if (prev && p - prev > 1) display.push('...')
//     display.push(p)
//     prev = p
//   }

//   return (
//     <div className="flex items-center gap-1">
//       <button
//         className="pag-btn"
//         onClick={() => onPageChange(page - 1)}
//         disabled={page === 1}
//       >
//         <ChevronLeft size={15} />
//       </button>

//       {display.map((item, i) =>
//         item === '...' ? (
//           <span key={`gap-${i}`} className="pag-btn text-surface-400 cursor-default">
//             ···
//           </span>
//         ) : (
//           <button
//             key={item}
//             className={`pag-btn ${item === page ? 'active' : ''}`}
//             onClick={() => onPageChange(item)}
//           >
//             {item}
//           </button>
//         )
//       )}

//       <button
//         className="pag-btn"
//         onClick={() => onPageChange(page + 1)}
//         disabled={page === totalPages}
//       >
//         <ChevronRight size={15} />
//       </button>
//     </div>
//   )
// }