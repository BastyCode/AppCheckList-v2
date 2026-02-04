import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { startPdfCountdown, showErrorToast } from '@/lib/toast-utils'
import { generateCheckListPDF } from '@/lib/pdf-generator'
import { useTheme } from '@/components/theme-provider'

type ItemStatus = 'pendiente' | 'realizado'

const TECNICOS = [
  { nombre: 'Christian Torrens', firma: `${import.meta.env.BASE_URL}firmas/firma_christian_torrens.jpeg` },
  { nombre: 'Jerson Armijo', firma: `${import.meta.env.BASE_URL}firmas/firma_jerson_armijo.jpeg` },
  { nombre: 'Bastian Jimenez', firma: `${import.meta.env.BASE_URL}firmas/firma_bastian_jimenez.jpeg` },
]

export default function CheckList() {
  const navigate = useNavigate()
  const { theme } = useTheme()

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
      { id: 2, nombre: 'Prueba de botón (500 clicl + respaldo de logs)', estado: 'pendiente' as ItemStatus },
      { id: 3, nombre: 'Prueba de conexión por WI-FI', estado: 'pendiente' as ItemStatus },
      { id: 4, nombre: 'Prueba de conexión por RJ45 (RED)', estado: 'pendiente' as ItemStatus },
      { id: 5, nombre: 'Verificar conexión unica a BAM de AP', estado: 'pendiente' as ItemStatus },
      { id: 6, nombre: 'Prueba de funcionamiento VTS', estado: 'pendiente' as ItemStatus },
      { id: 7, nombre: 'Prueba funcionamiento Aplicación AccessPoint', estado: 'pendiente' as ItemStatus },
      { id: 8, nombre: '10 evaluaciones de prueba con resultado Normal/leve y respaldar con fotos', estado: 'pendiente' as ItemStatus },
      { id: 9, nombre: 'Configurar fecha y hora', estado: 'pendiente' as ItemStatus },
      { id: 10, nombre: 'Verificación de resultado en AMFS', estado: 'pendiente' as ItemStatus },
      { id: 11, nombre: 'Apagado y Encendido, Inicio automatico de Accesspoint', estado: 'pendiente' as ItemStatus },
      { id: 12, nombre: 'Configuración de Anydesk, Password, Restricciones e ingreso a libreta de direcciones de Anydesk ', estado: 'pendiente' as ItemStatus },
      { id: 13, nombre: 'Respaldo de archivo config aplicacion AccessPoint', estado: 'pendiente' as ItemStatus },
      { id: 14, nombre: 'Respaldo de foto de etiqueta de Equipo AccessPoint', estado: 'pendiente' as ItemStatus },
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
    

    if (!formData.nombreEmpresa) camposFaltantes.push('Nombre de empresa')
    if (!formData.equipo) camposFaltantes.push('Equipo')
    if (!formData.tecnico) camposFaltantes.push('Técnico')
    

    if (camposFaltantes.length > 0) {
      showErrorToast(`Faltan campos obligatorios: ${camposFaltantes.join(', ')}`)
      return
    }
    
    // Verificar que al menos un item esté realizado
    const itemsRealizados = formData.items.filter(item => item.estado === 'realizado').length
    if (itemsRealizados === 0) {
      showErrorToast("Debes marcar al menos un item como realizado antes de generar el PDF")
      return
    }
    
    // Use centralized toast handling
    await startPdfCountdown(async () => {
        await generateCheckListPDF(formData)
    })
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-black">
      <div className="mx-auto max-w-7xl">
        {/* Logo superior izquierda */}
        <div className="mb-6">
          <div className="mb-4">
            <img 
              src={`${import.meta.env.BASE_URL}alertPlus.png`} 
              alt="Alert Plus" 
              className="w-auto h-12"
              style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #DC2626)' : 'none' }}
            />
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/')} 
            className="text-gray-700 border-gray-300 hover:bg-gray-100 dark:border-red-600 dark:text-white dark:hover:bg-red-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al menú
          </Button>
        </div>

        {/* Título principal */}
        <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg dark:border-red-600 dark:bg-black">
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-500">Checklist Final AccessPoint</h1>
        </div>

        <Card className="bg-white border border-gray-200 dark:border-red-600 dark:bg-black">
          <CardHeader className="p-0 space-y-0">
            <div className="bg-red-600 text-white pl-8 pr-4 py-4 rounded-t-[12px]">
              <h2 className="text-lg font-bold">Alert Plus</h2>
              <p className="text-sm font-normal">SERVICIO TÉCNICO</p>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Identificación Equipo y Responsable */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Identificación Equipo */}
              <div className="space-y-4">
                <h3 className="pb-2 text-base font-bold border-b-2 border-gray-800">Identificación Equipo</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="nombreEmpresa" className="text-sm font-normal text-gray-700 dark:text-white">Cliente</Label>
                  <Input
                    id="nombreEmpresa"
                    placeholder="Nombre de empresa"
                    className="text-gray-900 bg-white border-gray-300 dark:border-red-600 dark:bg-black dark:text-white"
                    value={formData.nombreEmpresa}
                    onChange={(e) => setFormData({ ...formData, nombreEmpresa: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipo" className="text-sm font-normal text-gray-700 dark:text-white">Equipo</Label>
                  <Input
                    id="equipo"
                    placeholder="APXXX, nombre AP, ciudad"
                    className="text-gray-900 bg-white border-gray-300 dark:border-red-600 dark:bg-black dark:text-white"
                    value={formData.equipo}
                    onChange={(e) => setFormData({ ...formData, equipo: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha" className="text-sm font-normal text-gray-700 dark:text-white">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    className="text-gray-900 bg-white border-gray-300 dark:border-red-600 dark:bg-black dark:text-white"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  />
                </div>
              </div>

              {/* Responsable */}
              <div className="space-y-4">
                <h3 className="pb-2 text-base font-bold border-b-2 border-gray-800">Responsable</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="responsableEmpresa" className="text-sm font-normal text-gray-700 dark:text-white">Empresa</Label>
                  <select
                    id="responsableEmpresa"
                    className="flex w-full h-10 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md dark:border-red-600 dark:bg-black dark:text-white"
                    value={formData.responsableEmpresa}
                    onChange={(e) => {
                      const nuevaEmpresa = e.target.value
                      setFormData({
                        ...formData,
                        responsableEmpresa: nuevaEmpresa,
                        // Resetear técnico al cambiar de empresa
                        tecnico: '',
                        nombreTecnico: '',
                        firmaTecnico: ''
                      })
                    }}
                  >
                    <option value="AlertPlus">AlertPlus</option>
                    <option value="Praveni">Praveni</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tecnico" className="text-sm font-normal text-gray-700 dark:text-white">Nombre técnico</Label>
                  <select
                    id="tecnico"
                    className="flex w-full h-10 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md dark:border-red-600 dark:bg-black dark:text-white"
                    value={formData.tecnico}
                    onChange={(e) => handleTecnicoChange(e.target.value)}
                  >
                    <option value="">Elige el tecnico</option>
                    {formData.responsableEmpresa === 'AlertPlus' ? (
                      TECNICOS.map((tec) => (
                        <option key={tec.nombre} value={tec.nombre}>
                          {tec.nombre}
                        </option>
                      ))
                    ) : (
                      <option value="Jeffry Flores">Jeffry Flores</option>
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firmaTecnico" className="text-sm font-normal text-gray-700 dark:text-white">Firma técnico</Label>
                  {/* Lógica para subir firma si es Praveni/Jeffry */}
                  {formData.responsableEmpresa === 'Praveni' && formData.tecnico === 'Jeffry Flores' && !formData.firmaTecnico && (
                    <div className="mb-2">
                       <label className="flex flex-col items-center justify-center p-4 transition-colors border-2 border-gray-300 border-dashed rounded-md cursor-pointer dark:border-red-600 bg-gray-50/50 dark:bg-black hover:bg-gray-100 dark:hover:bg-red-900/10">
                        <Upload className="w-6 h-6 mb-2 text-gray-500 dark:text-red-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Haz click para subir la firma
                        </span>
                        <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          (Formatos: JPG, PNG)
                        </span>
                         <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (event) => {
                                const result = event.target?.result as string
                                if (result) {
                                  setFormData(prev => ({ ...prev, firmaTecnico: result }))
                                }
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {formData.firmaTecnico ? (
                    <div className="relative flex flex-col items-center justify-center h-24 p-2 border border-gray-300 rounded-md dark:border-red-600 bg-gray-50 dark:bg-black">
                      <img 
                        src={formData.firmaTecnico} 
                        alt="Firma" 
                        className="object-contain max-h-16"
                      />
                      {/* Botón para borrar firma si es manual */}
                      {formData.responsableEmpresa === 'Praveni' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute w-6 h-6 p-0 top-1 right-1"
                          onClick={() => setFormData(prev => ({ ...prev, firmaTecnico: '' }))}
                        >
                          X
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-20 p-2 border border-gray-300 rounded-md dark:border-red-600 bg-gray-50 dark:bg-black">
                      <span className="text-xs text-gray-500 dark:text-white">
                        {formData.responsableEmpresa === 'Praveni' ? 'Sube la firma' : 'Selecciona un técnico'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chequeo Final */}
            <div className="pt-4 space-y-4 border-t">
              <h3 className="text-sm font-bold">Chequeo Final</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="w-12 p-2 text-xs font-semibold text-left">N°</th>
                      <th className="p-2 text-xs font-semibold text-left">Verificación Realizada</th>
                      <th className="w-32 p-2 text-xs font-semibold text-center">Estado</th>
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

            <div className="flex flex-col justify-end gap-3 pt-4 sm:flex-row">
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
