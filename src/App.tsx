
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'

import { Toaster } from 'react-hot-toast'
import MainMenu from '@/pages/MainMenu'
import CheckList from '@/pages/CheckList'
import GuiaDespacho from '@/pages/GuiaDespacho'
import Informes from '@/pages/Informes'
import Certificados from '@/pages/Certificados'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/checklist" element={<CheckList />} />
          <Route path="/guia-despacho" element={<GuiaDespacho />} />
          <Route path="/informes" element={<Informes />} />
          <Route path="/certificados" element={<Certificados />} />
        </Routes>
      </Router>
      <Toaster 
        position="bottom-center"
        toastOptions={{
            success: {
                style: {
                    background: '#10B981', // Emerald 500
                    color: '#fff',
                },
                iconTheme: {
                    primary: '#fff',
                    secondary: '#10B981',
                },
            },
            error: {
                style: {
                    background: '#EF4444', // Red 500
                    color: '#fff',
                },
                iconTheme: {
                    primary: '#fff',
                    secondary: '#EF4444',
                },
            },
            duration: 4000,
        }}
      />
    </ThemeProvider>
  )
}


export default App

