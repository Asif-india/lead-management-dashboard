# UI Components Library

A comprehensive set of reusable React components built with Tailwind CSS and Framer Motion for modern dashboard applications.

## Components Overview

### 🎯 Core Components

#### CustomButton
A versatile button component with multiple variants, sizes, and loading states.

```jsx
import { CustomButton } from '@/components/ui'

<CustomButton
  variant="primary"
  size="md"
  loading={false}
  leftIcon={<PlusIcon />}
  onClick={handleClick}
>
  Click me
</CustomButton>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `loading`: boolean
- `disabled`: boolean
- `fullWidth`: boolean
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode

#### CustomInput
A flexible input component with validation states, icons, and password toggle.

```jsx
import { CustomInput } from '@/components/ui'

<CustomInput
  type="email"
  label="Email Address"
  placeholder="Enter your email"
  required
  errorText={error}
  leftIcon={<MailIcon />}
  value={value}
  onChange={handleChange}
/>
```

**Props:**
- `variant`: 'outline' | 'filled' | 'flushed' | 'unstyled'
- `size`: 'sm' | 'md' | 'lg'
- `type`: 'text' | 'email' | 'password' | 'search' | 'number' | 'tel'
- `label`: string
- `errorText`: string
- `helperText`: string
- `required`: boolean
- `showPasswordToggle`: boolean

#### StatCard
Statistics card with icon, value, trend indicator, and description.

```jsx
import { StatCard } from '@/components/ui'

<StatCard
  title="Total Users"
  value="1,234"
  change="+12.5%"
  trend="up"
  icon={UsersIcon}
  iconColor="from-blue-500 to-cyan-600"
  description="Active users this month"
/>
```

**Props:**
- `title`: string
- `value`: string | number
- `change`: string
- `trend`: 'up' | 'down' | 'neutral'
- `icon`: ReactNode
- `iconColor`: string (Tailwind gradient)
- `loading`: boolean

#### ChartCard
Container component for charts with header, controls, and loading states.

```jsx
import { ChartCard } from '@/components/ui'

<ChartCard
  title="Revenue Overview"
  subtitle="Monthly revenue trends"
  chartType="line"
  showRefresh={true}
  onRefresh={handleRefresh}
>
  <LineChart data={data} />
</ChartCard>
```

**Props:**
- `title`: string
- `subtitle`: string
- `chartType`: 'bar' | 'line' | 'pie' | 'area'
- `loading`: boolean
- `showRefresh`: boolean
- `showDownload`: boolean

#### SearchBar
Advanced search bar with suggestions, recent searches, and keyboard navigation.

```jsx
import { SearchBar } from '@/components/ui'

<SearchBar
  placeholder="Search users..."
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  suggestions={suggestions}
  recentSearches={recentSearches}
/>
```

**Props:**
- `placeholder`: string
- `suggestions`: string[]
- `recentSearches`: string[]
- `showSuggestions`: boolean
- `loading`: boolean
- `fullWidth`: boolean

#### Badge
Flexible badge component with multiple variants and interactive features.

```jsx
import { Badge, StatusBadge, CountBadge } from '@/components/ui'

<Badge variant="success" size="md">
  Active
</Badge>

<StatusBadge status="online" />
<CountBadge count={5} max={99} />
```

**Props:**
- `variant`: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
- `size`: 'xs' | 'sm' | 'md' | 'lg'
- `dismissible`: boolean
- `dot`: boolean
- `pulse`: boolean

#### Loader
Loading component with multiple animation variants.

```jsx
import { Loader, PageLoader, InlineLoader } from '@/components/ui'

<Loader variant="spinner" size="md" text="Loading..." />
<PageLoader text="Loading dashboard..." />
<InlineLoader size="sm" />
```

**Props:**
- `variant`: 'spinner' | 'dots' | 'pulse' | 'bars' | 'wave'
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `color`: 'primary' | 'secondary' | 'white' | 'current'
- `overlay`: boolean
- `text`: string

#### Modal
Versatile modal component with multiple variants and accessibility features.

```jsx
import { Modal, ConfirmModal, AlertModal } from '@/components/ui'

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Action"
  size="md"
  variant="confirm"
>
  <p>Are you sure you want to proceed?</p>
</Modal>

<ConfirmModal
  isOpen={showConfirm}
  onClose={handleClose}
  onConfirm={handleConfirm}
  message="Delete this item?"
/>
```

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `variant`: 'default' | 'alert' | 'confirm' | 'info'
- `closeOnOverlayClick`: boolean
- `closeOnEscape`: boolean

#### Table
Advanced table component with sorting, filtering, pagination, and selection.

```jsx
import { Table } from '@/components/ui'

<Table
  columns={columns}
  data={data}
  sortable={true}
  filterable={true}
  selectable={true}
  paginated={true}
  pageSize={10}
  onRowClick={handleRowClick}
