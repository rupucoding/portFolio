import { useDocumentHead } from '../hooks/useDocumentHead'
import About from '../sections/About'
import BlogPreview from '../sections/BlogPreview'
import Certifications from '../sections/Certifications'
import Contact from '../sections/Contact'
import Education from '../sections/Education'
import Experience from '../sections/Experience'
import Hero from '../sections/Hero'
import LearningPreview from '../sections/LearningPreview'
import Projects from '../sections/Projects'
import Skills from '../sections/Skills'

export default function Home() {
  useDocumentHead()
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <LearningPreview />
      <Certifications />
      <Education />
      <BlogPreview />
      <Contact />
    </>
  )
}
