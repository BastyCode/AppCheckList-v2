import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer'

// Constantes de imágenes
const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
const LOGO_SRC = `${baseUrl}/alertPlus.png`
const CURVE_SRC = `${baseUrl}/curvapdf.png`

// Tipos de datos (igual que antes)
export interface CheckListData {
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

export interface GuiaDespachoData {
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
  // Datos Responsable
  empresa: string
  responsableEmpresa: string
  nombreTecnico: string
  tecnico: string
  firmaTecnico: string
  fecha: string
}

export interface ReportSection {
  id: number
  title: string
  content: string
  images: string[]
}

export interface InformeData {
  empresa: string
  nombreEmpresa: string
  equipo: string
  fecha: string
  responsableEmpresa: string
  nombreTecnico: string
  tecnico: string
  firmaTecnico: string
  sections: ReportSection[]
}

// Estilos
const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    paddingTop: 50,
    paddingLeft: 50,
    paddingRight: 56,
    paddingBottom: 40, // Espacio para el footer
    fontFamily: 'Helvetica',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  curveContainer: {
    position: 'absolute',
    right: 0,
    top: 0, // Ajustado para iniciar cerca de la fecha (sección superior)
    bottom: -19.5,
    width: 400, // Reducido para que sea una franja derecha
    zIndex: -1 
  },
  curveLeft: {
    width: '100%',
    height: '100%',
    objectFit: 'fill', // Para que estire desde arriba hasta abajo
    opacity: 0.9
  },
  // ... (otros estilos intermedios omitidos si no cambian)
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  logo: {
    width: 60,
    height: 40,
    objectFit: 'contain',
    marginRight: 20
  },
  mainTitle: {
    fontSize: 24,
    color: '#00A9CE', // Cyan
    fontWeight: 'bold',
    
  },
  subTitle: {
    fontSize: 14,
    color: '#000000',
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 14,
    color: '#000000',
    marginTop: 10, // Reducido de 15
    marginBottom: 4, // Reducido de 8
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'bold'
  },
  // Tablas
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e5e7eb', // Gray 200
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
    minHeight: 20, // Reducido minHeight si es necesario
  },
  tableRowAlternating: {
    backgroundColor: '#f9fafb', // Gray 50
  },
  tableHeader: {
    backgroundColor: '#ffffff',
  },
  tableCellLabel: {
    width: '30%',
    padding: 3, // Reducido de 6 para compactar
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'bold',
    fontSize: 10,
    color: '#000000'
  },
  tableCellValue: {
    width: '70%',
    padding: 3, // Reducido de 6 para compactar
    fontSize: 10,
    color: '#374151' // Gray 700
  },
  // Tabla Checklist específica
  checkTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#cfcfcf',
    paddingVertical: 4,
  },
  colNum: {
    width: '10%',
    textAlign: 'center',
    paddingVertical: 4
  },
  colDesc: {
    width: '70%',
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  colStatus: {
    width: '20%',
    textAlign: 'center',
    paddingVertical: 4
  },
  statusOk: {
    color: '#00A9CE', // Cyan para OK segun imagen
    fontWeight: 'bold'
  },
  statusPending: {
    color: '#DC2626', // Rojo para pendiente
  },
  // Footer
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '90%', // Aumentado para conectar con la curva
    backgroundColor: '#df1436ff', // Rojo AlertPlus
    height: 30,
    justifyContent: 'center',
    paddingLeft: 40,
    borderTopRightRadius: 0, // Eliminamos curva del footer para que se fusione mejor si hay solapamiento
  },
  footerText: {
    color: 'white',
    fontSize: 9,
    letterSpacing: 1,
  },
  // Firma
  signatureSection: {
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signatureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 40
  },
  signatureImage: {
    width: 150,
    height: 60,
    objectFit: 'contain',
    marginBottom: 8
  },
  signatureLine: {
    width: 200,
    height: 1,
    backgroundColor: '#000000',
    marginBottom: 8
  },
  signatureName: {
    fontSize: 10,
    textAlign: 'center'
  },
  signatureRole: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center'
  },
  // Images for reports
  evidenceImage: {
    width: 200,
    height: 150,
    objectFit: 'contain',
    margin: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10
  }
})

