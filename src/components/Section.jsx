import Reveal from './Reveal'
import { cx } from '../lib/utils'

export default function Section({ id, index, eyebrow, title, action, children, className }) {
  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-title`}
      className={cx('py-16 sm:py-20', className)}
    >
      <div className="container-page">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4 sm:mb-12">
          <div>
            <p className="eyebrow">
              {index && <span className="text-muted">{index} / </span>}
              {eyebrow}
            </p>
            <h2 id={`${id}-title`} className="mt-3 text-3xl font-semibold text-balance sm:text-4xl">
              {title}
            </h2>
          </div>
          {action}
        </Reveal>
        {children}
      </div>
    </section>
  )
}
