import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import MainMenu from '@/pages/MainMenu'
import CheckList from '@/pages/CheckList'
import GuiaDespacho from '@/pages/GuiaDespacho'
import Informes from '@/pages/Informes'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/checklist" element={<CheckList />} />
          <Route path="/guia-despacho" element={<GuiaDespacho />} />
          <Route path="/informes" element={<Informes />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
