import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { CaseProvider } from './context/CaseContext'
import ListPage from './pages/ListPage'
import DetailPage from './pages/DetailPage'
import NewPage from './pages/NewPage'
import EditPage from './pages/EditPage'
import StatsPage from './pages/StatsPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  return (
    <CaseProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<ListPage />} />
          <Route path="new" element={<NewPage />} />
          <Route path="cases/:id" element={<DetailPage />} />
          <Route path="cases/:id/edit" element={<EditPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
      </Routes>
    </CaseProvider>
  )
}
