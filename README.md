# AppCheckList v2

Aplicación Web para la gestión de CheckLists de equipos, Informes Técnicos y Guías de Despacho.

> **Nota**: Este proyecto comenzó como una aplicación de escritorio (Electron), pero ha evolucionado a una **Aplicación Web** estándar. Se han eliminado los componentes de escritorio para optimizar el rendimiento y la mantenibilidad.

## Características

- ✅ **CheckList de Equipos**: Listas de verificación interactivas para validación técnica.
- 📄 **Guía de Despacho**: Generación de documentos de traslado.
- 📝 **Informes Técnicos**: Creación de informes detallados con evidencia fotográfica.
- 📜 **Certificados**: Emisión de certificados de operatividad de Access Points.
- 🎨 **Temas Claro/Oscuro**: Interfaz adaptable con estética moderna (Rojo/Negro/Blanco).
- � **Responsiva**: Funciona en tablets, laptops y desktop.
- ⚡ **Tecnologías**: React + TypeScript + Vite + TailwindCSS + shadcn/ui.

## Colores del Tema

### Modo Claro (Predeterminado)

- Fondo: Blanco
- Botones y detalles: Rojo (#DC2626)
- Texto: Negro

### Modo Oscuro

- Fondo: Negro
- Botones y detalles: Rojo (#DC2626)
- Texto: Blanco

## Requisitos

- Node.js 18+
- npm o yarn

## Instalación

```bash
# Instalar dependencias
npm install
```

## Desarrollo

Para iniciar el servidor de desarrollo local:

```bash
# Iniciar aplicación web
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Build (Producción)

Para generar la versión optimizada para web:

```bash
# Construir para web
npm run build
```

Los archivos estáticos se generarán en la carpeta `dist/`, listos para ser desplegados en cualquier servidor web (Vercel, Netlify, Nginx, etc.).

## Estructura del Proyecto

```
AppCheckList-v2/
├── src/
│   ├── components/    # Componentes React reutilizables
│   │   ├── ui/        # Biblioteca de componentes (shadcn/ui)
│   ├── pages/         # Vistas principales (CheckList, Informes, etc.)
│   ├── lib/           # Utilidades y Lógica de Negocio
│   │   ├── pdf-generator.tsx # Generación de documentos PDF
│   │   └── toast-utils.tsx   # Sistema de notificaciones
│   ├── App.tsx        # Router y Layout principal
│   └── index.css      # Estilos globales y temas
├── public/            # Recursos estáticos (imágenes, logos)
├── package.json       # Dependencias y scripts
└── vite.config.ts     # Configuración de Vite
```

## Próximos Pasos

1. **Despliegue Web**: Subir la carpeta `dist/` a un hosting estático.
2. **Iconos**: Personalizar `public/favicon.ico` para la pestaña del navegador.
3. **PWA (Opcional)**: Configurar VitePWA si se desea instalar como aplicación en dispositivos móviles.

## Licencia

Privado
