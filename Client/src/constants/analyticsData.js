/**
 * Analytics Data Constants
 *
 * Static data for the Analytics dashboard.
 */

export const monthlyLeadTrend = [
  { month: 'Jan', totalLeads: 2450, qualifiedLeads: 890, convertedLeads: 420, target: 2000 },
  { month: 'Feb', totalLeads: 3200, qualifiedLeads: 1120, convertedLeads: 580, target: 2200 },
  { month: 'Mar', totalLeads: 2890, qualifiedLeads: 980, convertedLeads: 520, target: 2400 },
  { month: 'Apr', totalLeads: 4100, qualifiedLeads: 1450, convertedLeads: 780, target: 2600 },
  { month: 'May', totalLeads: 5200, qualifiedLeads: 1890, convertedLeads: 980, target: 2800 },
  { month: 'Jun', totalLeads: 6800, qualifiedLeads: 2450, convertedLeads: 1280, target: 3000 },
  { month: 'Jul', totalLeads: 8542, qualifiedLeads: 3120, convertedLeads: 1680, target: 3200 }
]

export const countryWiseLeads = [
  { country: 'United States', leads: 2850, conversion: 28.5, growth: 15.2 },
  { country: 'United Kingdom', leads: 1890, conversion: 32.1, growth: 8.7 },
  { country: 'Canada', leads: 1560, conversion: 26.8, growth: 12.3 },
  { country: 'Australia', leads: 980, conversion: 24.5, growth: 18.9 },
  { country: 'Germany', leads: 720, conversion: 30.2, growth: 6.4 },
  { country: 'India', leads: 542, conversion: 22.1, growth: 22.8 }
]

export const employeePerformance = [
  { name: 'Sarah Johnson', leadsGenerated: 156, conversionRate: 28.5, customerSatisfaction: 92, targetAchievement: 118 },
  { name: 'Michael Chen', leadsGenerated: 142, conversionRate: 31.2, customerSatisfaction: 88, targetAchievement: 125 },
  { name: 'Emily Davis', leadsGenerated: 128, conversionRate: 26.8, customerSatisfaction: 95, targetAchievement: 108 },
  { name: 'Robert Wilson', leadsGenerated: 118, conversionRate: 29.7, customerSatisfaction: 86, targetAchievement: 112 },
  { name: 'Lisa Anderson', leadsGenerated: 105, conversionRate: 24.3, customerSatisfaction: 90, targetAchievement: 98 }
]

export const conversionAnalytics = [
  { stage: 'Lead Generated', count: 8542, conversionRate: 100, dropOff: 0 },
  { stage: 'Qualified', count: 3120, conversionRate: 36.5, dropOff: 63.5 },
  { stage: 'Proposal Sent', count: 2450, conversionRate: 28.7, dropOff: 71.3 },
  { stage: 'Negotiation', count: 1890, conversionRate: 22.1, dropOff: 77.9 },
  { stage: 'Closed Won', count: 1680, conversionRate: 19.7, dropOff: 80.3 }
]

export const leadSourceAnalytics = [
  { source: 'Website', leads: 2989, conversion: 24.5, revenue: 892000, cost: 45000 },
  { source: 'Social Media', leads: 2392, conversion: 18.2, revenue: 578000, cost: 38000 },
  { source: 'Email Campaign', leads: 1708, conversion: 31.8, revenue: 682000, cost: 25000 },
  { source: 'Referrals', leads: 1025, conversion: 42.1, revenue: 512000, cost: 15000 },
  { source: 'Cold Calls', leads: 428, conversion: 12.3, revenue: 85000, cost: 28000 },
  { source: 'Partners', leads: 856, conversion: 28.9, revenue: 342000, cost: 20000 }
]

export const performanceRadar = [
  { metric: 'Lead Generation', actual: 85, target: 100 },
  { metric: 'Conversion Rate', actual: 92, target: 100 },
  { metric: 'Customer Satisfaction', actual: 88, target: 100 },
  { metric: 'Revenue Growth', actual: 78, target: 100 },
  { metric: 'Cost Efficiency', actual: 95, target: 100 },
  { metric: 'Team Productivity', actual: 82, target: 100 }
]

export const analyticsStats = [
  {
    title: 'Total Leads',
    value: '8,542',
    change: '+23.5%',
    trend: 'up',
    icon: 'Users',
    color: 'from-blue-500 to-cyan-600',
    description: 'Generated this month'
  },
  {
    title: 'Conversion Rate',
    value: '19.7%',
    change: '+3.2%',
    trend: 'up',
    icon: 'Target',
    color: 'from-green-500 to-emerald-600',
    description: 'Overall conversion'
  },
  {
    title: 'Revenue Generated',
    value: '$3.09M',
    change: '+18.7%',
    trend: 'up',
    icon: 'DollarSign',
    color: 'from-purple-500 to-pink-600',
    description: 'Total revenue'
  },
  {
    title: 'Active Countries',
    value: '6',
    change: '+2',
    trend: 'up',
    icon: 'Globe',
    color: 'from-orange-500 to-red-600',
    description: 'Markets served'
  }
]
