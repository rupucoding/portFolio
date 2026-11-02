import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import Layout from './components/Layout'
import Blog from './pages/Blog'
import Home from './pages/Home'
import Learning from './pages/Learning'
import NotFound from './pages/NotFound'

// Markdown rendering is only needed on post pages, so it loads on demand.
const BlogPost = lazy(() => import('./pages/BlogPost'))
const LearningEntry = lazy(() => import('./pages/LearningEntry'))

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <BrowserRouter basename={basename}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="learning" element={<Learning />} />
              <Route path="learning/:slug" element={<LearningEntry />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MotionConfig>
    </LazyMotion>
  )
}
