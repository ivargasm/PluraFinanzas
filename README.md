# PluraFinanzas Frontend

Frontend web desarrollado con **Next.js 15**, **TypeScript** y **Tailwind CSS** para el sistema de gestión financiera personal con interfaz responsive y soporte para múltiples workspaces.

## 🚀 Características

- ✅ Autenticación JWT con roles
- ✅ Dashboard interactivo con gráficos
- ✅ Gestión de transacciones
- ✅ Categorías personalizables
- ✅ Transacciones recurrentes
- ✅ Múltiples workspaces
- ✅ Invitación de miembros
- ✅ Gestión de suscripción (Stripe)
- ✅ Exportación a CSV
- ✅ Reportes avanzados
- ✅ Integración con bot Telegram
- ✅ Insights con IA
- ✅ Diseño responsive (mobile-first)
- ✅ Modo oscuro/claro

## 📋 Requisitos Previos

- Node.js 18+ (con npm o yarn)
- Backend API en ejecución (http://localhost:8000)

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/ivargasm/plurafinanzas-frontend.git
cd plurafinanzas-frontend
```

### 2. Instalar dependencias

```bash
npm install
# o con yarn
yarn install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Stripe (público, es seguro mostrar)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key

# URLs de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🏃 Ejecutar el servidor

### Desarrollo

```bash
npm run dev
# o con yarn
yarn dev
```

La aplicación estará disponible en: `http://localhost:3000`

### Producción

```bash
# Construir
npm run build

# Iniciar servidor
npm run start
```

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                # Página de inicio
│   │   ├── layout.tsx              # Layout principal
│   │   ├── globals.css             # Estilos globales
│   │   ├── auth/                   # Autenticación
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── dashboard/              # Dashboard principal
│   │   │   ├── page.tsx           # Panel principal
│   │   │   ├── transactions/      # Transacciones
│   │   │   ├── reports/           # Reportes
│   │   │   └── settings/          # Configuración
│   │   ├── pricing/                # Página de precios
│   │   ├── profile/                # Perfil de usuario
│   │   ├── payment/                # Checkout
│   │   ├── checkout-success/       # Confirmación de pago
│   │   ├── link-telegram/          # Vinculación Telegram
│   │   ├── privacy/                # Política de privacidad
│   │   ├── terms/                  # Términos de servicio
│   │   ├── components/             # Componentes reutilizables
│   │   │   ├── BasicChart.tsx
│   │   │   ├── BudgetOverview.tsx
│   │   │   ├── CategoryManager.tsx
│   │   │   ├── MemberManager.tsx
│   │   │   ├── RecurringManager.tsx
│   │   │   ├── WorkspaceSelector.tsx
│   │   │   ├── WorkspaceSettings.tsx
│   │   │   ├── InsightsPanel.tsx
│   │   │   ├── TelegramLinkModal.tsx
│   │   │   ├── UpgradeModal.tsx
│   │   │   ├── CreateWorkspace.tsx
│   │   │   ├── DateFilter.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   ├── usePremiumCheck.ts  # Hook para validar premium
│   │   │   └── ...
│   │   ├── store/
│   │   │   ├── Store.tsx           # Auth store (Zustand)
│   │   │   ├── workspaceStore.tsx  # Workspace store (Zustand)
│   │   │   └── dataStore.tsx       # Data store (Zustand)
│   │   └── lib/
│   │       ├── api.tsx             # Funciones API
│   │       ├── constants.ts        # Constantes
│   │       └── utils.ts            # Utilidades
│   └── components/
│       └── ui/                     # Componentes shadcn/ui
├── public/                          # Archivos estáticos
├── package.json                     # Dependencias
├── tsconfig.json                    # Configuración TypeScript
├── next.config.ts                   # Configuración Next.js
├── tailwind.config.ts               # Configuración Tailwind
├── postcss.config.mjs               # Configuración PostCSS
└── eslint.config.mjs               # Configuración ESLint
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar servidor producción
npm run start

# Linting
npm run lint

# Linting con fix
npm run lint:fix
```

## 🎨 Stack Tecnológico

| Tecnología | Descripción |
|------------|-------------|
| **Next.js 15** | Framework React moderno |
| **TypeScript** | Lenguaje tipado |
| **Tailwind CSS** | Utilidades CSS |
| **shadcn/ui** | Componentes UI de calidad |
| **Zustand** | Gestión de estado |
| **Recharts** | Gráficos y visualización |
| **Sonner** | Notificaciones toast |
| **Stripe.js** | Pagos en línea |

## 🔐 Autenticación

El frontend utiliza JWT almacenado en cookies httpOnly:

1. Usuario inicia sesión
2. Backend devuelve JWT en cookie
3. Cookies se envían automáticamente en cada request
4. Frontend accede a datos del usuario mediante `/auth/me`

## 💳 Modelo de Monetización

### Plan Free
- ✅ 1 workspace
- ✅ 2 miembros
- ✅ Funciones básicas

### Plan Premium ($9.99/mes)
- ✅ Workspaces ilimitados
- ✅ Miembros ilimitados
- ✅ Exportar a CSV
- ✅ Reportes avanzados
- ✅ Insights con IA
- ✅ Bot Telegram

### Modelo Híbrido
- Usuario Premium puede compartir acceso premium con miembros en su workspace
- Miembros invitados acceden a premium si: usuario es Premium O workspace es Premium

## 📱 Responsive Design

- **Mobile** (<640px): Stack vertical, botones compactos, 1 columna
- **Tablet** (640px-1024px): Layout flexible, 2 columnas
- **Desktop** (>1024px): Layout completo, múltiples columnas

## 🚀 Deployment

### Vercel (Recomendado)

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm run build
# Sube la carpeta `.next` o usa Netlify CLI
```

### Docker

```bash
docker build -t plurafinanzas-frontend:latest .
docker run -p 3000:3000 plurafinanzas-frontend:latest
```

## 📝 Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `NEXT_PUBLIC_API_URL` | URL de la API backend | Sí |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave pública Stripe | Sí (pagos) |
| `NEXT_PUBLIC_APP_URL` | URL de la aplicación | No |

## 🧪 Testing

Ejecutar tests:

```bash
npm run test
```

Con cobertura:

```bash
npm run test:coverage
```

## 🎯 Características Principales

### Dashboard
- Resumen de transacciones
- Gráficos de gastos por categoría
- Presupuesto mensual
- Últimas transacciones

### Transacciones
- CRUD de transacciones
- Filtrado por categoría, fecha, descripción
- Exportar a CSV (Premium)
- Búsqueda avanzada

### Workspaces
- Crear múltiples workspaces
- Invitar miembros por email
- Gestionar roles (owner, member)
- Heredar plan premium

### Reportes
- Resumen mensual
- Tendencia anual
- Análisis por categoría
- Insights de IA

### Cuenta
- Perfil de usuario
- Gestión de suscripción
- Cancelar plan
- Vincular Telegram

## 🐛 Troubleshooting

### Error: CORS issue
- Verifica que `NEXT_PUBLIC_API_URL` sea correcto
- Asegúrate que el backend tiene CORS habilitado

### Error: 401 Unauthorized
- El token JWT ha expirado
- Inicia sesión nuevamente
- Limpia cookies del navegador

### Error: 403 Forbidden
- No tienes acceso a ese recurso
- Verifica permisos del workspace
- Suscríbete a Premium si es necesario

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Ivar García S.**

## 📞 Soporte

Para reportar bugs o solicitar features, abre un issue en el repositorio.

---

**Última actualización:** 17 de noviembre de 2025
