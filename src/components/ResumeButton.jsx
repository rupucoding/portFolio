import { Download } from 'lucide-react'
import { profile } from '../data/profile'
import { asset, cx } from '../lib/utils'

/* global __HAS_RESUME__ */

export default function ResumeButton({ variant = 'secondary', label = 'Download Resume', className }) {
  if (!__HAS_RESUME__) return null
  return (
    <a
      href={asset(profile.resume.src)}
      download={profile.resume.downloadAs}
      className={cx(variant === 'primary' ? 'btn-primary' : 'btn-secondary', className)}
    >
      <Download size={16} aria-hidden />
      {label}
    </a>
  )
}