/>
```

**Props:**
- `columns`: ColumnConfig[]
- `data`: any[]
- `sortable`: boolean
- `filterable`: boolean
- `selectable`: boolean
- `paginated`: boolean
- `pageSize`: number

#### EmptyState
Empty state component with multiple variants and illustrations.

```jsx
import { EmptyState, NoDataState, NoSearchState } from '@/components/ui'

<EmptyState
  variant="no-data"
  title="No users found"
  description="Create your first user to get started"
  actionText="Add User"
  onAction={handleAddUser}
/>
```

**Props:**
- `variant`: 'no-data' | 'no-search' | 'no-filter' | 'error' | 'loading'
- `title`: string
- `description`: string
- `icon`: ReactNode
- `actionText`: string
- `onAction`: function

#### PageHeader
Comprehensive page header with breadcrumbs, actions, and navigation.

```jsx
import { PageHeader, DashboardHeader, FormHeader } from '@/components/ui'

<PageHeader
  title="User Management"
  subtitle="Manage your team members"
  breadcrumbs={[
    { label: 'Dashboard', href: '/admin' },
    { label: 'Users' }
  ]}
  actions={[
    { label: 'Add User', onClick: handleAdd, variant: 'primary' }
  ]}
/>
```

**Props:**
- `title`: string
- `subtitle`: string
- `breadcrumbs`: BreadcrumbItem[]
- `actions`: ActionItem[]
- `showBackButton`: boolean
- `showSearch`: boolean
- `sticky`: boolean

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (from-blue-500 to-purple-600)
- **Success**: Green (text-green-400, bg-green-500/10)
- **Warning**: Yellow (text-yellow-400, bg-yellow-500/10)
- **Error**: Red (text-red-400, bg-red-500/10)
- **Neutral**: Slate palette (text-slate-300, bg-slate-800/50)

### Typography
- **Headings**: font-bold, gradient text for main titles
- **Body**: text-white for primary, text-slate-300 for secondary
- **Helper**: text-slate-400 for descriptions

### Spacing
- **Cards**: p-6 (24px padding)
- **Components**: Consistent spacing using Tailwind classes
- **Responsive**: Adaptive layouts with proper breakpoints

### Animations
- **Entrance**: fade-in with slight upward movement
- **Hover**: scale and shadow effects
- **Loading**: smooth transitions and spinners
- **Micro-interactions**: button press feedback

## 🚀 Usage Examples

### Dashboard Layout
```jsx
import { PageHeader, StatCard, ChartCard, CustomButton } from '@/components/ui'

function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back to your dashboard"
        showSearch={true}
        actions={[
          { label: 'New Report', onClick: handleNewReport, variant: 'primary' }
        ]}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Revenue" value="$45,231" change="+12.5%" trend="up" />
        <StatCard title="Users" value="1,234" change="+5.2%" trend="up" />
        <StatCard title="Orders" value="456" change="-2.1%" trend="down" />
        <StatCard title="Growth" value="23.5%" change="+3.2%" trend="up" />
      </div>
      
      <ChartCard title="Analytics" chartType="line">
        <LineChart data={analyticsData} />
      </ChartCard>
    </div>
  )
}
```

### Form with Validation
```jsx
import { CustomInput, CustomButton, PageHeader } from '@/components/ui'

function UserForm() {
  return (
    <div>
      <PageHeader
        title="Add User"
        subtitle="Create a new user account"
        showBackButton={true}
      />
      
      <form onSubmit={handleSubmit}>
        <CustomInput
          label="Full Name"
          placeholder="Enter full name"
          required
          errorText={errors.name}
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        
        <CustomInput
          type="email"
          label="Email Address"
          placeholder="Enter email"
          required
          errorText={errors.email}
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        
        <CustomButton
          type="submit"
          variant="primary"
          loading={isSubmitting}
          fullWidth
        >
          Create User
        </CustomButton>
      </form>
    </div>
  )
}
```

## 🛠️ Development Guidelines

### Component Structure
1. **Props Documentation**: Clear JSDoc comments for all props
2. **Variants**: Use consistent variant patterns across components
3. **Accessibility**: Include proper ARIA labels and keyboard navigation
4. **Responsive**: Mobile-first approach with proper breakpoints
5. **Animation**: Subtle, purposeful animations using Framer Motion

### Best Practices
- Use forwardRef for input components
- Implement proper focus management
- Include loading states for async operations
- Provide clear error states and messages
- Use semantic HTML elements
- Test with keyboard navigation
- Ensure proper color contrast

### Customization
- Extend variants using Tailwind CSS classes
- Override styles through className prop
- Use motionProps for custom animations
- Compose components for complex UI patterns

## 📦 Installation

All components are built with:
- **React 18+**: Modern React with hooks
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Lucide React**: Consistent icon set

```bash
npm install framer-motion lucide-react
```

## 🤝 Contributing

When adding new components:
1. Follow the established prop patterns
2. Include comprehensive JSDoc documentation
3. Add responsive variants
4. Implement proper accessibility
5. Include loading and error states
6. Add examples to the documentation

## 📄 License

This component library is part of the LeadGen Pro dashboard application.
