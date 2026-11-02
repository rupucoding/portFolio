import { m } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

/** Fades content up once when it scrolls into view. */
export default function Reveal({ as = 'div', delay = 0, y = 18, className, children, ...rest }) {
  const Component = m[as]
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  )
}
