/**
 * Incentive Data Constants
 *
 * Static data for the Incentives dashboard.
 */

export const incentiveStats = [
  {
    title: 'Active Incentives',
    value: '24',
    change: '+8.3%',
    trend: 'up',
    icon: 'Target',
    color: 'from-blue-500 to-cyan-600',
    description: 'Currently running'
  },
  {
    title: 'Total Payout',
    value: '$284.5K',
    change: '+23.7%',
    trend: 'up',
    icon: 'DollarSign',
    color: 'from-green-500 to-emerald-600',
    description: 'This quarter'
  },
  {
    title: 'Participants',
    value: '486',
    change: '+15.2%',
    trend: 'up',
    icon: 'Users',
    color: 'from-purple-500 to-pink-600',
    description: 'Active employees'
  },
  {
    title: 'Avg. Incentive',
    value: '$585',
    change: '+5.8%',
    trend: 'up',
    icon: 'Award',
    color: 'from-orange-500 to-red-600',
    description: 'Per employee'
  }
]

export const monthlyIncentiveData = [
  { month: 'Jan', total: 45000, claimed: 42000, pending: 3000, participants: 45 },
  { month: 'Feb', total: 52000, claimed: 48000, pending: 4000, participants: 52 },
  { month: 'Mar', total: 61000, claimed: 58000, pending: 3000, participants: 61 },
  { month: 'Apr', total: 58000, claimed: 55000, pending: 3000, participants: 58 },
  { month: 'May', total: 72000, claimed: 68000, pending: 4000, participants: 72 },
  { month: 'Jun', total: 85000, claimed: 81000, pending: 4000, participants: 85 }
]

export const employeeLeaderboard = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'SJ',
    department: 'Sales',
    totalIncentives: 12,
    totalEarned: 24500,
    currentMonth: 8500,
    rank: 1,
    trend: 'up',
    performance: 95,
    badges: ['Top Performer', 'Sales Champion']
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'MC',
    department: 'Marketing',
    totalIncentives: 10,
    totalEarned: 19800,
    currentMonth: 6200,
    rank: 2,
    trend: 'up',
    performance: 88,
    badges: ['Marketing Star']
  },
  {
    id: 3,
    name: 'Emily Davis',
    avatar: 'ED',
    department: 'Sales',
    totalIncentives: 11,
    totalEarned: 18200,
    currentMonth: 5800,
    rank: 3,
    trend: 'down',
    performance: 82,
    badges: ['Rising Star']
  },
  {
    id: 4,
    name: 'Robert Wilson',
    avatar: 'RW',
    department: 'Customer Success',
    totalIncentives: 8,
    totalEarned: 15600,
    currentMonth: 4500,
    rank: 4,
    trend: 'up',
    performance: 79,
    badges: ['Customer Hero']
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    avatar: 'LA',
    department: 'HR',
    totalIncentives: 7,
    totalEarned: 12400,
    currentMonth: 3200,
    rank: 5,
    trend: 'up',
    performance: 75,
    badges: []
  }
]

export const incentiveDistribution = [
  { type: 'Performance Bonus', value: 35, amount: 99575, color: '#3b82f6' },
  { type: 'Sales Commission', value: 28, amount: 79660, color: '#8b5cf6' },
  { type: 'Referral Bonus', value: 18, amount: 51210, color: '#10b981' },
  { type: 'Recognition Award', value: 12, amount: 34140, color: '#f59e0b' },
  { type: 'Team Bonus', value: 7, amount: 19915, color: '#ef4444' }
]

export const incentiveTableData = [
  {
    id: 1,
    employeeName: 'Sarah Johnson',
    employeeId: 'EMP001',
    department: 'Sales',
    incentiveType: 'Performance Bonus',
    amount: 2500,
    status: 'approved',
    date: '2024-06-15',
    quarter: 'Q2 2024',
    calculatedBy: 'System',
    notes: 'Exceeded Q2 sales target by 125%'
  },
  {
    id: 2,
    employeeName: 'Michael Chen',
    employeeId: 'EMP002',
    department: 'Marketing',
    incentiveType: 'Campaign Success',
    amount: 1800,
    status: 'pending',
    date: '2024-06-14',
    quarter: 'Q2 2024',
    calculatedBy: 'Manager',
    notes: 'Successful product launch campaign'
  },
  {
    id: 3,
    employeeName: 'Emily Davis',
    employeeId: 'EMP003',
    department: 'Sales',
    incentiveType: 'Referral Bonus',
    amount: 1200,
    status: 'approved',
    date: '2024-06-13',
    quarter: 'Q2 2024',
    calculatedBy: 'System',
    notes: 'Referred 3 new clients'
  },
  {
    id: 4,
    employeeName: 'Robert Wilson',
    employeeId: 'EMP004',
    department: 'Customer Success',
    incentiveType: 'Customer Satisfaction',
    amount: 1500,
    status: 'processing',
    date: '2024-06-12',
    quarter: 'Q2 2024',
    calculatedBy: 'System',
    notes: '98% customer satisfaction score'
  },
  {
    id: 5,
    employeeName: 'Lisa Anderson',
    employeeId: 'EMP005',
    department: 'HR',
    incentiveType: 'Recognition Award',
    amount: 800,
    status: 'approved',
    date: '2024-06-11',
    quarter: 'Q2 2024',
    calculatedBy: 'Manager',
    notes: 'Outstanding team leadership'
  }
]
