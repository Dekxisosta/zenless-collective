import { CalendarDays, ArrowRight, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function EventCard({ event, onNavigate }) {
  const isPast = event.isPast ?? false
  const [waiting, setWaiting] = useState(event.waiting ?? 0)

  useEffect(() => {
    if (isPast) return
    const interval = setInterval(() => {
      const delta = Math.floor(Math.random() * 5) - 1  // -1 to +3, biased up
      setWaiting(prev => Math.max(0, prev + delta))
    }, Math.floor(Math.random() * 3000) + 2000)         // every 2–5s
    return () => clearInterval(interval)
  }, [isPast])

  return (
    <div
      data-card
      onClick={() => !isPast && onNavigate(event.link)}
      className="relative flex-shrink-0 snap-start w-full md:w-1/2 lg:w-1/4"
      style={{ cursor: isPast ? "not-allowed" : "pointer" }}
    >
      <div
        className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        style={{
          border: "1px solid var(--color-border)",
          background: "#000",
          filter: isPast ? "grayscale(0.6)" : "none",
          opacity: isPast ? 0.7 : 1,
        }}
      >

        {/* Ribbon */}
        <div
          className="absolute top-4 -left-1 z-20 flex items-center gap-1"
          style={{
            background: isPast ? "var(--color-disabled)" : "var(--color-primary)",
            color: "var(--hero-text)",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "4px 10px 4px 12px",
            clipPath: "polygon(0% 0%, 100% 0%, 92% 50%, 100% 100%, 0% 100%)",
          }}
        >
          {isPast ? "Ended" : "Event"}
        </div>

        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 pt-10">

          {/* Top badges */}
          <div className="flex flex-col items-start gap-1.5 mt-2">
            {event.tag && (
              <span
                className="text-[10px] px-2.5 py-1 font-bold uppercase tracking-wider"
                style={{
                  background: "var(--color-accent)",
                  color: "#000",
                  borderRadius: "4px",
                }}
              >
                {event.tag}
              </span>
            )}
            <span
              className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 font-semibold"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "4px",
                color: "#fff",
              }}
            >
              <CalendarDays style={{ width: "11px", height: "11px" }} />
              {event.date}
            </span>
          </div>

          {/* Bottom content */}
          <div className="space-y-3">

            <div className="flex">
              <p
                className="text-sm font-bold leading-snug"
                style={{
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "999px",
                  color: "#fff",
                  padding: "6px 14px",
                }}
              >
                {event.title}
              </p>
            </div>


            {/* Attendee count */}
            <div className="inline-flex items-center gap-1.5">
              <Users style={{ width: "11px", height: "11px", color: "var(--color-primary)" }} />
              <span
                className="text-[16px] font-semibold tabular-nums transition-all duration-500"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {isPast
                  ? `${event.attendees ?? 0} attended`
                  : `${waiting.toLocaleString()} waiting`}
              </span>
            </div>

            {/* CTA row */}
            <div className="flex items-center justify-between pt-1">
              <span
                className="text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: isPast ? "var(--color-disabled)" : "var(--color-primary)" }}
              >
                {isPast ? "Event ended" : "View event"}
              </span>

              <button
                disabled={isPast}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isPast) onNavigate(event.link)
                }}
                className="flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200"
                style={{
                  background: isPast ? "var(--color-disabled)" : "var(--color-primary)",
                  color: "var(--hero-text)",
                  border: "none",
                  cursor: isPast ? "not-allowed" : "pointer",
                  transform: "scale(1)",
                  boxShadow: isPast ? "none" : "0 0 0 0px color-mix(in srgb, var(--color-primary) 40%, transparent)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={e => {
                  if (isPast) return
                  e.currentTarget.style.transform = "scale(1.2)"
                  e.currentTarget.style.boxShadow = "0 0 0 4px color-mix(in srgb, var(--color-primary) 30%, transparent)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "scale(1)"
                  e.currentTarget.style.boxShadow = "0 0 0 0px color-mix(in srgb, var(--color-primary) 40%, transparent)"
                }}
              >
                <ArrowRight style={{ width: "13px", height: "13px" }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}