// Componentes comunes
const SharedHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <View style={[styles.headerRow, { alignItems: 'flex-start' }]}>
    <Image src={LOGO_SRC} style={styles.logo} />
    <View style={{ flex: 1, alignItems: 'center', marginRight: 60, marginTop: 15 }}>
      <Text style={styles.mainTitle}>{title}</Text>
      {subtitle && <Text style={styles.subTitle}>{subtitle}</Text>}
    </View>
  </View>
)

const Footer = () => (
  <View style={styles.footerBar} fixed>
    <Text style={styles.footerText}>Organizaciones    |    Alertas    |    www.alertplus.net</Text>
  </View>
)

const CurveDecoration = () => (
  <View style={styles.curveContainer} fixed>
    <Image src={CURVE_SRC} style={styles.curveLeft} />
  </View>
)

const SignaturePage = ({ nombre, firma }: { nombre: string, firma?: string }) => (
  <Page size="A4" style={styles.page}>
    <SharedHeader title="SERVICIO TÉCNICO" />
    
    <View style={styles.signatureSection}>
      <Text style={styles.signatureTitle}>FIRMA DE TÉCNICO</Text>
      
      {firma ? (
        <Image src={firma} style={styles.signatureImage} />
      ) : (
        <View style={{ height: 60 }} />
      )}
      
      <View style={styles.signatureLine} />
      <Text style={styles.signatureName}>{nombre}</Text>
      <Text style={styles.signatureRole}>Servicio Técnico AlertPlus</Text>
    </View>

    <CurveDecoration />
    <Footer />
  </Page>
)

// --- Documentos Específicos ---

// 1. Checklist Document
const ChecklistDocument = ({ data }: { data: CheckListData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <SharedHeader title="SERVICIO TÉCNICO" />
      
      <Text style={styles.sectionHeader}>Identificación Equipo</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellLabel}>Cliente</Text>
          <Text style={styles.tableCellValue}>{data.nombreEmpresa}</Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowAlternating]}>
          <Text style={styles.tableCellLabel}>Equipo</Text>
          <Text style={styles.tableCellValue}>{data.equipo}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellLabel}>Fecha</Text>
          <Text style={styles.tableCellValue}>{data.fecha}</Text>
        </View>
      </View>

      <Text style={styles.sectionHeader}>Responsable</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellLabel}>Empresa</Text>
          <Text style={styles.tableCellValue}>{data.responsableEmpresa}</Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowAlternating]}>
          <Text style={styles.tableCellLabel}>Nombre</Text>
          <Text style={styles.tableCellValue}>{data.nombreTecnico || data.tecnico}</Text>
        </View>
      </View>

      <Text style={styles.sectionHeader}>Chequeo Final</Text>
      <View style={styles.table}>
        <View style={[styles.checkTableRow, { backgroundColor: '#f3f3f3', borderBottomWidth: 1, borderColor: '#9aa0a6' }]}>
          <Text style={[styles.colNum, { fontWeight: 'bold', color: '#DC2626' }]}>N°</Text>
          <Text style={[styles.colDesc, { fontWeight: 'bold', color: '#DC2626' }]}>Verificación Realizada</Text>
          <Text style={[styles.colStatus, { fontWeight: 'bold', color: '#DC2626' }]}>Estado</Text>
        </View>
        
        {data.items.map((item, index) => (
          <View key={item.id} style={[styles.checkTableRow, index % 2 !== 0 ? styles.tableRowAlternating : {}]}>
            <Text style={styles.colNum}>{item.id}</Text>
            <Text style={styles.colDesc}>{item.nombre}</Text>
            <Text style={[
              styles.colStatus, 
              item.estado === 'realizado' ? styles.statusOk : styles.statusPending
            ]}>
              {item.estado === 'realizado' ? 'OK' : 'Pendiente'}
            </Text>
          </View>
        ))}
      </View>

      <CurveDecoration />
      <Footer />
    </Page>
    
    <SignaturePage nombre={data.nombreTecnico || data.tecnico} firma={data.firmaTecnico} />
  </Document>
)

