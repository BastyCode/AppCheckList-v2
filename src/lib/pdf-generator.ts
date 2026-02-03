import jsPDF from 'jspdf'

// Función auxiliar para cargar imagen y convertir a base64
async function getImageBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      } else {
        reject('No se pudo obtener el contexto del canvas')
      }
    }
    img.onerror = () => reject('Error al cargar la imagen')
    img.src = url
  })
}

interface CheckListData {
  empresa: string
  nombreEmpresa: string
  equipo: string
  fecha: string
  responsableEmpresa: string
  nombreTecnico: string
  tecnico: string
  firmaTecnico: string
  items: Array<{ id: number; nombre: string; estado: string }>
}

interface GuiaDespachoData {
  accessPoint: string
  serieAccessPoint: string
  dongle: string
  modeloBAM: string
  compania: string
  cpuModelo: string
  impresoraSN: string
  botonSN: string
  condicion: string
  estructuraMetalica: string
  licencia: string
  bamTelefono: string
  cpuSerie: string
  impresoraModelo: string
  pantallaSN: string
  nombreReceptor: string
  rutReceptor: string
  direccion: string
  telefono: string
}

export async function generateCheckListPDF(data: CheckListData) {
  const doc = new jsPDF()
  
  const redColor: [number, number, number] = [220, 38, 38]
  const blackColor: [number, number, number] = [0, 0, 0]
  const whiteColor: [number, number, number] = [255, 255, 255]
  
  let yPos = 20

  // Agregar imagen curva decorativa si existe
  try {
    const curvaImg = await getImageBase64('/curvapdf.png')
    // Imagen en la parte superior derecha como decoración
    doc.addImage(curvaImg, 'PNG', 150, 5, 50, 30)
  } catch (error) {
    console.log('Curva PDF no encontrada, continuando sin ella')
  }

  // Logo Alert Plus
  try {
    const logoImg = await getImageBase64('/alertPlus.png')
    doc.addImage(logoImg, 'PNG', 20, yPos, 40, 15)
    yPos += 20
  } catch (error) {
    doc.setFontSize(16)
    doc.setTextColor(...redColor)
    doc.text('Alert Plus', 20, yPos)
    yPos += 15
  }
  
  // Header rojo
  doc.setFillColor(...redColor)
  doc.rect(20, yPos, 170, 15, 'F')
  doc.setFontSize(12)
  doc.setTextColor(...whiteColor)
  doc.text('SERVICIO TÉCNICO', 25, yPos + 10)
  
  yPos += 25

  // Sección Identificación Equipo
  doc.setFontSize(11)
  doc.setTextColor(...blackColor)
  doc.setFont('helvetica', 'bold')
  doc.text('Identificación Equipo', 20, yPos)
  doc.text('Responsable', 110, yPos)
  
  yPos += 8
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  
  // Columna izquierda
  doc.text(`Empresa: ${data.empresa}`, 20, yPos)
  doc.text(`Empresa: ${data.responsableEmpresa}`, 110, yPos)
  yPos += 6
  doc.text(`Nombre de empresa: ${data.nombreEmpresa}`, 20, yPos)
  doc.text(`Nombre técnico: ${data.nombreTecnico}`, 110, yPos)
  yPos += 6
  doc.text(`Equipo: ${data.equipo}`, 20, yPos)
  doc.text(`Técnico: ${data.tecnico}`, 110, yPos)
  yPos += 6
  doc.text(`Fecha: ${data.fecha}`, 20, yPos)
  
  // Agregar firma si existe
  if (data.firmaTecnico) {
    yPos += 2
    doc.text('Firma:', 110, yPos)
    
    try {
      const firmaBase64 = await getImageBase64(data.firmaTecnico)
      doc.addImage(firmaBase64, 'PNG', 110, yPos + 2, 35, 12)
      yPos += 14
    } catch (error) {
      console.error('Error al cargar firma:', error)
      yPos += 6
    }
  } else {
    yPos += 6
  }
  
  yPos += 12
  doc.setDrawColor(...redColor)
  doc.line(20, yPos, 190, yPos)
  
  // Chequeo Final
  yPos += 10
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Chequeo Final', 20, yPos)
  
  yPos += 8
  doc.setFontSize(8)
  
  // Tabla
  doc.text('N°', 22, yPos)
  doc.text('Verificación Realizada', 32, yPos)
  doc.text('Estado', 165, yPos)
  yPos += 2
  doc.setDrawColor(...redColor)
  doc.line(20, yPos, 190, yPos)
  
  yPos += 5
  doc.setFont('helvetica', 'normal')
  
  data.items.forEach((item) => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    
    doc.text(`${item.id}`, 22, yPos)
    const splitText = doc.splitTextToSize(item.nombre, 130)
    doc.text(splitText, 32, yPos)
    
    if (item.estado === 'realizado') {
      doc.setTextColor(0, 150, 0)
      doc.text('✓ Realizado', 165, yPos)
    } else {
      doc.setTextColor(255, 140, 0)
      doc.text('Pendiente', 165, yPos)
    }
    doc.setTextColor(...blackColor)
    
    yPos += Math.max(6, splitText.length * 4)
  })
  
  doc.save(`CheckList_${data.equipo}_${data.fecha}.pdf`)
}

