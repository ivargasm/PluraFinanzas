# Frontend - PluraFinanzas

## Estructura del Proyecto

### Stores (Zustand)
- **authStore** (`src/app/store/Store.tsx`): Gestión de autenticación
- **workspaceStore** (`src/app/store/workspaceStore.tsx`): Gestión de workspaces
- **dataStore** (`src/app/store/dataStore.tsx`): Gestión de transacciones y categorías

### Componentes Principales
- **WorkspaceSelector**: Selector de workspace activo
- **TransactionForm**: Formulario para registrar gastos
- **TransactionList**: Lista de transacciones recientes
- **BasicChart**: Gráfico de gastos por categoría
- **CategoryManager**: Modal para gestionar categorías
- **CreateWorkspace**: Modal para crear workspaces

### Páginas
- `/auth/login` - Inicio de sesión
- `/auth/register` - Registro de usuario
- `/dashboard` - Dashboard principal

## Iniciar el Proyecto

```bash
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## Flujo de Uso

1. Registrarse o iniciar sesión
2. Crear un workspace (ej. "Familia", "Personal")
3. Crear categorías (ej. "Comida", "Transporte")
4. Registrar gastos
5. Ver estadísticas en el gráfico

## Próximos Pasos

- Página de transacciones detallada con filtros
- Gestión de miembros del workspace
- Reportes avanzados
- Integración con Telegram