// 2. Guía Despacho Document
const GuiaDespachoDocument = ({ data }: { data: GuiaDespachoData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <SharedHeader title="SERVICIO TÉCNICO" subtitle="Solicitud de Guía de Despacho" />
      
      <Text style={styles.sectionHeader}>1. Access Point y Equipos</Text>
      <View style={styles.table}>
        {[
          ['Access Point', data.accessPoint],
          ['N° de serie AP', data.serieAccessPoint],
          ['Dongle', data.dongle],
          ['Modelo BAM', data.modeloBAM],
          ['Compañía', data.compania],
          ['CPU Modelo', data.cpuModelo],
          ['CPU Serie', data.cpuSerie],
          ['Impresora Modelo', data.impresoraModelo],
          ['Impresora S/N', data.impresoraSN],
          ['Pantalla S/N', data.pantallaSN],
          ['Botón S/N', data.botonSN],
          ['Condición', data.condicion],
          ['Estructura metálica', data.estructuraMetalica],
          ['Licencia', data.licencia],
          ['BAM Teléfono', data.bamTelefono],
        ].map(([label, value], i) => (
          <View key={i} style={[styles.tableRow, i % 2 !== 0 ? styles.tableRowAlternating : {}]}>
            <Text style={styles.tableCellLabel}>{label}</Text>
            <Text style={styles.tableCellValue}>{value}</Text>
          </View>
        ))}
      </View>

      <CurveDecoration />
      <Footer />
    </Page>

    <Page size="A4" style={styles.page}>
      <SharedHeader title="SERVICIO TÉCNICO" />
      
      <Text style={styles.sectionHeader}>2. Datos de Recepción</Text>
       <View style={styles.table}>
        {[
          ['Nombre', data.nombreReceptor],
          ['RUT', data.rutReceptor],
          ['Dirección', data.direccion],
          ['Teléfono', data.telefono],
        ].map(([label, value], i) => (
          <View key={i} style={[styles.tableRow, i % 2 !== 0 ? styles.tableRowAlternating : {}]}>
            <Text style={styles.tableCellLabel}>{label}</Text>
            <Text style={styles.tableCellValue}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={{ flex: 1 }} /> 
      
      {/* Firma vacía para recepción */}
      <View style={styles.signatureSection}>
        <Text style={styles.signatureTitle}>RECIBÍ CONFORME</Text>
        <View style={{ height: 60 }} />
        <View style={styles.signatureLine} />
        <Text style={styles.signatureName}>{data.nombreReceptor}</Text>
      </View>

      <CurveDecoration /> // This was already here or similar, wait. Line 425 in read file was CurveDecoration.

      <Footer />
    </Page>

    <SignaturePage nombre={data.nombreTecnico || data.tecnico} firma={data.firmaTecnico} />
  </Document>
)

// 3. Informe Técnico Document
const InformeDocument = ({ data }: { data: InformeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <SharedHeader title="SERVICIO TÉCNICO" subtitle="Informe Técnico" />
      
      <Text style={styles.sectionHeader}>Identificación Equipo</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellLabel}>Cliente</Text>
          <Text style={styles.tableCellValue}>{data.nombreEmpresa}</Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowAlternating]}>
          <Text style={styles.tableCellLabel}>Equipo</Text>
          <Text style={styles.tableCellValue}>{data.equipo}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellLabel}>Fecha</Text>
          <Text style={styles.tableCellValue}>{data.fecha}</Text>
        </View>
      </View>

       <Text style={styles.sectionHeader}>Responsable</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellLabel}>Empresa</Text>
          <Text style={styles.tableCellValue}>AlertPlus</Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowAlternating]}>
          <Text style={styles.tableCellLabel}>Nombre</Text>
          <Text style={styles.tableCellValue}>{data.nombreTecnico || data.tecnico}</Text>
        </View>
      </View>

      <Text style={styles.sectionHeader}>Desarrollo del Informe</Text>
      {data.sections.map((section) => (
        <View key={section.id} wrap={false}>
          <Text style={[styles.sectionHeader, { color: '#DC2626', fontSize: 12 }]}>{section.title}</Text>
          {section.content && (
            <Text style={{ fontSize: 10, color: '#374151', marginBottom: 8, lineHeight: 1.5 }}>
              {section.content}
            </Text>
          )}
          
          {section.images && section.images.length > 0 && (
            <View>
              <Text style={{ fontSize: 9, color: '#6b7280', marginBottom: 4 }}>Evidencia fotográfica:</Text>
              <View style={styles.imagesGrid}>
                {section.images.map((img, i) => (
                  <Image key={i} src={img} style={styles.evidenceImage} />
                ))}
              </View>
            </View>
          )}
          <View style={{ height: 10 }} />
        </View>
      ))}

      <CurveDecoration />
      <Footer />
    </Page>

    <SignaturePage nombre={data.nombreTecnico || data.tecnico} firma={data.firmaTecnico} />
  </Document>
)

