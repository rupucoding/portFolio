import { profile } from '../data/profile'
import { asset } from '../lib/utils'

/* global __HAS_PHOTO__ */

/** Round portrait with a soft glow ring. Falls back to initials if no photo is in /public. */
export default function Avatar() {
  const size = 'h-44 w-44 sm:h-56 sm:w-56 lg:h-72 lg:w-72'

  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-8 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative rounded-full bg-gradient-to-br from-accent via-accent/25 to-accent/60 p-[3px] shadow-[0_0_60px_-12px_rgb(var(--c-accent)/0.6)]">
        <div className="rounded-full bg-bg p-2">
          {__HAS_PHOTO__ ? (
            <img
              src={asset(profile.photo.src)}
              alt={profile.photo.alt}
              width="288"
              height="288"
              fetchpriority="high"
              className={`${size} rounded-full object-cover`}
            />
          ) : (
            <div
              role="img"
              aria-label={profile.name}
              className={`${size} grid place-items-center rounded-full bg-gradient-to-br from-surface-2 to-surface font-display text-5xl font-bold text-accent sm:text-6xl lg:text-7xl`}
            >
              {profile.initials}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
