export default function SalesBarChart({ data = [] }) {
  const max = Math.max(...data.map(d => d.revenue ?? 0), 1)

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* Monthly Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {data.length > 0 ? data.map((m, i) => (
          <div key={i} className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-text-muted)]">{m.date}</p>
            <p className="text-xl font-black text-emerald-500">
              {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(m.revenue)}
            </p>
          </div>
        )) : (
          <div className="col-span-full p-4 text-center text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)] rounded-2xl">
            No data available
          </div>
        )}
      </div>

      {/* Bar Chart */}
      <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] shadow-sm">
        <h3 className="text-lg font-bold text-[var(--color-text)] mb-6">Monthly Revenue</h3>
        <div className="flex items-end gap-2 h-64">
          {data.map((item, i) => {
            const heightPercent = (item.revenue / max) * 100
            return (
              <div key={i} className="flex flex-col items-center flex-1 group h-full justify-end">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold mb-1 text-[var(--color-text)]">
                  {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", notation: "compact" }).format(item.revenue)}
                </span>
                <div
                  className="w-full bg-emerald-500 rounded-t-sm transition-all duration-300 group-hover:bg-emerald-400 group-hover:-translate-y-1"
                  style={{ height: `${heightPercent}%`, minHeight: "2px" }}
                />
                <span className="mt-3 text-[9px] font-medium text-[var(--color-text-muted)] whitespace-nowrap">
                  {item.date}
                </span>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}