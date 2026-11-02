import {
  BookOpenCheck,
  Cloud,
  Code,
  CodeXml,
  Github,
  Linkedin,
  Mail,
  Network,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'

// Names used in profile.js -> icon components.
const ICONS = {
  cloud: Cloud,
  network: Network,
  shield: ShieldCheck,
  code: Code,
  sparkles: Sparkles,
  users: Users,
  github: Github,
  linkedin: Linkedin,
  leetcode: CodeXml,
  gfg: BookOpenCheck,
  mail: Mail,
}

export const getIcon = (name) => ICONS[name] ?? Sparkles
