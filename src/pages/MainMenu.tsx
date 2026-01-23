import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTheme } from '@/components/theme-provider'
import { Moon, Sun } from 'lucide-react'

export default function MainMenu() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-black">
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="border-gray-300 dark:border-red-600"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5 text-gray-900" />
          ) : (
            <Sun className="h-5 w-5 text-white" />
          )}
        </Button>
      </div>

      {/* Logo Alert Plus */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-8">
          <img 
            src="/alertPlus.png" 
            alt="Alert Plus" 
            className="h-40 w-auto"
            style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #DC2626)' : 'none' }}
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Organizaciones + alertas</h1>
      </div>

      {/* Cards de opciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border border-gray-200 dark:border-red-600 bg-white dark:bg-black"
          onClick={() => navigate('/checklist')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center bg-orange-50 dark:bg-red-900 rounded-xl" style={{ width: '96px', height: '96px' }}>
                <img src="/icons/clipboard.svg" alt="CheckList Icon" className="h-16 w-16" />
              </div>
            </div>
            <CardTitle className="text-center text-xl font-bold text-gray-900 dark:text-white">CheckList Final</CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-0">
            <CardDescription className="text-sm text-gray-600 dark:text-gray-200">
              Registro de verificación de equipos y servicios
            </CardDescription>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border border-gray-200 dark:border-red-600 bg-white dark:bg-black"
          onClick={() => navigate('/guia-despacho')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center bg-amber-50 dark:bg-red-900 rounded-xl" style={{ width: '96px', height: '96px' }}>
                <img src="/icons/box_document.svg" alt="Box Document Icon" className="h-24 w-24" />
              </div>
            </div>
            <CardTitle className="text-center text-xl font-bold text-gray-900 dark:text-white">Guías de Despacho</CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-0">
            <CardDescription className="text-sm text-gray-600 dark:text-gray-200">
              Documentación de envíos y recepciones
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
