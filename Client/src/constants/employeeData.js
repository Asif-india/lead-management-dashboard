/**
 * Employee Data Constants
 *
 * Static data for the Employees page.
 */

import { Users, UserCheck, Building2, TrendingUp } from 'lucide-react'

// Employee Statistics
export const employeeStats = [
  {
    title: 'Total Employees',
    value: '248',
    change: '+12%',
    trend: 'up',
    icon: 'Users',
    color: 'from-blue-500 to-cyan-600',
    description: 'Across all departments'
  },
  {
    title: 'Active Employees',
    value: '235',
    change: '+5%',
    trend: 'up',
    icon: 'UserCheck',
    color: 'from-green-500 to-emerald-600',
    description: 'Currently working'
  },
  {
    title: 'Departments',
    value: '6',
    change: '0',
    trend: 'neutral',
    icon: 'Building2',
    color: 'from-purple-500 to-pink-600',
    description: 'Total departments'
  },
  {
    title: 'Avg Performance',
    value: '86%',
    change: '+8%',
    trend: 'up',
    icon: 'TrendingUp',
    color: 'from-orange-500 to-red-600',
    description: 'Company average'
  }
]

// Comprehensive Employee Data
export const employees = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Sales',
    position: 'Sales Manager',
    status: 'active',
    joinDate: '2022-03-15',
    salary: '$85,000',
    performance: 92,
    location: 'New York, USA',
    avatar: 'SJ',
    skills: ['Leadership', 'Negotiation', 'CRM'],
    projects: 12,
    education: 'MBA - Harvard Business School',
    experience: '8 years'
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    phone: '+1 (555) 234-5678',
    department: 'Marketing',
    position: 'Marketing Director',
    status: 'active',
    joinDate: '2021-07-22',
    salary: '$95,000',
    performance: 88,
    location: 'San Francisco, USA',
    avatar: 'MC',
    skills: ['Strategy', 'Analytics', 'Branding'],
    projects: 18,
    education: 'MS Marketing - Stanford',
    experience: '10 years'
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    phone: '+1 (555) 345-6789',
    department: 'Engineering',
    position: 'Senior Developer',
    status: 'active',
    joinDate: '2020-11-10',
    salary: '$110,000',
    performance: 95,
    location: 'Austin, USA',
    avatar: 'ED',
    skills: ['React', 'Node.js', 'Python'],
    projects: 24,
    education: 'BS Computer Science - MIT',
    experience: '6 years'
  },
  {
    id: 4,
    name: 'Robert Wilson',
    email: 'robert.wilson@company.com',
    phone: '+1 (555) 456-7890',
    department: 'HR',
    position: 'HR Manager',
    status: 'active',
    joinDate: '2021-02-28',
    salary: '$75,000',
    performance: 85,
    location: 'Chicago, USA',
    avatar: 'RW',
    skills: ['Recruitment', 'Training', 'Compliance'],
    projects: 8,
    education: 'MA HR Management - Yale',
    experience: '7 years'
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    email: 'lisa.anderson@company.com',
    phone: '+1 (555) 567-8901',
    department: 'Finance',
    position: 'Financial Analyst',
    status: 'on_leave',
    joinDate: '2022-08-15',
    salary: '$80,000',
    performance: 78,
    location: 'Boston, USA',
    avatar: 'LA',
    skills: ['Excel', 'Financial Modeling', 'Reporting'],
    projects: 15,
    education: 'BA Finance - NYU',
    experience: '4 years'
  },
  {
    id: 6,
    name: 'James Taylor',
    email: 'james.taylor@company.com',
    phone: '+1 (555) 678-9012',
    department: 'Sales',
    position: 'Sales Representative',
    status: 'active',
    joinDate: '2023-01-10',
    salary: '$65,000',
    performance: 82,
    location: 'Los Angeles, USA',
    avatar: 'JT',
    skills: ['Sales', 'Communication', 'CRM'],
    projects: 6,
    education: 'BA Business - UCLA',
    experience: '2 years'
  },
  {
    id: 7,
    name: 'Maria Garcia',
    email: 'maria.garcia@company.com',
    phone: '+1 (555) 789-0123',
    department: 'Engineering',
    position: 'UI/UX Designer',
    status: 'active',
    joinDate: '2022-05-20',
    salary: '$90,000',
    performance: 90,
    location: 'Seattle, USA',
    avatar: 'MG',
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    projects: 20,
    education: 'BFA Design - RISD',
    experience: '5 years'
  },
  {
    id: 8,
    name: 'David Brown',
    email: 'david.brown@company.com',
    phone: '+1 (555) 890-1234',
    department: 'Marketing',
    position: 'Content Strategist',
    status: 'inactive',
    joinDate: '2021-09-15',
    salary: '$70,000',
    performance: 75,
    location: 'Denver, USA',
    avatar: 'DB',
    skills: ['Content Writing', 'SEO', 'Analytics'],
    projects: 14,
    education: 'MA Journalism - Columbia',
    experience: '6 years'
  },
  {
    id: 9,
    name: 'Jennifer Martinez',
    email: 'jennifer.martinez@company.com',
    phone: '+1 (555) 901-2345',
    department: 'Engineering',
    position: 'DevOps Engineer',
    status: 'active',
    joinDate: '2021-12-01',
    salary: '$105,000',
    performance: 89,
    location: 'Portland, USA',
    avatar: 'JM',
    skills: ['AWS', 'Docker', 'Kubernetes'],
    projects: 22,
    education: 'MS Computer Science - CMU',
    experience: '7 years'
  },
  {
    id: 10,
    name: 'Christopher Lee',
    email: 'chris.lee@company.com',
    phone: '+1 (555) 012-3456',
    department: 'Finance',
    position: 'Senior Accountant',
    status: 'active',
    joinDate: '2020-06-15',
    salary: '$85,000',
    performance: 87,
    location: 'Miami, USA',
    avatar: 'CL',
    skills: ['Accounting', 'Tax Preparation', 'Auditing'],
    projects: 18,
    education: 'MS Accounting - UT Austin',
    experience: '9 years'
  }
]

// Department filter options
export const departments = ['all', 'Sales', 'Marketing', 'Engineering', 'HR', 'Finance']

// Status filter options
export const statuses = ['all', 'active', 'on_leave', 'inactive']
