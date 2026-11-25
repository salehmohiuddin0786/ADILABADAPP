import React from 'react';

export function SkeletonBox({ className = '', height = 'h-4', width = 'w-full', rounded = 'rounded-lg' }) {
  return (
    <div
      className={`bg-slate-200/80 animate-pulse ${height} ${width} ${rounded} ${className}`}
    />
  );
}

export function CardSkeleton({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3 animate-pulse"
        >
          <div className="w-full h-44 bg-slate-200 rounded-xl" />
          <div className="space-y-2">
            <div className="h-5 bg-slate-200 rounded-md w-3/4" />
            <div className="h-4 bg-slate-100 rounded-md w-1/2" />
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="h-4 bg-slate-200 rounded-md w-24" />
            <div className="h-8 bg-slate-200 rounded-lg w-20" />
          </div>
        </div>
      ))}
    </>
  );
}

export function TableRowSkeleton({ rows = 5, cols = 4 }) {
  return (
    <tbody className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="animate-pulse">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx} className="px-6 py-4">
              <div
                className={`h-4 bg-slate-200 rounded ${
                  cIdx === 0 ? 'w-36' : cIdx === cols - 1 ? 'w-16 ml-auto' : 'w-24'
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export function StatSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs animate-pulse space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-200 rounded w-24" />
            <div className="w-10 h-10 bg-slate-200 rounded-xl" />
          </div>
          <div className="h-8 bg-slate-300 rounded w-20" />
          <div className="h-3 bg-slate-100 rounded w-32" />
        </div>
      ))}
    </div>
  );
}

export default {
  SkeletonBox,
  CardSkeleton,
  TableRowSkeleton,
  StatSkeleton
};