// generador de pdf para checklist
export async function generateCheckListPDF(data: CheckListData) {
  try {
    const blob = await pdf(<ChecklistDocument data={data} />).toBlob()
    // Force download by using octet-stream
    const pdfBlob = new Blob([blob], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    // Formato: Checklist - [Equipo] - [Fecha].pdf
    const safeDate = data.fecha.replace(/\//g, '-')
    const safeEquipo = data.equipo.replace(/[^a-zA-Z0-9\-\s]/g, '')
    link.download = `Checklist - ${safeEquipo} - ${safeDate}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generando PDF Checklist:', error)
    throw error // Propagar error para que el toast lo maneje
  }
}

// generador de pdf para guia de despacho
export async function generateGuiaDespachoPDF(data: GuiaDespachoData) {
  try {
    const blob = await pdf(<GuiaDespachoDocument data={data} />).toBlob()
    const pdfBlob = new Blob([blob], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    // Formato: Guia Despacho - [AccessPoint] - [Fecha].pdf
    const safeDate = data.fecha ? data.fecha.replace(/\//g, '-') : new Date().toLocaleDateString('es-CL').replace(/\//g, '-')
    const safeAP = data.accessPoint.replace(/[^a-zA-Z0-9\-\s]/g, '')
    link.download = `Guia Despacho - ${safeAP} - ${safeDate}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generando PDF Guía:', error)
    throw error // Propagar error para que el toast lo maneje
  }
}


// generador de pdf para informe técnico
export async function generateInformePDF(data: InformeData) {
  try {
    const blob = await pdf(<InformeDocument data={data} />).toBlob()
    const pdfBlob = new Blob([blob], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    // Formato: Informe Tecnico - [Equipo] - [Fecha].pdf
    const safeDate = data.fecha.replace(/\//g, '-')
    const safeEquipo = data.equipo.replace(/[^a-zA-Z0-9\-\s]/g, '')
    link.download = `Informe Tecnico - ${safeEquipo} - ${safeDate}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generando PDF Informe:', error)
    throw error // Propagar error para que el toast lo maneje
  }
}



// Certificado Access Point
export interface CertificadoData {
  empresa: string 
  fecha: string
  responsable: string
  ubicacion: string
  vigencia: string
  // Datos equipo
  accessPointName: string
  accessPointSerial: string
  actividades: string[]
  // Observaciones
  observaciones: string
  // Firma
  nombreTecnico: string
  firmaTecnico: string
}

// Estilos específicos para el certificado
const certStyles = StyleSheet.create({
  orangeHeader: {
    backgroundColor: '#ed7d31', // Naranja fuerte
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 10,
    padding: 4,
    textAlign: 'left' 
  },
  peachRow: {
    backgroundColor: '#fbe4d5', // Durazno claro para encabezados de tabla superior
  },
  lightPeachRow: {
    backgroundColor: '#fdf1e8', // Durazno muy claro/casi blanco para contenido
  },
  blueSectionTitle: {
    fontSize: 14,
    color: '#4472c4', 
    marginTop: 20,
    marginBottom: 5,
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  // Tabla superior (Fecha, Responsable...)
  topTable: {
    width: '80%', 
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: '#ed7d31'
  },
  topTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ed7d31'
  },
  topLabel: {
    width: '30%',
    padding: 4,
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#fbe4d5',
    color: '#000000'
  },
  topValue: {
    width: '70%',
    padding: 4,
    fontSize: 10,
    backgroundColor: '#fdf1e8',
    color: '#000000'
  },
  // Tabla Actividades
  activitiesTable: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: '#ed7d31', 
    marginBottom: 20
  },
  activitiesHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#ed7d31',
  },
  activitiesContentRow: {
    flexDirection: 'row',
    backgroundColor: '#fbe4d5', // Fondo general de la tabla de actividades
    minHeight: 100 
  },
  activitiesCol1: {
    width: '30%',
    padding: 8,
    borderRightWidth: 0.5,
    borderRightColor: '#ed7d31'
  },
  activitiesCol2: {
    width: '70%',
    padding: 8
  },
  actText: {
    fontSize: 10,
    marginBottom: 4,
    color: '#000000'
  }
})

// generador de pdf para certificado
const CertificadoDocument = ({ data }: { data: CertificadoData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header Personalizado para Certificado*/}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
         <Image src={LOGO_SRC} style={styles.logo} />
      </View>

      <View style={{ alignItems: 'center', marginBottom: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>CERTIFICADO ACCESSPOINT</Text>
       
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>“{data.empresa}”</Text>
      </View>

      {/* Tabla Superior */}
      <View style={certStyles.topTable}>
        <View style={certStyles.topTableRow}>
          <Text style={certStyles.topLabel}>Fecha</Text>
          <Text style={certStyles.topValue}>{data.fecha}</Text>
        </View>
        <View style={certStyles.topTableRow}>
          <Text style={certStyles.topLabel}>Responsable</Text>
          <Text style={certStyles.topValue}>{data.responsable}</Text>
        </View>
        <View style={certStyles.topTableRow}>
          <Text style={certStyles.topLabel}>Ubicación</Text>
          <Text style={certStyles.topValue}>{data.ubicacion}</Text>
        </View>
        <View style={[certStyles.topTableRow, { borderBottomWidth: 0 }]}>
          <Text style={certStyles.topLabel}>Vigencia</Text>
          <Text style={certStyles.topValue}>{data.vigencia}</Text>
        </View>
      </View>

      {/* Actividades Realizadas */}
      <Text style={certStyles.blueSectionTitle}>ACTIVIDADES REALIZADAS</Text>
      
      <View style={certStyles.activitiesTable}>
        {/* Header Tabla */}
        <View style={certStyles.activitiesHeaderRow}>
          <Text style={[certStyles.orangeHeader, { width: '30%' }]}>Equipo</Text>
          <Text style={[certStyles.orangeHeader, { width: '70%' }]}>Actividades</Text>
        </View>
        
        {/* Contenido Tabla */}
        <View style={certStyles.activitiesContentRow}>
          {/* Columna Equipo */}
          <View style={certStyles.activitiesCol1}>
            <Text style={[certStyles.actText, { fontWeight: 'bold', marginBottom: 15 }]}>
              {data.accessPointName}
            </Text>
            <Text style={[certStyles.actText, { fontWeight: 'bold' }]}>
              {data.accessPointSerial}
            </Text>
          </View>
          
          {/* Columna Actividades */}
          <View style={certStyles.activitiesCol2}>
             {data.actividades.map((act, idx) => (
                <Text key={idx} style={[certStyles.actText, { marginBottom: 8 }]}>
                  {act}
                </Text>
             ))}
          </View>
        </View>
      </View>

      {/* Observaciones */}
      <Text style={certStyles.blueSectionTitle}>OBSERVACIONES</Text>
      <Text style={{ fontSize: 10, marginTop: 10, marginBottom: 40 }}>
        {data.observaciones || 'Se certifica correcto funcionamiento de equipo arriba individualizado'}
      </Text>

      {/* Firma */}
      <View style={{ alignItems: 'center', marginTop: 10 }}>
          {data.firmaTecnico ? (
            <Image src={data.firmaTecnico} style={styles.signatureImage} />
          ) : (
            <View style={{ height: 60 }} />
          )}
          <View style={[styles.signatureLine, { backgroundColor: '#808080' }]} /> {/* Línea gris/negra */}
          <Text style={styles.signatureName}>{data.nombreTecnico}</Text>
          <Text style={styles.signatureRole}>Servicio Técnico AlertPlus</Text>
      </View>

      <CurveDecoration />
      <Footer />

    </Page>
  </Document>
)
export async function generateCertificadoPDF(data: CertificadoData) {
  try {
    const blob = await pdf(<CertificadoDocument data={data} />).toBlob()
    const pdfBlob = new Blob([blob], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    // Formato: Certificado - [AP] - [Fecha].pdf
    const safeDate = data.fecha.replace(/[^a-zA-Z0-9\-]/g, '-')
    const safeAP = data.accessPointName.replace(/[^a-zA-Z0-9\-\s]/g, '')
    link.download = `Certificado - ${safeAP} - ${safeDate}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generando PDF Certificado:', error)
    throw error // Propagar error para que el toast lo maneje
  }
}