export async function generateGuiaDespachoPDF(data: GuiaDespachoData) {
  const doc = new jsPDF()
  
  const redColor: [number, number, number] = [220, 38, 38]
  const blackColor: [number, number, number] = [0, 0, 0]
  const whiteColor: [number, number, number] = [255, 255, 255]
  
  let yPos = 20

  // Agregar imagen curva decorativa si existe
  try {
    const curvaImg = await getImageBase64('/curvapdf.png')
    // Imagen en la parte superior derecha como decoración
    doc.addImage(curvaImg, 'PNG', 150, 5, 50, 30)
  } catch (error) {
    console.log('Curva PDF no encontrada, continuando sin ella')
  }

  // Logo Alert Plus
  try {
    const logoImg = await getImageBase64('/alertPlus.png')
    doc.addImage(logoImg, 'PNG', 20, yPos, 40, 15)
    yPos += 20
  } catch (error) {
    doc.setFontSize(16)
    doc.setTextColor(...redColor)
    doc.text('Alert', 20, yPos)
    yPos += 6
    doc.text('Plus', 20, yPos)
    yPos += 10
  }
  
  // Header rojo
  doc.setFillColor(...redColor)
  doc.rect(20, yPos, 170, 15, 'F')
  doc.setFontSize(11)
  doc.setTextColor(...whiteColor)
  doc.text('AlertPlus', 25, yPos + 7)
  doc.setFontSize(9)
  doc.text('Solicitud de Guía de Despacho', 25, yPos + 12)
  
  yPos += 20

  // Sección 1: Access Point y Equipos
  doc.setFontSize(11)
  doc.setTextColor(...blackColor)
  doc.setFont('helvetica', 'bold')
  doc.text('1. Access Point y Equipos', 20, yPos)
  
  yPos += 8
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  
  const leftCol = 20
  const rightCol = 110
  
  doc.text(`Access Point: ${data.accessPoint}`, leftCol, yPos)
  doc.text(`Condición: ${data.condicion}`, rightCol, yPos)
  yPos += 6
  
  doc.text(`N° de serie AP: ${data.serieAccessPoint}`, leftCol, yPos)
  doc.text(`Estructura metálica: ${data.estructuraMetalica}`, rightCol, yPos)
  yPos += 6
  
  doc.text(`Dongle: ${data.dongle}`, leftCol, yPos)
  doc.text(`Licencia: ${data.licencia}`, rightCol, yPos)
  yPos += 6
  
  doc.text(`Modelo BAM: ${data.modeloBAM}`, leftCol, yPos)
  doc.text(`BAM Teléfono: ${data.bamTelefono}`, rightCol, yPos)
  yPos += 6
  
  doc.text(`Compañía: ${data.compania}`, leftCol, yPos)
  doc.text(`CPU Serie: ${data.cpuSerie}`, rightCol, yPos)
  yPos += 6
  
  doc.text(`CPU Modelo: ${data.cpuModelo}`, leftCol, yPos)
  doc.text(`Impresora Modelo: ${data.impresoraModelo}`, rightCol, yPos)
  yPos += 6
  
  doc.text(`Impresora S/N: ${data.impresoraSN}`, leftCol, yPos)
  doc.text(`Pantalla S/N: ${data.pantallaSN}`, rightCol, yPos)
  yPos += 6
  
  const splitBoton = doc.splitTextToSize(`Botón S/N: ${data.botonSN}`, 170)
  doc.text(splitBoton, leftCol, yPos)
  yPos += splitBoton.length * 5
  
  yPos += 5
  doc.setDrawColor(...redColor)
  doc.line(20, yPos, 190, yPos)
  
  // Sección 2: Datos de Recepción
  yPos += 10
  doc.setFont('helvetica', 'bold')
  doc.text('Datos de Recepción', 20, yPos)
  
  yPos += 8
  doc.setFont('helvetica', 'normal')
  
  doc.text(`Nombre: ${data.nombreReceptor}`, leftCol, yPos)
  doc.text(`RUT: ${data.rutReceptor}`, rightCol, yPos)
  yPos += 6
  
  doc.text(`Dirección: ${data.direccion}`, leftCol, yPos)
  doc.text(`Teléfono: ${data.telefono}`, rightCol, yPos)
  
  doc.save(`GuiaDespacho_${data.accessPoint}.pdf`)
}

