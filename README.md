# AppCheckList v2

Aplicación de escritorio para gestión de CheckLists de equipos y Guías de Despacho.

## Características

- ✅ **CheckList de Equipos**: Crea y gestiona listas de verificación con generación de PDF
- 📄 **Guía de Despacho**: Genera guías de despacho profesionales en PDF
- 🎨 **Temas Claro/Oscuro**: Cambia entre modo claro y oscuro
- 🖥️ **Multiplataforma**: Builds para Windows, macOS y Linux
- ⚡ **Tecnologías Modernas**: React + TypeScript + Electron + Vite + shadcn/ui

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

```bash
# Iniciar en modo desarrollo
npm run dev
```

## Build

```bash
# Build para Windows
npm run build:win

# Build para macOS
npm run build:mac

# Build para Linux
npm run build:linux

# Build para todas las plataformas
npm run build
```

## Estructura del Proyecto

```
AppCheckList-v2/
├── electron/           # Proceso principal de Electron
│   ├── main.ts        # Configuración principal
│   └── preload.ts     # Script de preload
├── src/
│   ├── components/    # Componentes React
│   │   ├── ui/       # Componentes de shadcn/ui
│   │   └── theme-provider.tsx
│   ├── pages/        # Páginas de la aplicación
│   │   ├── MainMenu.tsx
│   │   ├── CheckList.tsx
│   │   └── GuiaDespacho.tsx
│   ├── lib/          # Utilidades
│   │   ├── utils.ts
│   │   └── pdf-generator.ts
│   ├── App.tsx       # Componente principal
│   ├── main.tsx      # Punto de entrada
│   └── index.css     # Estilos globales
├── public/           # Recursos estáticos
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run build:win` - Build para Windows
- `npm run build:mac` - Build para macOS
- `npm run build:linux` - Build para Linux
- `npm run preview` - Preview de la build de producción

## Próximos Pasos

1. Coloca tus iconos en la carpeta `public/`:
   - `icon.ico` - Para Windows
   - `icon.icns` - Para macOS
   - `icon.png` - Para Linux

2. Personaliza los formularios según tus necesidades específicas

3. Ajusta la generación de PDFs con tu formato preferido

## Licencia

Privado
