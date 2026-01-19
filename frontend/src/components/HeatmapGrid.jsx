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


// import { useState } from "react";

// export default function HeatmapGrid({ data = [] }) {
//   const [hovered, setHovered] = useState(null);

//   const getIntensityClass = (count) => {
//     if (!count || count === 0) return "bg-white/5";
//     if (count <= 2) return "bg-white/20";
//     if (count <= 5) return "bg-white/40";
//     if (count <= 10) return "bg-white/60";
//     return "bg-white/80";
//   };

//   return (
//     <div className="relative">
//       {/* Tooltip */}
//       {hovered && (
//         <div className="absolute -top-10 left-0 rounded-lg border theme-border theme-card px-3 py-2 text-xs">
//           <span className="opacity-80">{hovered.date}</span>{" "}
//           <span className="opacity-60">•</span>{" "}
//           <span className="font-semibold">{hovered.count}</span>
//         </div>
//       )}

//       <div className="flex flex-wrap gap-1 max-w-[280px]">
//         {data.length === 0 ? (
//           <p className="text-sm opacity-70">No activity yet</p>
//         ) : (
//           data.map((d) => (
//             <div
//               key={d.date}
//               onMouseEnter={() => setHovered(d)}
//               onMouseLeave={() => setHovered(null)}
//               className={`h-4 w-4 rounded-sm border theme-border ${getIntensityClass(
//                 d.count
//               )}`}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// }


import { useMemo, useState } from "react";

function formatDateLabel(dateStr) {
  // dateStr: YYYY-MM-DD
  try {
    const d = new Date(dateStr);
    return d.toDateString(); // simple readable
  } catch {
    return dateStr;
  }
}

function getIntensityClass(count) {
  if (!count || count <= 0) return "bg-white/5";
  if (count <= 1) return "bg-white/15";
  if (count <= 3) return "bg-white/25";
  if (count <= 6) return "bg-white/40";
  if (count <= 10) return "bg-white/60";
  return "bg-white/80";
}

export default function HeatmapGrid({ data = [] }) {
  const [hovered, setHovered] = useState(null);

  const { cells, columns } = useMemo(() => {
    if (!data || data.length === 0) {
      return { cells: [], columns: 0 };
    }

    // Map counts by date string
    const map = new Map(data.map((x) => [x.date, x.count || 0]));

    // Sort dates ascending
    const sorted = [...data]
      .map((x) => x.date)
      .filter(Boolean)
      .sort((a, b) => new Date(a) - new Date(b));

    const startDate = new Date(sorted[0]);
    const endDate = new Date(sorted[sorted.length - 1]);

    // Normalize start -> Monday-based grid start (or Sunday? GitHub uses Sunday rows)
    // We'll use Sunday = 0...Saturday = 6 for rows (GitHub style)
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    while (start.getDay() !== 0) {
      start.setDate(start.getDate() - 1);
    }

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    while (end.getDay() !== 6) {
      end.setDate(end.getDate() + 1);
    }

    // Build day list from start..end
    const days = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      const iso = cursor.toISOString().slice(0, 10);
      days.push({
        date: iso,
        count: map.get(iso) || 0,
        // row = day of week (Sun=0..Sat=6)
        row: cursor.getDay(),
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    const cols = Math.ceil(days.length / 7);

    return { cells: days, columns: cols };
  }, [data]);

  const weekDayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (!data || data.length === 0) {
    return <p className="text-sm opacity-70">No activity yet</p>;
  }

  return (
    <div className="relative">
      {/* Tooltip */}
      {hovered && (
        <div className="absolute -top-11 left-0 rounded-lg border theme-border theme-card px-3 py-2 text-xs shadow-lg">
          <p className="font-semibold">{hovered.count} activity</p>
          <p className="opacity-70">{formatDateLabel(hovered.date)}</p>
        </div>
      )}

      <div className="flex gap-3">
        {/* Day labels */}
        <div className="flex flex-col gap-1 pt-[2px]">
          {weekDayLabels.map((d) => (
            <div
              key={d}
              className="h-4 text-[10px] text-white/40 flex items-center"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div
          className="grid gap-1"
          style={{
            gridTemplateRows: "repeat(7, 16px)",
            gridTemplateColumns: `repeat(${columns}, 16px)`,
          }}
        >
          {cells.map((c) => (
            <div
              key={c.date}
              onMouseEnter={() => setHovered(c)}
              onMouseLeave={() => setHovered(null)}
              className={`h-4 w-4 rounded-sm border border-white/10 ${getIntensityClass(
                c.count
              )}`}
              title={`${c.date} • ${c.count}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
