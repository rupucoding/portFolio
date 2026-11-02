import { Link } from 'react-router'

/** Link to a section on the home page; works from any route. */
export default function SectionLink({ id, children, ...rest }) {
  return (
    <Link to={{ pathname: '/', hash: `#${id}` }} {...rest}>
      {children}
    </Link>
  )
}
