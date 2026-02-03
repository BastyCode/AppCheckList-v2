import { useState, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, X, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { generateInformePDF } from '@/lib/pdf-generator'
import { useTheme } from '@/components/theme-provider'

const TECNICOS = [
  { nombre: 'Christian Torrens', firma: '/firmas/firma_christian_torrens.jpeg' },
  { nombre: 'Jerson Armijo', firma: '/firmas/firma_jerson_armijo.jpeg' },
  { nombre: 'Bastian Jimenez', firma: '/firmas/firma_bastian_jimenez.jpeg' },
]

export default function Informes() {
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
    sections: [
      { id: 1, title: 'Antecedentes Generales', content: '', images: [] as string[] },
      { id: 2, title: 'Diagnóstico y Reparación', content: '', images: [] as string[] },
      { id: 3, title: 'Pruebas y Conclusiones', content: '', images: [] as string[] },
    ]
  })

  // Función para convertir archivo a Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleTecnicoChange = (tecnicoNombre: string) => {
    const tecnico = TECNICOS.find(t => t.nombre === tecnicoNombre)
    setFormData({
      ...formData,
      tecnico: tecnicoNombre,
      nombreTecnico: tecnicoNombre,
      firmaTecnico: tecnico?.firma || ''
    })
  }

  const handleSectionContentChange = (index: number, content: string) => {
    const newSections = [...formData.sections]
    newSections[index].content = content
    setFormData({ ...formData, sections: newSections })
  }

  const handleImageUpload = async (index: number, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages: string[] = []
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i]
        try {
          const base64 = await fileToBase64(file)
          newImages.push(base64)
        } catch (error) {
          console.error("Error leyendo archivo", error)
        }
      }

      const newSections = [...formData.sections]
      newSections[index].images = [...newSections[index].images, ...newImages]
      setFormData({ ...formData, sections: newSections })
      
      // Limpiar el input
      e.target.value = ''
    }
  }

  const handleRemoveImage = (sectionIndex: number, imageIndex: number) => {
    const newSections = [...formData.sections]
    newSections[sectionIndex].images = newSections[sectionIndex].images.filter((_, i) => i !== imageIndex)
    setFormData({ ...formData, sections: newSections })
  }

  const handleReset = () => {
    if (confirm('¿Está seguro que desea reiniciar el formulario?')) {
      setFormData({
        ...formData,
        sections: [
          { id: 1, title: 'Antecedentes Generales', content: '', images: [] },
          { id: 2, title: 'Diagnóstico y Reparación', content: '', images: [] },
          { id: 3, title: 'Pruebas y Conclusiones', content: '', images: [] },
        ]
      })
    }
  }

  const handleGeneratePDF = async () => {
    // Validaciones básicas
    const camposFaltantes = []
    
    // Validar solo Nombre de Empresa (Cliente) y Técnico, Equipo y Empresa interna son opcionales/fijos
    if (!formData.nombreEmpresa) camposFaltantes.push('Nombre de empresa')
    if (!formData.tecnico) camposFaltantes.push('Técnico')
    
    if (camposFaltantes.length > 0) {
      toast({
        variant: "destructive",
        title: "Campos obligatorios faltantes",
        description: `Por favor completa: ${camposFaltantes.join(', ')}`,
      })
      return
    }
    
    try {
      await generateInformePDF(formData)
      toast({
        title: "PDF generado exitosamente",
        description: `Informe creado correctamente`,
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
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-500">Informe Técnico</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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
                  <select
                    id="responsableEmpresa"
                    className="flex h-10 w-full rounded-md border border-gray-300 dark:border-red-600 bg-white dark:bg-black px-3 py-2 text-sm text-gray-900 dark:text-white"
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
                    className="flex h-10 w-full rounded-md border border-gray-300 dark:border-red-600 bg-white dark:bg-black px-3 py-2 text-sm text-gray-900 dark:text-white"
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
                       <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-red-600 rounded-md p-4 bg-gray-50/50 dark:bg-black hover:bg-gray-100 dark:hover:bg-red-900/10 transition-colors">
                        <Upload className="h-6 w-6 text-gray-500 dark:text-red-500 mb-2" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Haz click para subir la firma
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                    <div className="border border-gray-300 dark:border-red-600 rounded-md p-2 bg-gray-50 dark:bg-black flex flex-col items-center justify-center h-24 relative">
                      <img 
                        src={formData.firmaTecnico} 
                        alt="Firma" 
                        className="max-h-16 object-contain"
                      />
                      {/* Botón para borrar firma si es manual */}
                      {formData.responsableEmpresa === 'Praveni' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => setFormData(prev => ({ ...prev, firmaTecnico: '' }))}
                        >
                          X
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="border border-gray-300 dark:border-red-600 rounded-md p-2 bg-gray-50 dark:bg-black flex items-center justify-center h-20">
                      <span className="text-xs text-gray-500 dark:text-white">
                        {formData.responsableEmpresa === 'Praveni' ? 'Sube la firma' : 'Selecciona un técnico'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Secciones del Informe */}
            <div className="space-y-8 border-t pt-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Desarrollo del Informe</h2>
              
              {formData.sections.map((section, index) => (
                <div key={section.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50/50 dark:bg-gray-900/50">
                  <h3 className="font-semibold text-lg mb-4 text-red-600 dark:text-red-400">{section.title}</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`content-${section.id}`}>Descripción</Label>
                      <Textarea
                        id={`content-${section.id}`}
                        placeholder={`Escribe aquí los detalles sobre ${section.title.toLowerCase()}...`}
                        className="min-h-[120px] bg-white dark:bg-black"
                        value={section.content}
                        onChange={(e) => handleSectionContentChange(index, e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Imágenes (Evidencia)</Label>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-2">
                        {section.images.map((img, imgIndex) => (
                          <div key={imgIndex} className="relative group aspect-video bg-white dark:bg-black rounded-md border overflow-hidden">
                            <img src={img} alt={`Evidencia ${imgIndex + 1}`} className="w-full h-full object-cover" />
                            <button
                              onClick={() => handleRemoveImage(index, imgIndex)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        
                        <label className="cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md flex flex-col items-center justify-center aspect-video hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                          <Upload className="h-6 w-6 text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500">Subir imágenes</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            className="hidden" 
                            onChange={(e) => handleImageUpload(index, e)}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">Formatos: JPG, PNG, GIF. Puedes seleccionar varias imágenes a la vez.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t">
              <Button 
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Reiniciar Formulario
              </Button>
              <Button 
                onClick={handleGeneratePDF} 
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                Generar PDF Informe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