export async function generateInformePDF(data: CheckListData) {
  const doc = new jsPDF()
  
  const redColor: [number, number, number] = [220, 38, 38]
  const blackColor: [number, number, number] = [0, 0, 0]
  const whiteColor: [number, number, number] = [255, 255, 255]
  
  let yPos = 20

  // Agregar imagen curva decorativa si existe
  try {
    const curvaImg = await getImageBase64('/curvapdf.png')
    // Imagen en la parte superior derecha como decoración
    doc.addImage(curvaImg, 'PNG', 150, 5, 50, 30)
  } catch (error) {
    console.log('Curva PDF no encontrada, continuando sin ella')
  }

  // Logo Alert Plus
  try {
    const logoImg = await getImageBase64('/alertPlus.png')
    doc.addImage(logoImg, 'PNG', 20, yPos, 40, 15)
    yPos += 20
  } catch (error) {
    doc.setFontSize(16)
    doc.setTextColor(...redColor)
    doc.text('Alert Plus', 20, yPos)
    yPos += 15
  }
  
  // Header rojo
  doc.setFillColor(...redColor)
  doc.rect(20, yPos, 170, 15, 'F')
  doc.setFontSize(12)
  doc.setTextColor(...whiteColor)
  doc.text('SERVICIO TÉCNICO', 25, yPos + 10)
  
  yPos += 25

  // Sección Identificación Equipo
  doc.setFontSize(11)
  doc.setTextColor(...blackColor)
  doc.setFont('helvetica', 'bold')
  doc.text('Identificación Equipo', 20, yPos)
  doc.text('Responsable', 110, yPos)
  
  yPos += 8
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  
  // Columna izquierda
  doc.text(`Empresa: ${data.empresa}`, 20, yPos)
  doc.text(`Empresa: ${data.responsableEmpresa}`, 110, yPos)
  yPos += 6
  doc.text(`Nombre de empresa: ${data.nombreEmpresa}`, 20, yPos)
  doc.text(`Nombre técnico: ${data.nombreTecnico}`, 110, yPos)
  yPos += 6
  doc.text(`Equipo: ${data.equipo}`, 20, yPos)
  doc.text(`Técnico: ${data.tecnico}`, 110, yPos)
  yPos += 6
  doc.text(`Fecha: ${data.fecha}`, 20, yPos)
  
  // Agregar firma si existe
  if (data.firmaTecnico) {
    yPos += 2
    doc.text('Firma:', 110, yPos)
    
    try {
      const firmaBase64 = await getImageBase64(data.firmaTecnico)
      doc.addImage(firmaBase64, 'PNG', 110, yPos + 2, 35, 12)
      yPos += 14
    } catch (error) {
      console.error('Error al cargar firma:', error)
      yPos += 6
    }
  } else {
    yPos += 6
  }
  
  yPos += 12
  doc.setDrawColor(...redColor)
  doc.line(20, yPos, 190, yPos)
  
  // Detalle Informe
  yPos += 10
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Detalle Informe', 20, yPos)
  
  yPos += 8
  doc.setFontSize(8)
  
  // Tabla
  doc.text('N°', 22, yPos)
  doc.text('Descripción', 32, yPos)
  doc.text('Estado', 165, yPos)
  yPos += 2
  doc.setDrawColor(...redColor)
  doc.line(20, yPos, 190, yPos)
  
  yPos += 5
  doc.setFont('helvetica', 'normal')
  
  data.items.forEach((item) => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    
    doc.text(`${item.id}`, 22, yPos)
    const splitText = doc.splitTextToSize(item.nombre, 130)
    doc.text(splitText, 32, yPos)
    
    if (item.estado === 'realizado') {
      doc.setTextColor(0, 150, 0)
      doc.text('✓ Realizado', 165, yPos)
    } else {
      doc.setTextColor(255, 140, 0)
      doc.text('Pendiente', 165, yPos)
    }
    doc.setTextColor(...blackColor)
    
    yPos += Math.max(6, splitText.length * 4)
  })
  
  doc.save(`Informe_${data.equipo}_${data.fecha}.pdf`)
}
