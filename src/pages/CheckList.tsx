import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { generateCheckListPDF } from '@/lib/pdf-generator'
import { useTheme } from '@/components/theme-provider'

type ItemStatus = 'pendiente' | 'realizado'

const TECNICOS = [
  { nombre: 'Christian Torrens', firma: '/firmas/firma_christian_torrens.jpeg' },
  { nombre: 'Jerson Armijo', firma: '/firmas/firma_jerson_armijo.jpeg' },
  { nombre: 'Bastian Jimenez', firma: '/firmas/firma_bastian_jimenez.jpeg' },
]

export default function CheckList() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    empresa: '',
    nombreEmpresa: '',
    equipo: '',
    fecha: new Date().toISOString().split('T')[0],
    responsableEmpresa: 'AlertPlus',
    nombreTecnico: '',
    tecnico: '',
    firmaTecnico: '',
    items: [
      { id: 1, nombre: 'Verificar actualización de Windows Actualizador y Bloqueador', estado: 'pendiente' as ItemStatus },
      { id: 2, nombre: 'Prueba de botón (QUI-EDA impulsor, archivo de logs)', estado: 'pendiente' as ItemStatus },
      { id: 3, nombre: 'Prueba de conexión por WI-FI', estado: 'pendiente' as ItemStatus },
      { id: 4, nombre: 'Prueba de conexión por RJ45', estado: 'pendiente' as ItemStatus },
      { id: 5, nombre: 'Verificar que todo esté conectado a BAM de AP', estado: 'pendiente' as ItemStatus },
      { id: 6, nombre: 'Prueba de funcionamiento VTL', estado: 'pendiente' as ItemStatus },
      { id: 7, nombre: 'Prueba Lanzamiento Aplicación AccurePoint', estado: 'pendiente' as ItemStatus },
      { id: 8, nombre: 'SI evaluaciones de prueba con múltiples NombreClave y respaldar con fotos', estado: 'pendiente' as ItemStatus },
      { id: 9, nombre: 'Configurar fecha y hora', estado: 'pendiente' as ItemStatus },
      { id: 10, nombre: 'Verificación de resultado en AMES', estado: 'pendiente' as ItemStatus },
      { id: 11, nombre: 'Prueba reúne lo suficiente apps AccurePoint', estado: 'pendiente' as ItemStatus },
      { id: 12, nombre: 'Configuración de Ayuda: S-Comercio, Electricidad y boquere de las tarjetas de almacenamiento', estado: 'pendiente' as ItemStatus },
      { id: 13, nombre: 'Regalado de archivo config.aplicacion AccurePoint', estado: 'pendiente' as ItemStatus },
      { id: 14, nombre: 'Regalado de foto de la placa del equipo AccurePoint', estado: 'pendiente' as ItemStatus },
    ]
  })

  const handleTecnicoChange = (tecnicoNombre: string) => {
    const tecnico = TECNICOS.find(t => t.nombre === tecnicoNombre)
    setFormData({
      ...formData,
      tecnico: tecnicoNombre,
      nombreTecnico: tecnicoNombre,
      firmaTecnico: tecnico?.firma || ''
    })
  }

  const handleToggleStatus = (index: number) => {
    const newItems = [...formData.items]
    newItems[index].estado = newItems[index].estado === 'pendiente' ? 'realizado' : 'pendiente'
    setFormData({ ...formData, items: newItems })
  }

  const handleReset = () => {
    if (confirm('¿Está seguro que desea reiniciar el formulario?')) {
      setFormData({
        ...formData,
        items: formData.items.map(item => ({ ...item, estado: 'pendiente' as ItemStatus }))
      })
    }
  }

  const handleGeneratePDF = async () => {
    // Validaciones
    const camposFaltantes = []
    
    if (!formData.empresa) camposFaltantes.push('Empresa')
    if (!formData.nombreEmpresa) camposFaltantes.push('Nombre de empresa')
    if (!formData.equipo) camposFaltantes.push('Equipo')
    if (!formData.tecnico) camposFaltantes.push('Técnico')
    
    if (camposFaltantes.length > 0) {
      toast({
        variant: "destructive",
        title: "Campos obligatorios faltantes",
        description: `Por favor completa: ${camposFaltantes.join(', ')}`,
      })
      return
    }
    
    // Verificar que al menos un item esté realizado
    const itemsRealizados = formData.items.filter(item => item.estado === 'realizado').length
    if (itemsRealizados === 0) {
      toast({
        variant: "destructive",
        title: "Verificaciones pendientes",
        description: "Debes marcar al menos un item como realizado antes de generar el PDF",
      })
      return
    }
    
    try {
      await generateCheckListPDF(formData)
      toast({
        title: "PDF generado exitosamente",
        description: `CheckList de ${formData.equipo} creado correctamente`,
      })
    } catch (error) {
      console.error('Error al generar PDF:', error)
      toast({
        variant: "destructive",
        title: "Error al generar PDF",
        description: "Por favor, intenta nuevamente.",
      })
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Logo superior izquierda */}
        <div className="mb-6">
          <div className="mb-4">
            <img 
              src="/alertPlus.png" 
              alt="Alert Plus" 
              className="h-12 w-auto"
              style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #DC2626)' : 'none' }}
            />
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/')} 
            className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-red-600 dark:text-white dark:hover:bg-red-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al menú
          </Button>
        </div>

        {/* Título principal */}
        <div className="mb-6 border border-gray-200 bg-white rounded-lg p-6 dark:border-red-600 dark:bg-black">
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-500">Checklist Final AccessPoint</h1>
        </div>

        <Card className="border border-gray-200 dark:border-red-600 bg-white dark:bg-black">
          <CardHeader className="space-y-0 p-0">
            <div className="bg-red-600 text-white pl-8 pr-4 py-4 rounded-t-[12px]">
              <h2 className="text-lg font-bold">Alert Plus</h2>
              <p className="text-sm font-normal">SERVICIO TÉCNICO</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Identificación Equipo y Responsable */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Identificación Equipo */}
              <div className="space-y-4">
                <h3 className="font-bold text-base border-b-2 border-gray-800 pb-2">Identificación Equipo</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="nombreEmpresa" className="text-sm font-normal text-gray-700 dark:text-white">Cliente</Label>
                  <Input
                    id="nombreEmpresa"
                    placeholder="Nombre de empresa"
                    className="border-gray-300 dark:border-red-600 bg-white dark:bg-black text-gray-900 dark:text-white"
                    value={formData.nombreEmpresa}
                    onChange={(e) => setFormData({ ...formData, nombreEmpresa: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipo" className="text-sm font-normal text-gray-700 dark:text-white">Equipo</Label>
                  <Input
                    id="equipo"
                    placeholder="APXXX, nombre AP, ciudad"
                    className="border-gray-300 dark:border-red-600 bg-white dark:bg-black text-gray-900 dark:text-white"
                    value={formData.equipo}
                    onChange={(e) => setFormData({ ...formData, equipo: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha" className="text-sm font-normal text-gray-700 dark:text-white">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    className="border-gray-300 dark:border-red-600 bg-white dark:bg-black text-gray-900 dark:text-white"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  />
                </div>
              </div>

              {/* Responsable */}
              <div className="space-y-4">
                <h3 className="font-bold text-base border-b-2 border-gray-800 pb-2">Responsable</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="responsableEmpresa" className="text-sm font-normal text-gray-700 dark:text-white">Empresa</Label>
                  <Input
                    id="responsableEmpresa"
                    value="AlertPlus"
                    disabled
                    className="bg-gray-100 dark:bg-black border-gray-300 dark:border-red-600 text-gray-700 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tecnico" className="text-sm font-normal text-gray-700 dark:text-white">Nombre técnico</Label>
                  <select
                    id="tecnico"
                    className="flex h-10 w-full rounded-md border border-gray-300 dark:border-red-600 bg-white dark:bg-black px-3 py-2 text-sm text-gray-900 dark:text-white"
                    value={formData.tecnico}
                    onChange={(e) => handleTecnicoChange(e.target.value)}
                  >
                    <option value="">Elige el tecnico</option>
                    {TECNICOS.map((tec) => (
                      <option key={tec.nombre} value={tec.nombre}>
                        {tec.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firmaTecnico" className="text-sm font-normal text-gray-700 dark:text-white">Firma técnico</Label>
                  {formData.firmaTecnico ? (
                    <div className="border border-gray-300 dark:border-red-600 rounded-md p-2 bg-gray-50 dark:bg-black flex items-center justify-center h-20">
                      <img 
                        src={formData.firmaTecnico} 
                        alt="Firma" 
                        className="max-h-16 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                          const parent = (e.target as HTMLElement).parentElement
                          if (parent) {
                            parent.innerHTML = '<span class="text-xs font-semibold text-red-700 bg-red-100 rounded px-2 py-1">Imagen de firma no encontrada</span>'
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="border border-gray-300 dark:border-red-600 rounded-md p-2 bg-gray-50 dark:bg-black flex items-center justify-center h-20">
                      <span className="text-xs text-gray-500 dark:text-white">Selecciona un técnico</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chequeo Final */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-bold text-sm">Chequeo Final</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 text-xs font-semibold w-12">N°</th>
                      <th className="text-left p-2 text-xs font-semibold">Verificación Realizada</th>
                      <th className="text-center p-2 text-xs font-semibold w-32">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, index) => (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 text-sm">{item.id}</td>
                        <td className="p-2 text-sm">{item.nombre}</td>
                        <td className="p-2 text-center">
                          <Button
                            size="sm"
                            onClick={() => handleToggleStatus(index)}
                            className={
                              item.estado === 'pendiente'
                                ? 'bg-orange-500 hover:bg-orange-600 text-white text-xs'
                                : 'bg-green-600 hover:bg-green-700 text-white text-xs'
                            }
                          >
                            {item.estado === 'pendiente' ? 'Pendiente' : 'Realizado'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
              <Button 
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary/10"
              >
                Reiniciar
              </Button>
              <Button 
                onClick={handleGeneratePDF} 
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                Generar PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
