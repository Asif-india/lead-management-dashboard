import {
  Users,
  CheckCircle,
  Clock,
  Award,
  Target,
  AlertCircle
} from 'lucide-react'

/**
 * Dashboard Data
 *
 * Static data arrays for the SaasDashboard component.
 * Extracted from SaasDashboard.jsx for better architecture.
 */

// KPI Statistics for LeadGen Pro
export const kpiStats = [
  {
    title: 'Total Leads',
    value: '8,542',
    change: '+23.5%',
    trend: 'up',
    icon: Users,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500/10',
    description: 'Generated this month'
  },
  {
    title: 'Converted Leads',
    value: '2,136',
    change: '+18.2%',
    trend: 'up',
    icon: CheckCircle,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    description: 'Successfully converted'
  },
  {
    title: 'Pending Leads',
    value: '1,247',
    change: '-8.4%',
    trend: 'down',
    icon: Clock,
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-500/10',
    description: 'Awaiting follow-up'
  },
  {
    title: 'Total Incentives',
    value: '$45,280',
    change: '+31.7%',
    trend: 'up',
    icon: Award,
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-500/10',
    description: 'Paid out this quarter'
  }
]

// Lead Generation Trend Data (Line Chart)
export const leadTrendData = [
  { month: 'Jan', totalLeads: 2450, convertedLeads: 680, pendingLeads: 420 },
  { month: 'Feb', totalLeads: 3200, convertedLeads: 890, pendingLeads: 510 },
  { month: 'Mar', totalLeads: 2890, convertedLeads: 920, pendingLeads: 380 },
  { month: 'Apr', totalLeads: 4100, convertedLeads: 1180, pendingLeads: 620 },
  { month: 'May', totalLeads: 5200, convertedLeads: 1450, pendingLeads: 750 },
  { month: 'Jun', totalLeads: 6800, convertedLeads: 1890, pendingLeads: 890 },
  { month: 'Jul', totalLeads: 8542, convertedLeads: 2136, pendingLeads: 1247 }
]

// Lead Sources Distribution (Doughnut Chart)
export const leadSourcesData = [
  { name: 'Website', value: 35, color: '#3b82f6' },
  { name: 'Social Media', value: 28, color: '#8b5cf6' },
  { name: 'Email Campaign', value: 20, color: '#10b981' },
  { name: 'Referrals', value: 12, color: '#f59e0b' },
  { name: 'Cold Calls', value: 5, color: '#ef4444' }
]

// Conversion Rate by Channel (Bar Chart)
export const conversionRateData = [
  { channel: 'Website', rate: 24.5, leads: 2989 },
  { channel: 'Social Media', rate: 18.2, leads: 2392 },
  { channel: 'Email Campaign', rate: 31.8, leads: 1708 },
  { channel: 'Referrals', rate: 42.1, leads: 1025 },
  { channel: 'Cold Calls', rate: 12.3, leads: 427 }
]

// Recent Activity
export const recentActivity = [
  {
    id: 1,
    type: 'lead_converted',
    message: 'Sarah Johnson converted to customer',
    value: '$8,500',
    time: '2 minutes ago',
    icon: CheckCircle,
    color: 'text-green-400'
  },
  {
    id: 2,
    type: 'new_lead',
    message: 'New high-value lead from Tech Corp',
    value: '$12,000',
    time: '15 minutes ago',
    icon: Users,
    color: 'text-blue-400'
  },
  {
    id: 3,
    type: 'incentive_earned',
    message: 'Michael Chen earned performance bonus',
    value: '$2,500',
    time: '1 hour ago',
    icon: Award,
    color: 'text-purple-400'
  },
  {
    id: 4,
    type: 'lead_pending',
    message: '3 leads require immediate follow-up',
    value: '3 leads',
    time: '2 hours ago',
    icon: AlertCircle,
    color: 'text-orange-400'
  },
  {
    id: 5,
    type: 'milestone_reached',
    message: 'Team reached 100% monthly target',
    value: '100%',
    time: '3 hours ago',
    icon: Target,
    color: 'text-green-400'
  }
]

// Top Performers
export const topPerformers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'SJ',
    leads: 156,
    conversions: 42,
    conversionRate: 26.9,
    earnings: '$12,450',
    trend: 'up'
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'MC',
    leads: 142,
    conversions: 38,
    conversionRate: 26.8,
    earnings: '$11,200',
    trend: 'up'
  },
  {
    id: 3,
    name: 'Emily Davis',
    avatar: 'ED',
    leads: 128,
    conversions: 35,
    conversionRate: 27.3,
    earnings: '$10,800',
    trend: 'down'
  }
]
