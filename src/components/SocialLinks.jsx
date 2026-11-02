import { profile } from '../data/profile'
import { getIcon } from './icons'
import { cx, isExternal } from '../lib/utils'

export default function SocialLinks({ className }) {
  return (
    <ul className={cx('flex items-center gap-2', className)}>
      {profile.social.map(({ label, href, icon }) => {
        const Icon = getIcon(icon)
        return (
          <li key={label}>
            <a
              href={href}
              className="icon-btn"
              aria-label={label}
              title={label}
              {...(isExternal(href) && { target: '_blank', rel: 'noopener noreferrer' })}
            >
              <Icon size={18} aria-hidden />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
