import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { startPdfCountdown, showErrorToast } from '@/lib/toast-utils'
import { generateGuiaDespachoPDF } from '@/lib/pdf-generator'
import { useTheme } from '@/components/theme-provider'

const TECNICOS = [
  { nombre: 'Christian Torrens', firma: `${import.meta.env.BASE_URL}firmas/firma_christian_torrens.jpeg` },
  { nombre: 'Jerson Armijo', firma: `${import.meta.env.BASE_URL}firmas/firma_jerson_armijo.jpeg` },
  { nombre: 'Bastian Jimenez', firma: `${import.meta.env.BASE_URL}firmas/firma_bastian_jimenez.jpeg` },
]

export default function GuiaDespacho() {
  const navigate = useNavigate()
  const { theme } = useTheme()

  const [formData, setFormData] = useState({
    // Access Point y Equipos
    accessPoint: '',
    serieAccessPoint: '',
    dongle: '',
    modeloBAM: '',
    compania: '',
    cpuModelo: '',
    impresoraSN: '',
    botonSN: '',
    condicion: '',
    estructuraMetalica: '',
    licencia: '',
    bamTelefono: '',
    cpuSerie: '',
    impresoraModelo: '',
    pantallaSN: '',
    // Datos de Recepción
    nombreReceptor: '',
    rutReceptor: '',
    direccion: '',
    telefono: '',
    // Datos Responsable
    empresa: '', 
    responsableEmpresa: 'AlertPlus',
    nombreTecnico: '',
    tecnico: '',
    firmaTecnico: ''
  })

  // Función para convertir archivo a Base64
  const handleTecnicoChange = (tecnicoNombre: string) => {
    const tecnico = TECNICOS.find(t => t.nombre === tecnicoNombre)
    setFormData({
      ...formData,
      tecnico: tecnicoNombre,
      nombreTecnico: tecnicoNombre,
      firmaTecnico: tecnico?.firma || ''
    })
  }

  const handleGeneratePDF = async () => {
    // Validaciones
    const camposFaltantes = []
    
    // Sección Access Point
    if (!formData.accessPoint) camposFaltantes.push('Access Point')
    if (!formData.serieAccessPoint) camposFaltantes.push('N° de serie Access Point')
    
    // Datos de Recepción
    if (!formData.nombreReceptor) camposFaltantes.push('Nombre del receptor')
    if (!formData.rutReceptor) camposFaltantes.push('RUT del receptor')
    if (!formData.direccion) camposFaltantes.push('Dirección')
    if (!formData.telefono) camposFaltantes.push('Teléfono')
    
    // Validar selectores
    if (!formData.condicion) camposFaltantes.push('Condición del equipo')
    if (!formData.modeloBAM) camposFaltantes.push('Modelo de BAM')
    

    if (camposFaltantes.length > 0) {
      showErrorToast(`Faltan campos obligatorios: ${camposFaltantes.join(', ')}`)
      return
    }
    
    await startPdfCountdown(async () => {
      await generateGuiaDespachoPDF({ ...formData, fecha: new Date().toLocaleDateString('es-CL') })
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
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-500">Guías de Despacho</h1>
        </div>

        <Card className="bg-white border border-gray-200 dark:border-red-600 dark:bg-black">
          <CardHeader className="p-0 space-y-0">
            <div className="bg-red-600 text-white pl-8 pr-4 py-4 rounded-t-[12px]">
              <h2 className="text-lg font-bold">Alert Plus</h2>
              <p className="text-sm font-normal">Solicitud de Guía de Despacho</p>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Sección 1: Access Point y Equipos */}
            <div className="space-y-4">
              <h3 className="pb-2 text-base font-bold border-b-2 border-gray-800">1. Access Point y Equipos</h3>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="accessPoint" className="text-xs dark:text-white">Access Point (APxx)</Label>
                  <Input
                    id="accessPoint"
                    placeholder="Ej: AP001, APT23"
                    className="text-gray-900 bg-white border-gray-300 dark:border-red-600 dark:bg-black dark:text-white"
                    value={formData.accessPoint}
                    onChange={(e) => setFormData({ ...formData, accessPoint: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condicion" className="text-xs dark:text-white">Condición</Label>
                  <select
                    id="condicion"
                    className="flex w-full h-10 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md dark:border-red-600 dark:bg-black dark:text-white"
                    value={formData.condicion}
                    onChange={(e) => setFormData({ ...formData, condicion: e.target.value })}
                  >
                    <option value="">Seleccionar condición...</option>
                    <option value="nuevo">Nuevo</option>
                    <option value="usado">Usado</option>
                    <option value="reparado">Reparado</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serieAccessPoint" className="text-xs dark:text-white">N° de serie Access Point</Label>
                  <Input
                    id="serieAccessPoint"
                    placeholder="Ej: 767000000520"
                    className="text-gray-900 bg-white border-gray-300 dark:border-red-600 dark:bg-black dark:text-white"
                    value={formData.serieAccessPoint}
                    onChange={(e) => setFormData({ ...formData, serieAccessPoint: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estructuraMetalica" className="text-xs dark:text-white">Estructura metálica</Label>
                  <select
                    id="estructuraMetalica"
                    className="flex w-full h-10 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md dark:border-red-600 dark:bg-black dark:text-white"
                    value={formData.estructuraMetalica}
                    onChange={(e) => setFormData({ ...formData, estructuraMetalica: e.target.value })}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Lata chica Stout">Lata chica Stout</option>
                    <option value="Lata blanca">Lata blanca</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dongle" className="text-xs dark:text-white">Dongle</Label>
                  <Input
                    id="dongle"
                    placeholder="TDC2-XXXX ó TDC3-XXXX"
                    value={formData.dongle}
                    onChange={(e) => setFormData({ ...formData, dongle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licencia" className="text-xs dark:text-white">Licencia</Label>
                  <Input
                    id="licencia"
                    placeholder="W0000X_XXX"
                    value={formData.licencia}
                    onChange={(e) => setFormData({ ...formData, licencia: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modeloBAM" className="text-xs dark:text-white">MODELO DE BAM</Label>
                  <select
                    id="modeloBAM"
                    className="flex w-full h-10 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md dark:border-red-600 dark:bg-black dark:text-white"
                    value={formData.modeloBAM}
                    onChange={(e) => setFormData({ ...formData, modeloBAM: e.target.value })}
                  >
                    <option value="">Seleccionar modelo...</option>
                    <option value="bam_v1">ZTE</option>
                    <option value="bam_v2">ENTEL</option>
                    <option value="bam_v2">BAM ROJA</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bamTelefono" className="text-xs dark:text-white">Bam - Número telefónico</Label>
                  <Input
                    id="bamTelefono"
                    placeholder="Ej: +56 9 1234 5678"
                    value={formData.bamTelefono}
                    onChange={(e) => setFormData({ ...formData, bamTelefono: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compania" className="text-xs dark:text-white">COMPAÑÍA</Label>
                  <select
                    id="compania"
                    className="flex w-full h-10 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md dark:border-red-600 dark:bg-black dark:text-white"
                    value={formData.compania}
                    onChange={(e) => setFormData({ ...formData, compania: e.target.value })}
                  >
                    <option value="">Seleccionar compañía...</option>
                    <option value="entel">Entel</option>
                    <option value="movistar">Movistar</option>
                    <option value="claro">Claro</option>
                    <option value="wom">WOM</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpuSerie" className="text-xs dark:text-white">CPU - Numero de serie</Label>
                  <Input
                    id="cpuSerie"
                    placeholder="BTTN31400414"
                    value={formData.cpuSerie}
                    onChange={(e) => setFormData({ ...formData, cpuSerie: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpuModelo" className="text-xs dark:text-white">CPU - Modelo (NUC con Windows 11)</Label>
                  <Input
                    id="cpuModelo"
                    placeholder="Ej: Intel NUC 11"
                    value={formData.cpuModelo}
                    onChange={(e) => setFormData({ ...formData, cpuModelo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impresoraModelo" className="text-xs dark:text-white">Impresora - Modelo</Label>
                  <select
                    id="impresoraModelo"
                    className="flex w-full h-10 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md dark:border-red-600 dark:bg-black dark:text-white"
                    value={formData.impresoraModelo}
                    onChange={(e) => setFormData({ ...formData, impresoraModelo: e.target.value })}
                  >
                    <option value="">Seleccionar modelo...</option>
                    <option value="epson_tm_t20ii">Epson TM-T20II</option>
                    <option value="epson_tm_t88v">Epson TM-T88V</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="impresoraSN" className="text-xs dark:text-white">Impresora - S/N</Label>
                  <Input
                    id="impresoraSN"
                    placeholder="S/N (incluye cables)"
                    value={formData.impresoraSN}
                    onChange={(e) => setFormData({ ...formData, impresoraSN: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pantallaSN" className="text-xs dark:text-white">Pantalla táctil - S/N</Label>
                  <Input
                    id="pantallaSN"
                    placeholder="N° de serie pantalla"
                    value={formData.pantallaSN}
                    onChange={(e) => setFormData({ ...formData, pantallaSN: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="botonSN" className="text-xs dark:text-white">Botón - S/N</Label>
                  <Input
                    id="botonSN"
                    placeholder="N° de serie botón INTERINO APXXXX"
                    value={formData.botonSN}
                    onChange={(e) => setFormData({ ...formData, botonSN: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Sección Responsable */}
            <div className="pt-4 space-y-4 border-t">
              <h3 className="text-base font-bold">Datos del Responsable</h3>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="responsableEmpresa" className="text-xs dark:text-white">Empresa</Label>
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
                  <Label htmlFor="tecnico" className="text-xs dark:text-white">Nombre técnico</Label>
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

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="firmaTecnico" className="text-xs dark:text-white">Firma técnico</Label>
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

            {/* Sección 2: Datos de Recepción */}
            <div className="pt-4 space-y-4 border-t">
              <h3 className="text-base font-bold">Datos de Recepción</h3>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombreReceptor" className="text-xs dark:text-white">Nombre</Label>
                  <Input
                    id="nombreReceptor"
                    placeholder="Nombre completo del receptor"
                    value={formData.nombreReceptor}
                    onChange={(e) => setFormData({ ...formData, nombreReceptor: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rutReceptor" className="text-xs dark:text-white">RUT</Label>
                  <Input
                    id="rutReceptor"
                    placeholder="Ej: 12.345.678-9"
                    value={formData.rutReceptor}
                    onChange={(e) => setFormData({ ...formData, rutReceptor: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion" className="text-xs dark:text-white">Dirección</Label>
                  <Input
                    id="direccion"
                    placeholder="Dirección completa de entrega"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-xs dark:text-white">Teléfono</Label>
                  <Input
                    id="telefono"
                    placeholder="+569"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleGeneratePDF} 
                size="lg"
                className="w-full bg-gray-400 md:w-auto hover:bg-gray-500"
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
