/**
 * Components Index
 * 
 * Centralized export of all components for clean imports and tree shaking
 */

// Layout Components
export { default as MainLayout } from '../layouts/MainLayout'

// Core Components
export { default as Sidebar } from './Sidebar'
export { default as Navbar } from './Navbar'

// UI Components
export { default as CustomButton } from './ui/CustomButton'
export { default as CustomInput } from './ui/CustomInput'
export { default as StatCard } from './ui/StatCard'
export { default as ChartCard } from './ui/ChartCard'
export { default as SearchBar } from './ui/SearchBar'
export { 
  default as Badge, 
  StatusBadge, 
  CountBadge 
} from './ui/Badge'
export { 
  default as Loader, 
  PageLoader, 
  InlineLoader, 
  ButtonLoader 
} from './ui/Loader'
export { 
  default as Modal, 
  ConfirmModal, 
  AlertModal 
} from './ui/Modal'
export { default as Table } from './ui/Table'
export { 
  default as EmptyState, 
  NoDataState, 
  NoSearchState, 
  NoFilterState, 
  ErrorState, 
  EmptyTableState, 
  EmptyUsersState, 
  EmptyProductsState 
} from './ui/EmptyState'
export { 
  default as PageHeader, 
  DashboardHeader, 
  SettingsHeader, 
  FormHeader 
} from './ui/PageHeader'
export { 
  default as ResponsiveForm, 
  ResponsiveFormGroup, 
  ResponsiveFormActions 
} from './ui/ResponsiveForm'
export { 
  default as ResponsiveGrid, 
  ResponsiveGridItem, 
  GridPresets, 
  KPIGrid, 
  FormGrid, 
  GalleryGrid, 
  ContentGrid, 
  DataGrid 
} from './ui/ResponsiveGrid'

// Page Components
export { default as SaasDashboard } from '../pages/SaasDashboard'

// Re-export for convenience
export * from './ui'
