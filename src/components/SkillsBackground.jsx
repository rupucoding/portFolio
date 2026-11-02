// Decorative backdrop for the hero: rows of skill keywords drifting slowly
// sideways, in alternating directions. Kept faint so it reads as texture.
const ROWS = 7

// Start each row at a different point in the list so rows don't line up.
function rotate(list, by) {
  const n = by % list.length
  return [...list.slice(n), ...list.slice(0, n)]
}

export default function SkillsBackground({ keywords, className = '' }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none flex select-none flex-col justify-center gap-4 sm:gap-6 ${className}`}
    >
      {Array.from({ length: ROWS }, (_, row) => {
        const words = rotate(keywords, row * 5)
        return (
          <div
            key={row}
            className="flex w-max motion-safe:animate-marquee"
            style={{
              animationDuration: `${90 + row * 12}s`,
              animationDirection: row % 2 ? 'reverse' : 'normal',
            }}
          >
            {/* Two copies so the -50% loop is seamless. */}
            {[0, 1].map((copy) =>
              words.map((word) => (
                <span
                  key={`${copy}-${word}`}
                  className={`whitespace-nowrap px-5 font-display text-3xl font-bold tracking-tight sm:px-7 sm:text-5xl ${
                    row % 2 ? '[-webkit-text-fill-color:transparent] [-webkit-text-stroke:1px_currentColor]' : ''
                  }`}
                >
                  {word}
                </span>
              )),
            )}
          </div>
        )
      })}
    </div>
  )
}
