// export default function HeatmapGrid({ data = [] }) {
//   // data: [{ date: "YYYY-MM-DD", count: number }]
//   const map = new Map(data.map((d) => [d.date, d.count]));

//   const getIntensityClass = (count) => {
//     if (!count || count === 0) return "bg-white/5";
//     if (count <= 2) return "bg-white/20";
//     if (count <= 5) return "bg-white/40";
//     if (count <= 10) return "bg-white/60";
//     return "bg-white/80";
//   };

//   return (
//     <div className="flex flex-wrap gap-1">
//       {data.length === 0 ? (
//         <p className="text-sm text-white/60">No activity yet</p>
//       ) : (
//         data.map((d) => (
//           <div
//             key={d.date}
//             title={`${d.date} • ${map.get(d.date) || 0} activity`}
//             className={`h-4 w-4 rounded-sm border border-white/10 ${getIntensityClass(
//               d.count
//             )}`}
//           />
//         ))
//       )}
//     </div>
//   );
// }


import { useState } from "react";

export default function HeatmapGrid({ data = [] }) {
  const [hovered, setHovered] = useState(null);

  const getIntensityClass = (count) => {
    if (!count || count === 0) return "bg-white/5";
    if (count <= 2) return "bg-white/20";
    if (count <= 5) return "bg-white/40";
    if (count <= 10) return "bg-white/60";
    return "bg-white/80";
  };

  return (
    <div className="relative">
      {/* Tooltip */}
      {hovered && (
        <div className="absolute -top-10 left-0 rounded-lg border theme-border theme-card px-3 py-2 text-xs">
          <span className="opacity-80">{hovered.date}</span>{" "}
          <span className="opacity-60">•</span>{" "}
          <span className="font-semibold">{hovered.count}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-1 max-w-[280px]">
        {data.length === 0 ? (
          <p className="text-sm opacity-70">No activity yet</p>
        ) : (
          data.map((d) => (
            <div
              key={d.date}
              onMouseEnter={() => setHovered(d)}
              onMouseLeave={() => setHovered(null)}
              className={`h-4 w-4 rounded-sm border theme-border ${getIntensityClass(
                d.count
              )}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
