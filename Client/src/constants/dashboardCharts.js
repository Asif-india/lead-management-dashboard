/**
 * Dashboard Chart Constants
 *
 * Reusable configuration constants for dashboard charts.
 * Extracted from SaasDashboard.jsx for better maintainability.
 */

// Line Chart Colors
export const LINE_CHART_COLORS = {
  total: '#3b82f6',      // Blue
  converted: '#10b981', // Green
  pending: '#f59e0b'    // Amber
}

// Line Chart Configuration
export const LINE_CHART_CONFIG = {
  strokeWidth: 3,
  dotRadius: 6,
  activeDotRadius: 8,
  type: 'monotone'
}

// Bar Chart Configuration
export const BAR_CHART_CONFIG = {
  fill: '#8b5cf6',  // Purple
  radius: [8, 8, 0, 0]
}

// Pie Chart Configuration
export const PIE_CHART_CONFIG = {
  cx: '50%',
  cy: '50%',
  innerRadius: 60,
  outerRadius: 90,
  paddingAngle: 3
}

// Tooltip Configuration
export const TOOLTIP_CONFIG = {
  contentStyle: {
    backgroundColor: 'hsl(var(--popover))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '12px'
  }
}

// CartesianGrid Configuration
export const CARTESIAN_GRID_CONFIG = {
  strokeDasharray: '3 3',
  stroke: 'hsl(var(--border))'
}

// XAxis Configuration
export const XAXIS_CONFIG = {
  stroke: 'hsl(var(--muted-foreground))'
}

// YAxis Configuration
export const YAXIS_CONFIG = {
  stroke: 'hsl(var(--muted-foreground))'
}

// Line Chart Legend Items
export const LINE_CHART_LEGEND_ITEMS = [
  {
    color: 'bg-blue-500',
    label: 'Total Leads'
  },
  {
    color: 'bg-green-500',
    label: 'Converted'
  },
  {
    color: 'bg-amber-500',
    label: 'Pending'
  }
]
