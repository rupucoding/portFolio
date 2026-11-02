import { profile } from '../data/profile'
import { getIcon } from '../components/icons'
import Reveal from '../components/Reveal'
import Section from '../components/Section'

function SkillList({ items, className }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <li key={item} className="chip">
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function Skills() {
  return (
    <Section id="skills" index="03" eyebrow="Skills" title={profile.headings.skills}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {profile.skills.map((group, i) => {
          const Icon = getIcon(group.icon)
          return (
            <Reveal as="li" key={group.title} delay={(i % 3) * 0.06} className="card card-hover p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                  <Icon size={20} aria-hidden />
                </span>
                <h3 className="text-lg font-semibold">{group.title}</h3>
              </div>
              <SkillList items={group.items} className="mt-5" />
              {group.subgroups?.map((sub) => (
                <div key={sub.title} className="mt-5 border-t border-line pt-4">
                  <h4 className="eyebrow">{sub.title}</h4>
                  <SkillList items={sub.items} className="mt-3" />
                </div>
              ))}
            </Reveal>
          )
        })}
      </ul>
    </Section>
  )
}
