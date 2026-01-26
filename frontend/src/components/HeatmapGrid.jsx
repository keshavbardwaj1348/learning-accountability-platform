import { useMemo, useState } from "react";

function formatDateLabel(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toDateString();
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
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const { cells, columns } = useMemo(() => {
    if (!data || data.length === 0) {
      return { cells: [], columns: 0 };
    }

    const map = new Map(data.map((x) => [x.date, x.count || 0]));

    const sorted = [...data]
      .map((x) => x.date)
      .filter(Boolean)
      .sort((a, b) => new Date(a) - new Date(b));

    const startDate = new Date(sorted[0]);
    const endDate = new Date(sorted[sorted.length - 1]);

    // GitHub style rows: Sunday=0 ... Saturday=6
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    while (start.getDay() !== 0) start.setDate(start.getDate() - 1);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    while (end.getDay() !== 6) end.setDate(end.getDate() + 1);

    const days = [];
    const cursor = new Date(start);

    while (cursor <= end) {
      const iso = cursor.toISOString().slice(0, 10);
      days.push({
        date: iso,
        count: map.get(iso) || 0,
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
      {/* ✅ Tooltip follows cursor (fixed position => never overlaps title weirdly) */}
      {hovered && (
        <div
          style={{
            position: "fixed",
            left: tooltipPos.x + 12,
            top: tooltipPos.y + 12,
            zIndex: 9999,
            pointerEvents: "none",
          }}
          className="rounded-lg border border-white/10 bg-black/90 px-3 py-2 text-xs text-white shadow-lg"
        >
          <p className="font-semibold">{hovered.count} activity</p>
          <p className="text-white/70">{formatDateLabel(hovered.date)}</p>
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
              onMouseEnter={(e) => {
                setHovered(c);
                setTooltipPos({ x: e.clientX, y: e.clientY });
              }}
              onMouseMove={(e) => {
                setTooltipPos({ x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => setHovered(null)}
              className={`h-4 w-4 rounded-sm border border-white/10 ${getIntensityClass(
                c.count
              )}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
