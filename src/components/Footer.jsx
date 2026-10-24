import { SITE } from '../data/config.js'

export default function Footer() {
  return <footer>© {new Date().getFullYear()} {SITE.name} Academy</footer>
}
