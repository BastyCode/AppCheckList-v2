
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { startPdfCountdown, showErrorToast } from '@/lib/toast-utils' 
import { generateCertificadoPDF, CertificadoData } from '@/lib/pdf-generator'
import { useTheme } from '@/components/theme-provider'

const TECNICOS = [
  { nombre: 'Christian Torrens', firma: `${import.meta.env.BASE_URL}firmas/firma_christian_torrens.jpeg` },
  { nombre: 'Jerson Armijo', firma: `${import.meta.env.BASE_URL}firmas/firma_jerson_armijo.jpeg` },
  { nombre: 'Bastian Jimenez', firma: `${import.meta.env.BASE_URL}firmas/firma_bastian_jimenez.jpeg` },
]




export default function Certificados() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  // const { toast } = useToast()


  const [formData, setFormData] = useState<CertificadoData>({
    empresa: '', 
    fecha: new Date().toLocaleDateString('es-CL'), // Format like '14 Noviembre 2024' manually or let user edit
    responsable: '',
    ubicacion: '',
    vigencia: '',
    accessPointName: '',
    accessPointSerial: '',
    actividades: [''], // Start with one empty activity
    observaciones: '',
    nombreTecnico: '',
    firmaTecnico: ''
  })

  // To handle manual date input if preferred
  const [dateInput, setDateInput] = useState(new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }))

  const handleTecnicoChange = (tecnicoNombre: string) => {
    const tecnico = TECNICOS.find(t => t.nombre === tecnicoNombre)
    if (tecnico) {
      setFormData({
        ...formData,
        nombreTecnico: tecnico.nombre,
        firmaTecnico: tecnico.firma,
        responsable: tecnico.nombre // Usually responsible matches tech?
      })
    } else {
        // Custom or manual
        setFormData({
            ...formData,
            nombreTecnico: tecnicoNombre,
            firmaTecnico: '',
            responsable: tecnicoNombre
        })
    }
  }

  const handleActivityChange = (index: number, value: string) => {
    const newActivities = [...formData.actividades]
    newActivities[index] = value
    setFormData({ ...formData, actividades: newActivities })
  }

  const addActivity = () => {
    setFormData({ ...formData, actividades: [...formData.actividades, ''] })
  }

  const removeActivity = (index: number) => {
    const newActivities = formData.actividades.filter((_, i) => i !== index)
    setFormData({ ...formData, actividades: newActivities })
  }
  
  const handleGeneratePDF = async () => {
    if (!formData.accessPointSerial) {
        showErrorToast("Falta número de serie. Por favor ingrésalo.")
        return
    }

    // Use countdown utility
    await startPdfCountdown(async () => {
        const finalData = { ...formData, fecha: dateInput }
        await generateCertificadoPDF(finalData)
    })
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Header Navigation */}
         <div className="mb-6">
           <div className="mb-4">
             <img 
               src={`${import.meta.env.BASE_URL}alertPlus.png`} 
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

         <div className="mb-6 border border-gray-200 bg-white rounded-lg p-6 dark:border-red-600 dark:bg-black">
           <h1 className="text-3xl font-bold text-orange-500">Certificado AccessPoint</h1>
         </div>

         <Card className="border border-gray-200 dark:border-red-600 bg-white dark:bg-black">
            <CardHeader className="p-0">
               <div className="bg-orange-500 text-white pl-8 pr-4 py-4 rounded-t-[12px]">
                 <h2 className="text-lg font-bold">Datos del Certificado</h2>
               </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                
                {/* Top Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Empresa</Label>
                        <Input 
                            value={formData.empresa}
                            onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                            className="border-orange-200 focus-visible:ring-orange-500"
                            placeholder="Ej: ESACHS"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Fecha</Label>
                        <Input 
                            value={dateInput}
                            onChange={(e) => setDateInput(e.target.value)}
                            className="border-orange-200 focus-visible:ring-orange-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Responsable / Técnico</Label>
                         <select
                            className="flex h-10 w-full rounded-md border border-orange-200 bg-white dark:bg-black px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                            value={formData.nombreTecnico}
                            onChange={(e) => handleTecnicoChange(e.target.value)}
                         >
                            <option value="">Selecciona un técnico</option>
                            {TECNICOS.map(t => (
                                <option key={t.nombre} value={t.nombre}>{t.nombre}</option>
                            ))}
                         </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Ubicación</Label>
                        <Input 
                            value={formData.ubicacion}
                            onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                            className="border-orange-200 focus-visible:ring-orange-500"
                            placeholder="Ej: DRT 45"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Vigencia</Label>
                        <Input 
                            value={formData.vigencia}
                            onChange={(e) => setFormData({...formData, vigencia: e.target.value})}
                            className="border-orange-200 focus-visible:ring-orange-500"
                            placeholder="Ej: 6 Meses"
                        />
                    </div>
                </div>

                <div className="border-t border-orange-100 my-4" />

                {/* Equipment Data */}
                <h3 className="font-bold text-orange-600">Datos Equipo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Nombre Access Point</Label>
                        <Input 
                            value={formData.accessPointName}
                            onChange={(e) => setFormData({...formData, accessPointName: e.target.value})}
                            className="border-orange-200 focus-visible:ring-orange-500"
                            placeholder="Ej: AccessPoint"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>N° Serie (S/N)</Label>
                        <Input 
                            value={formData.accessPointSerial}
                            onChange={(e) => setFormData({...formData, accessPointSerial: e.target.value})}
                            placeholder="Ej: 767000000388"
                            className="border-orange-200 focus-visible:ring-orange-500"
                        />
                    </div>
                </div>

                 <div className="border-t border-orange-100 my-4" />

                 {/* Activities */}
                 <div className="flex justify-between items-center">
                    <h3 className="font-bold text-orange-600">Actividades Realizadas</h3>
                    <Button 
                        size="sm" 
                        onClick={addActivity} 
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-sm"
                    >
                        <Plus className="h-4 w-4 mr-2" /> 
                        AGREGAR ACTIVIDAD
                    </Button>
                 </div>
                 
                 <div className="space-y-3">
                    {formData.actividades.map((act, idx) => (
                        <div key={idx} className="flex gap-2">
                            <Input 
                                value={act}
                                onChange={(e) => handleActivityChange(idx, e.target.value)}
                                className="border-orange-200 focus-visible:ring-orange-500"
                                placeholder={idx === 0 ? "Agrega actividad aquí (ej. Equipo Nuevo)" : "Descripción de actividad"}
                            />
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeActivity(idx)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                title="Borrar línea"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {formData.actividades.length === 0 && (
                        <div className="text-center py-4 text-gray-500 italic border border-dashed border-gray-300 rounded-md">
                            No hay actividades. Pulsa "Agregar Actividad" para comenzar.
                        </div>
                    )}
                 </div>

                 <div className="border-t border-orange-100 my-4" />

                 {/* Observations */}
                 <h3 className="font-bold text-orange-600">Observaciones</h3>
                 <Textarea 
                    value={formData.observaciones}
                    onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                    placeholder="Se certifica correcto funcionamiento de equipo arriba individualizado"
                    className="border-orange-200 focus-visible:ring-orange-500 min-h-[100px]"
                 />

                 {/* Generate Button */}
                 <div className="pt-6 flex justify-end">
                    <Button 
                        onClick={handleGeneratePDF}
                        className="bg-orange-500 hover:bg-orange-600 text-white w-full md:w-auto"
                        size="lg"
                    >
                        Generar Certificado PDF
                    </Button>
                 </div>

            </CardContent>
         </Card>
      </div>
    </div>
  )
}
