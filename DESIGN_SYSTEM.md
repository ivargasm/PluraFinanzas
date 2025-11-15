# Sistema de Diseño PluraFinanzas

## Paleta de Colores

### Light Mode
- **Teal Principal**: `#2B7A8B` - Botones primarios, enlaces
- **Teal Oscuro**: `#1E6B7B` - Hover states
- **Mint**: `#7DD3C0` - Botones secundarios, acentos
- **Mint Claro**: `#A8E6CF` - Backgrounds suaves
- **Coral**: `#FF6B6B` - Acciones destructivas, CTAs
- **Coral Hover**: `#FF5252` - Hover de coral

### Dark Mode
- **Background**: `#1E3A4C` - Fondo principal
- **Cards**: `#2B4A5C` - Tarjetas y contenedores
- **Mint**: `#7DD3C0` - Botones primarios
- **Teal**: `#2B7A8B` - Botones secundarios
- **Coral Claro**: `#FF8585` - Acciones destructivas

## Clases de Botones Recomendadas

### Botón Primario (CTA Principal)
```tsx
className="bg-coral-500 hover:bg-coral-600 text-white px-6 py-2 rounded-lg font-medium transition shadow-md hover:shadow-lg"
```

### Botón Secundario (Acciones Comunes)
```tsx
className="bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition-colors font-medium"
```

### Botón Terciario (Acciones Suaves)
```tsx
className="bg-mint-500 text-teal-900 px-4 py-2 rounded-lg hover:bg-mint-400 transition-colors font-medium"
```

### Botón Destructivo
```tsx
className="bg-coral-500 hover:bg-coral-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
```

### Botón Outline
```tsx
className="border-2 border-teal-700 text-teal-700 dark:border-mint-500 dark:text-mint-500 px-4 py-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900 transition-colors font-medium"
```

### Botón Ghost
```tsx
className="text-teal-700 dark:text-mint-500 px-4 py-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900 transition-colors"
```

## Contraste y Accesibilidad

### ✅ Combinaciones Aprobadas
- `bg-teal-700` + `text-white` (Ratio: 7.2:1)
- `bg-mint-500` + `text-teal-900` (Ratio: 6.8:1)
- `bg-coral-500` + `text-white` (Ratio: 4.8:1)
- `bg-teal-900` + `text-white` (Ratio: 12.5:1)

### ❌ Evitar
- `bg-mint-400` + `text-white` (Bajo contraste)
- `bg-teal-200` + `text-white` (Bajo contraste)
- Variables CSS genéricas como `bg-primary` sin especificar foreground

## Componentes UI

### Cards
```tsx
className="bg-white dark:bg-teal-900 border border-gray-200 dark:border-teal-800 rounded-lg shadow-sm"
```

### Inputs
```tsx
className="border border-gray-300 dark:border-teal-700 bg-white dark:bg-teal-900 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
```

### Badges
```tsx
// Success
className="bg-mint-500 text-teal-900 px-2 py-1 rounded-full text-xs font-medium"

// Warning
className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium"

// Error
className="bg-coral-500 text-white px-2 py-1 rounded-full text-xs font-medium"
```

## Tipografía

### Headings
- H1: `text-4xl font-bold text-teal-900 dark:text-white`
- H2: `text-3xl font-bold text-teal-900 dark:text-white`
- H3: `text-2xl font-semibold text-teal-900 dark:text-white`

### Body
- Normal: `text-gray-700 dark:text-teal-100`
- Muted: `text-gray-500 dark:text-teal-300`

## Espaciado

- Padding contenedores: `px-4 py-6` o `px-6 py-8`
- Gap entre elementos: `gap-4` o `gap-6`
- Margin entre secciones: `mb-6` o `mb-8`

## Sombras

- Suave: `shadow-sm`
- Normal: `shadow-md`
- Elevada: `shadow-lg`
- Hover: `hover:shadow-xl`
