import { Download } from 'lucide-react'
import { profile } from '../data/profile'
import { asset, cx } from '../lib/utils'

export default function ResumeButton({ variant = 'secondary', label = 'Download Resume', className }) {
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
